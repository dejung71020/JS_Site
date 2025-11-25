// controller/post.mjs

import * as postRepository from "../data/post.mjs";

// 모든 포스트를 가져오는 함수
export async function getPosts(req, res, next) {
  const userid = req.query.userid;
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());
  res.status(200).json(data);
}

// 하나의 포스트를 가져오는 함수
export async function getPost(req, res, next) {
  const id = req.params.id;
  const post = await postRepository.getById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 포스트를 작성하는 함수
export async function createPost(req, res, next) {
  const { text } = req.body;
  console.log("req.idx", req.idx);
  const post = await postRepository.create(text, req.idx);
  res.status(200).json(post);
}

// 포스트를 수정하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const post = await postRepository.update(id, text);
  if (post) {
    res.status(201).json(post);
  } else {
    res.status(404).json({ message: `${id}에 대한 포스트가 없습니다.` });
  }
}

// 포스트를 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  console.log(id);
  await postRepository.remove(id);
  res.status(204).json({ message: `${id}에 대한 포스트가 삭제되었습니다.` });
}
