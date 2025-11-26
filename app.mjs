// app.mjs
import express from "express";
// import postRouter from "./routers/posts.mjs";
import authRouter from "./routers/auth.mjs";
import { config } from "./config/config.mjs";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
// app.use("/post", postRouter);

app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

// db.getConnection().then((connection) => {
//   console.log("DB 연결 성공:", connection.threadId);
// });
app.listen(config.host.port, () => {
  console.log("서버 실행중", config.host.port);
});
