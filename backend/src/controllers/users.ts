import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { parseActions, serializeActions } from "../helpers/actions.js";
import prisma from "../lib/prisma.js";
import type { CreateUserBody, RunActionBody, UpdateUserBody, User } from "../types/user.js";
import { UserService } from "../services/userService.js";

export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = await UserService.updateUser(id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await UserService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const runAction = async (
  req: Request<{}, {}, RunActionBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, action } = req.body;
    // const user = await UserService.getUserById(userId);
    const user = await UserService.getUserById(Number(userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.actions.includes(action)) {
      return res.status(401).json({
        error: `User is not allowed to execute "${action}"`,
      });
    }

    res.status(200).json({ message: `Action "${action}" executed successfully` });
  } catch (error) {
    next(error);
  }
};
