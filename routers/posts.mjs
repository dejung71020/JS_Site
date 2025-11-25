// router/posts.mjs
import express from "express";
import * as postController from "../controller/post.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();
const validatePost = [
  body("text").trim().isLength({ min: 4 }).withMessage("최소 4자 이상 입력"),
  validate,
];

// 전체 포스트 가져오기 (GET)
// 특정 아이디에 대한 포스트 가져오기 (GET)
//https://127.0.0.1:8080/post
//https://127.0.0.1:8080/post?userid=변수값
router.get("/", isAuth, postController.getPosts);

// 글번호에 대한 포스트 가져오기 (GET)
//https://127.0.0.1:8080/post/:id
router.get("/:id", isAuth, postController.getPost);

// 포스트 쓰기 (POST)
//https://127.0.0.1:8080/post
router.post("/", isAuth, validatePost, postController.createPost);

// 포스트 수정하기
//https://127.0.0.1:8080/post/:id
router.put("/:id", isAuth, validatePost, postController.updatePost);

// 포스트 삭제하기
//https://127.0.0.1:8080/post/:id
router.delete("/:id", isAuth, postController.deletePost);

export default router;
