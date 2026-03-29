import cors from "cors";
import "dotenv/config";
import express from "express";
import actionRouter from "./routes/action.js";
import userRouter from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/user", userRouter);
app.use("/action", actionRouter);

app.use(errorHandler);

export default app;
