import { Router } from "express";
import { runAction } from "../controllers/users.js";
import { validate } from "../middleware/validate.js";
import { runActionSchema } from "../schemas/user.js";

const router = Router();

router.post("/", validate(runActionSchema), runAction);
export default router;
