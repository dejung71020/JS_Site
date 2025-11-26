// routers/auth.mjs
import express from "express";
import * as authController from "../controllers/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validateLogin = [
  body("userid")
    .trim()
    .isLength({ min: 4 })
    .withMessage("아이디 최소 4자이상 입력")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("특수문자 사용불가"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("비밀번호 최소 4자이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("name을 입력"),
  body("birth_year")
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("유효한 연도를 입력해야 합니다."),
  body("birth_month")
    .trim()
    .isInt({ min: 1, max: 12 })
    .withMessage("유효한 월을 선택해야 합니다."),
  body("birth_day")
    .trim()
    .isInt({ min: 1, max: 31 })
    .withMessage("유효한 일을 입력해야 합니다."),
  body("email").trim().isEmail().withMessage("email 형식 확인"),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("유효한 성별을 선택해야 합니다."),
  validate,
];
// 회원가입 정보 불러오기
router.get("/", authController.getUsers);

// 회원가입
router.post("/signup", validateSignup, authController.signupAuth);

// 로그인
router.post("/login", validateLogin, authController.loginAuth);

// 로그인 유지
router.post("/me", isAuth, authController.me);

export default router;
