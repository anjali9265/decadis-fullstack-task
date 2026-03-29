import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { validate, validateParams } from "../middleware/validate.js";
import { createUserSchema, idParamSchema, updateUserSchema } from "../schemas/user.js";

const router = Router();

router.post("/", validate(createUserSchema), createUser);
router.get("/", getAllUsers);
router.get("/:id", validateParams(idParamSchema), getUserById);
router.put("/:id", validateParams(idParamSchema), validate(updateUserSchema), updateUser);
router.delete("/:id", validateParams(idParamSchema), deleteUser);

export default router;
