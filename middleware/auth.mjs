// middleware/auth.mjs
import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
import { config } from "../config/config.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(" ")[1];
  console.log("토큰 분리 성공", token);

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러", error);
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("디코드 성공", decoded.idx);
    const user = await authRepository.findById(decoded.idx);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("user.idx =", user.idx);
    console.log("user.userid =", user.userid);
    req.idx = user.idx;
    next();
  });
};
