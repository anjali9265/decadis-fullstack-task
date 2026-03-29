import { z } from "zod";

export const createUserSchema = z.object({
  firstname: z.string().trim().min(1, "Firstname is required"),
  lastname: z.string().trim().min(1, "Lastname is required"),
  email: z.email("Invalid email format"),
  actions: z.array(z.string()).default([]),
});

export const updateUserSchema = z.object({
  firstname: z.string().trim().min(1).optional(),
  lastname: z.string().trim().min(1).optional(),
  email: z.email().optional(),
  actions: z.array(z.string()).optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid user ID"),
});

export const runActionSchema = z.object({
  userId: z.coerce.number(),
  action: z.enum(["create-item", "delete-item", "view-item", "move-item"]),
});
