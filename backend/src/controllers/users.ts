import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { parseActions, serializeActions } from "../helpers/actions.js";
import type { CreateUserBody, RunActionBody, UpdateUserBody, User } from "../types/user.js";

export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { firstname, lastname, email, actions } = req.body;

  if (!firstname || !lastname || !email) {
    res.status(400).json({ error: "firstname, lastname and email are required" });
    return;
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
  } catch {
    res.status(409).json({ error: "A user with this email already exists" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users.map((u) => ({ ...u, actions: parseActions(u.actions) })) as User[]);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ ...user, actions: parseActions(user.actions) } as User);
};

export const updateUser = async (req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {
  const { firstname, lastname, email, actions } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(actions && { actions: serializeActions(actions) }),
      },
    });

    res.json({ ...user, actions: parseActions(user.actions) } as User);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
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
