// controllers/auth.mjs
import express, { urlencoded } from "express";
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";

async function createJwtToken(idx) {
  return jwt.sign({ idx }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function getUsers(req, res, next) {
  const data = await authRepository.getAll();
  res.status(200).json(data);
}

export async function signupAuth(req, res, next) {
  const {
    userid,
    password,
    name,
    birth_year,
    birth_month,
    birth_day,
    email,
    gender,
  } = req.body;

  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
  }

  const hashed = bcrypt.hashSync(password, config.bycrpt.saltRounds);
  const user = await authRepository.signup({
    userid,
    password: hashed,
    name,
    birth_year,
    birth_month,
    birth_day,
    email,
    gender,
  });

  const token = await createJwtToken(user.idx);
  res.status(201).json({ token, user });
}

export async function loginAuth(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: "유저를 찾을 수 없습니다." });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  console.log(isValidPassword);
  if (!isValidPassword) {
    return res.status(401).json({ message: "비밀번호를 확인하세요" });
  }
  const auth = "s";
  const err = "erorr";
  if (auth) {
    const token = await createJwtToken(user.idx);
    res.status(200).json({ token, user });
  } else {
    res.status(404).json({ message: `${err}` });
  }
}

export async function me(req, res, next) {
  const user = await authRepository.findById(req.idx);
  if (!user) {
    res.status(404).json({ message: "일치하는 사용자가 없습니다." });
  }
  res
    .status(200)
    .json({ token: req.token, useridx: user.idx, userid: user.userid });
}
