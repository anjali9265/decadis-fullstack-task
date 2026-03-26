import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter, { runAction } from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "ok" });
});
app.use("/user", userRouter);
app.post("/action", runAction);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});