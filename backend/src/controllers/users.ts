import type { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService.js";
import type { Action, CreateUserBody, RunActionBody, UpdateUserBody } from "../types/user.js";

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

export const createSampleUser = async (
  req: Request<{}, {}, RunActionBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const sample = {
      firstname: "Sample",
      lastname: "User",
      email: `sample${Date.now().toString().slice(-5)}@example.com`,
      actions: ["create-item", "view-item", "delete-item"] as Action[],
    };

    const user = await UserService.createUser(sample);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
