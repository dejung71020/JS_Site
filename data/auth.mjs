// data/auth.mjs
import { db } from "../db/database.mjs";

export async function signup(user) {
  const {
    userid,
    password,
    name,
    birth_year,
    birth_month,
    birth_day,
    email,
    gender,
  } = user;
  return db
    .execute(
      "INSERT INTO user (userid, password, name,birth_year, birth_month, birth_day, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userid,
        password,
        name,
        birth_year,
        birth_month,
        birth_day,
        email,
        gender,
      ]
    )
    .then((result) => result[0].insertId);
}

export async function getAll() {
  return db.execute("SELECT * FROM user").then((result) => result[0]);
}

export async function findByUserid(userid) {
  return db
    .execute("SELECT idx, password FROM user WHERE userid=?", [userid])
    .then((result) => {
      console.log(result);
      return result[0][0];
    });
}

export async function findById(idx) {
  return db
    .execute("SELECT idx, userid FROM user WHERE idx=?", [idx])
    .then((result) => result[0][0]);
}
