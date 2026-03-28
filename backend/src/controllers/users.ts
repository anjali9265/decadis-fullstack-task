import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { parseActions, serializeActions } from "../helpers/actions.js";
import prisma from "../lib/prisma.js";
import type { CreateUserBody, RunActionBody, UpdateUserBody, User } from "../types/user.js";

export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { firstname, lastname, email, actions } = req.body;

  if (!firstname || !lastname || !email) {
    res.status(400).json({ error: "firstname, lastname and email are required" });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        actions: serializeActions(actions ?? []),
      },
    });

    res.status(201).json({ ...user, actions: parseActions(user.actions) } as User);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users.map((u) => ({ ...u, actions: parseActions(u.actions) })) as User[]);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ ...user, actions: parseActions(user.actions) } as User);
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response
) => {
  const { firstname, lastname, email, actions } = req.body;

  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  if (firstname !== undefined && !firstname.trim()) {
    res.status(400).json({ error: "Firstname cannot be empty" });
    return;
  }
  if (lastname !== undefined && !lastname.trim()) {
    res.status(400).json({ error: "Lastname cannot be empty" });
    return;
  }
  if (email !== undefined && !email.trim()) {
    res.status(400).json({ error: "Email cannot be empty" });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(firstname !== undefined && { firstname }),
        ...(lastname !== undefined && { lastname }),
        ...(email !== undefined && { email }),
        ...(actions !== undefined && { actions: serializeActions(actions) }),
      },
    });

    res.json({ ...user, actions: parseActions(user.actions) } as User);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch {
    res.status(404).json({ error: "User not found" });
  }
};

export const runAction = async (req: Request<{}, {}, RunActionBody>, res: Response) => {
  const { userId, action } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const userActions = parseActions(user.actions);

  if (!userActions.includes(action)) {
    res.status(401).json({ error: `User is not allowed to execute "${action}"` });
    return;
  }

  res.status(200).json({ message: `Action "${action}" executed successfully` });
};
