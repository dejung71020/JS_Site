// controllers/post.mjs (최종 수정 버전)

import * as postRepository from "../data/post.mjs";

// ----------------------------------------------------
// 1. 모든 게시글 조회 (GET /post)
// ----------------------------------------------------
export async function getPosts(req, res) {
  const userid = req.query.userid; // 쿼리 필터링은 useridx가 아닌 userid로
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());

  res.status(200).json(data);
}

// ----------------------------------------------------
// 2. 특정 게시글 조회 (GET /post/:idx)
// ----------------------------------------------------
export async function getPost(req, res) {
  const idx = req.params.idx; // URL 파라미터를 idx로 사용
  const post = await postRepository.getByIdx(idx);

  if (post) {
    res.status(200).json(post);
  } else {
    // 404 Not Found
    res.status(404).json({ message: `게시글 ID ${idx}를 찾을 수 없습니다.` });
  }
}

// ----------------------------------------------------
// 3. 새 게시글 생성 (POST /posts)
// ----------------------------------------------------
export async function createPost(req, res) {
  // title과 text를 모두 받습니다.
  const { title, text } = req.body;
  const useridx = req.idx; // isAuth 미들웨어에서 추가된 정보
  // 제목 및 내용 기본 검증
  if (!title || title.length === 0 || !text || text.length === 0) {
    return res
      .status(400)
      .json({ message: "제목과 내용을 모두 입력해주세요." });
  }

  // 데이터 모듈 호출 시 title 매개변수 추가
  const post = await postRepository.create(title, text, useridx);

  // 201 Created 응답
  res.status(201).json(post);
}

// ----------------------------------------------------
// 4. 게시글 수정 (PUT /posts/:idx)
// ----------------------------------------------------
export async function updatePost(req, res) {
  const idx = req.params.idx;
  const { title, text } = req.body; // title 추가
  const useridx = req.idx; // 현재 로그인된 사용자

  // 제목 및 내용 기본 검증
  if (!title || title.length === 0 || !text || text.length === 0) {
    return res
      .status(400)
      .json({ message: "제목과 내용을 모두 입력해주세요." });
  }

  const post = await postRepository.getByIdx(idx);
  console.log(`useridx = ${useridx}`);
  console.log(`post.useridx = ${post.useridx}`);
  // 1. 게시글 존재 유무 확인
  if (!post) {
    return res
      .status(404)
      .json({ message: `게시글 ID ${idx}를 찾을 수 없습니다.` });
  }

  // 2. 작성자 본인 확인 (권한 체크)
  if (post.useridx !== useridx) {
    // 403 Forbidden
    return res
      .status(403)
      .json({ message: "해당 게시글을 수정할 권한이 없습니다." });
  }

  // 3. 수정 실행 (title 매개변수 추가)
  const updated = await postRepository.update(idx, title, text);
  res.status(200).json(updated);
}

// ----------------------------------------------------
// 5. 게시글 삭제 (DELETE /posts/:idx)
// ----------------------------------------------------
export async function deletePost(req, res) {
  const idx = req.params.idx;
  const useridx = req.idx; // 현재 로그인된 사용자

  console.log(`idx = ${idx}`);
  console.log(`useridx = ${useridx}`);

  const post = await postRepository.getByIdx(idx);

  // 1. 게시글 존재 유무 확인
  if (!post) {
    // 404 Not Found
    return res
      .status(404)
      .json({ message: `게시글 ID ${idx}를 찾을 수 없습니다.` });
  }

  // 2. 작성자 본인 확인 (권한 체크)
  if (post.useridx !== useridx) {
    // 403 Forbidden
    return res
      .status(403)
      .json({ message: "해당 게시글을 삭제할 권한이 없습니다." });
  }

  // 3. 삭제 실행 (Soft Delete)
  await postRepository.remove(idx);
  // 204 No Content
  res.sendStatus(204);
}
