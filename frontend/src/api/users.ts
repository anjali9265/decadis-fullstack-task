import type { User, Action } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/user`);
  return res.json();
};

export const getUser = async (id: number): Promise<User> => {
  const res = await fetch(`${BASE_URL}/user/${id}`);
  return res.json();
};

export const createUser = async (data: Omit<User, "id">): Promise<User> => {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateUser = async (id: number, data: Partial<Omit<User, "id">>): Promise<User> => {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/user/${id}`, { method: "DELETE" });
};

export const runAction = async (userId: number, action: Action) => {
  const res = await fetch(`${BASE_URL}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action }),
  });
  return { status: res.status, data: await res.json() };
};