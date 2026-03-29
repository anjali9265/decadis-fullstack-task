import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/users.js";
import { runAction } from "./controllers/users.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/user", userRouter);
app.post("/action", runAction);

export default app;
