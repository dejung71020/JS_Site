// data/post.mjs
import { db } from "../db/database.mjs";

const selectJoin =
  "SELECT p.idx, p.useridx, p.text, p.createdAt, u.userid, u.name, u.url FROM users AS u JOIN posts AS p ON u.idx = p.useridx";

const ORDER_DESC = " ORDER BY p.idx DESC";
const ORDER_ASC = " ORDER BY p.idx ASC";

// 모든 포스트를 리턴
export async function getAll() {
  return db.execute(`${selectJoin} ${ORDER_DESC}`).then((result) => {
    return result[0];
  });
}

// 사용자 ID에 대한 포스트를 리턴
export async function getAllByUserid(userid) {
  return db
    .execute(`${selectJoin} WHERE u.userid=? ${ORDER_DESC}`, [userid])
    .then((result) => result[0]);
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getById(idx) {
  console.log("idx", idx);
  return db.execute(`${selectJoin} WHERE p.idx=?`, [idx]).then((result) => {
    console.log("result[0][0]", result[0][0]);
    return result[0][0];
  });
}

// 포스트를 작성
export async function create(text, idx) {
  return db
    .execute("INSERT INTO posts (useridx, text) VALUES (?, ?)", [idx, text])
    .then((result) => getById(result[0].insertId));
}

// 포스트를 변경
export async function update(id, text) {
  return db
    .execute("UPDATE posts SET text=? WHERE idx=?", [text, id])
    .then(() => getById(id));
}

// 포스트를 삭제
export async function remove(idx) {
  return db
    .execute("DELETE FROM posts WHERE idx=?", [idx])
    .then(() => console.log("삭제 완료"));
}
