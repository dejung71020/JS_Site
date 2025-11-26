// routers/posts.mjs
import express from "express";
import * as postController from "../controllers/post.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validatePost = [
  // 1. title 필드 검사
  body("title")
    .trim() // 공백 제거
    .isLength({ min: 1, max: 50 }) // 최소 4자, 최대 50자 제한
    .withMessage("제목은 최소 1자, 최대 50자 이내로 입력해주세요."),

  // 2. title 검사 결과를 즉시 처리
  validate,

  // 3. text 필드 검사
  body("text")
    .trim() // 공백 제거
    .isLength({ min: 1 }) // 최소 4자 이상
    .withMessage("내용은 최소 1자 이상 입력해주세요."),

  // 4. text 검사 결과를 즉시 처리
  validate,
];

// 전체 포스트 가져오기 (GET)
// 특정 사용자번호에 대한 포스트 가져오기 (GET)

router.get("/", isAuth, postController.getPosts);

// 글번호에 대한 포스트 가져오기 (GET)
//https://127.0.0.1:8080/post/:id
router.get("/:idx", isAuth, postController.getPost);

// 포스트 쓰기 (POST)
//https://127.0.0.1:8080/post
router.post("/", isAuth, validatePost, postController.createPost);

// 포스트 수정하기
//https://127.0.0.1:8080/post/:id
router.put("/:idx", isAuth, validatePost, postController.updatePost);

// 포스트 삭제하기
//https://127.0.0.1:8080/post/:id
router.delete("/:idx", isAuth, postController.deletePost);

export default router;
