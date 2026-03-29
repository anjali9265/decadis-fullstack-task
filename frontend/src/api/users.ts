import api from "./axios";
import type { User, Action } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get(`${BASE_URL}/user`);
  return res.data;
};

export const getUser = async (id: number): Promise<User> => {
  const res = await api.get(`${BASE_URL}/user/${id}`);
  return res.data;
};

export const createUser = async (data: Omit<User, "id">): Promise<User> => {
  const res = await api.post(`${BASE_URL}/user`, data);
  return res.data;
};

export const updateUser = async (id: number, data: Partial<Omit<User, "id">>): Promise<User> => {
  const res = await api.put(`${BASE_URL}/user/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/user/${id}`);
};

export const runAction = async (userId: number, action: Action) => {
    const res = await api.post(`${BASE_URL}/action`, { userId, action });
    return { status: res.status, data: res.data };
};
