import prisma from "../lib/prisma.js";
import { serializeActions, parseActions } from "../helpers/actions.js";
import type { CreateUserBody } from "../types/user.js";

export const UserService = {
  async createUser(data: CreateUserBody) {
    const user = await prisma.user.create({
      data: {
        ...data,
        actions: serializeActions(data.actions || []),
      },
    });

    return {
      ...user,
      actions: parseActions(user.actions),
    };
  },

  async getAllUsers() {
    const users = await prisma.user.findMany();
    return users.map((user) => ({
      ...user,
      actions: parseActions(user.actions),
    }));
  },

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? { ...user, actions: parseActions(user.actions) } : null;
  },

  async updateUser(id: number, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(data.actions && { actions: serializeActions(data.actions) }),
      },
    });

    return {
      ...user,
      actions: parseActions(user.actions),
    };
  },

  async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
