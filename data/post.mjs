// data/post.mjs
import { db } from "../db/database.mjs";
import * as postRepository from "../data/post.mjs";

const selectJoin = `
    SELECT p.idx, p.title, p.text, p.createdAt, p.updatedAt, p.useridx, u.userid, u.name 
    FROM post p 
    JOIN user u ON p.useridx = u.idx 
`;
// WHERE p.isDeleted = 0

const ORDER_DESC = " ORDER BY p.createdAt DESC";
const ORDER_ASC = " ORDER BY p.idx ASC";

// 모든 포스트를 리턴a// controllers/post.mjs

// ----------------------------------------------------
// 1. 모든 게시글 조회 (GET /post)
// ----------------------------------------------------
export async function getPosts(req, res) {
  const useridx = req.query.useridx;
  const data = await (useridx
    ? postRepository.getAllByUserid(useridx)
    : postRepository.getAll());

  res.status(200).json(data);
}

// ----------------------------------------------------
// 2. 특정 게시글 조회 (GET /post/:id)
// ----------------------------------------------------
export async function getPost(req, res) {
  const id = req.params.id;
  const post = await postRepository.getByIdx(id);

  if (post) {
    res.status(200).json(post);
  } else {
    // 404 Not Found
    res.status(404).json({ message: `게시글 ID ${id}를 찾을 수 없습니다.` });
  }
}

// ----------------------------------------------------
// 3. 새 게시글 생성 (POST /post)
// ----------------------------------------------------
export async function createPost(req, res) {
  // 폼에서 받은 text와 인증 미들웨어가 추가한 useridx 사용
  const { text } = req.body;
  const useridx = req.useridx; // isAuth 미들웨어에서 추가된 정보

  // 텍스트가 비어있는지 기본 검증
  if (!text || text.length === 0) {
    return res.status(400).json({ message: "게시글 내용을 입력해주세요." });
  }

  // 데이터 모듈을 통해 게시글 생성 후, 생성된 게시글 데이터를 반환
  const post = await postRepository.create(title, text, useridx);

  // 201 Created 응답
  res.status(201).json(post);
}

// ----------------------------------------------------
// 4. 게시글 수정 (PUT /post/:id)
// ----------------------------------------------------
export async function updatePost(req, res) {
  const id = req.params.id;
  const { text } = req.body;
  const useridx = req.useridx; // 현재 로그인된 사용자

  const post = await postRepository.getByIdx(id);

  // 1. 게시글 존재 유무 확인
  if (!post) {
    return res
      .status(404)
      .json({ message: `게시글 ID ${id}를 찾을 수 없습니다.` });
  }

  // 2. 작성자 본인 확인 (권한 체크)
  // 게시글 작성자(post.useridx)와 현재 로그인 사용자(req.useridx) 비교
  if (post.useridx !== useridx) {
    // 403 Forbidden
    return res
      .status(403)
      .json({ message: "해당 게시글을 수정할 권한이 없습니다." });
  }

  // 3. 수정 실행
  const updated = await postRepository.update(id, text);
  res.status(200).json(updated);
}

// ----------------------------------------------------
// 5. 게시글 삭제 (DELETE /post/:id)
// ----------------------------------------------------
export async function deletePost(req, res) {
  const idx = req.params.idx;
  const useridx = req.idx; // 현재 로그인된 사용자

  const post = await postRepository.getByIdx(id);

  // 1. 게시글 존재 유무 확인
  if (!post) {
    // 404 Not Found
    return res
      .status(404)
      .json({ message: `게시글 ID ${id}를 찾을 수 없습니다.` });
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
export async function getAll() {
  return db
    .execute(`${selectJoin} WHERE isDeleted=0 ${ORDER_DESC}`)
    .then((result) => {
      return result[0];
    });
}

// 사용자 ID에 대한 포스트를 리턴
export async function getAllByUserid(userid) {
  return db
    .execute(`${selectJoin} WHERE u.userid=? AND isDeleted=0 ${ORDER_DESC}`, [
      userid,
    ])
    .then((result) => result[0]);
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getByIdx(idx) {
  console.log("idx", idx);
  return db.execute(`${selectJoin} WHERE p.idx=?`, [idx]).then((result) => {
    console.log("result[0][0]", result[0][0]);
    return result[0][0];
  });
}

// 포스트를 작성
export async function create(title, text, useridx) {
  const now = new Date(); // 생성/수정 시간 정의

  // SQL 쿼리: title, text, useridx, createdAt, updatedAt 5개 컬럼 지정
  const SQL = `
    INSERT INTO post (title, text, useridx, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?)
  `;

  // 바인딩 값: SQL 컬럼 순서에 맞춰 5개의 값 지정
  return db
    .execute(SQL, [title, text, useridx, now, now]) // useridx는 세 번째 바인딩 값으로 정확히 전달
    .then((result) => getByIdx(result[0].insertId));
}

export async function update(idx, title, text) {
  const now = new Date();

  // SQL 쿼리: title과 text, updatedAt을 모두 업데이트
  const SQL = `
    UPDATE post 
    SET title=?, text=?, updatedAt=? 
    WHERE idx=?
  `;

  // 바인딩 값: title, text, now, idx 순서로 전달
  await db.execute(SQL, [title, text, now, idx]);

  // 변경 후 JOIN된 완전한 데이터를 반환
  return getByIdx(idx);
}

// 포스트를 삭제
export async function remove(idx) {
  // SQL 쿼리: DELETE 대신 UPDATE를 사용하여 isDeleted 플래그를 1로 변경
  const SQL = `
    UPDATE post
    SET isDeleted = 1 
    WHERE idx=?
  `;

  // db.execute만 실행하고 반환 값은 필요 없습니다 (204 No Content 응답 예정)
  return db.execute(SQL, [idx]);
}
