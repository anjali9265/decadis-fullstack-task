import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import type { User } from "../types/user.js";

const mockUser: User = {
  id: 1,
  firstname: "Max",
  lastname: "Mustermann",
  email: "m.mustermann@test.de",
  actions: ["create-item","view-item"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFunctions = {
  create: jest.fn<() => Promise<typeof mockUser>>(),
  findMany: jest.fn<() => Promise<(typeof mockUser)[]>>(),
  findUnique: jest.fn<() => Promise<typeof mockUser | null>>(),
  update: jest.fn<() => Promise<typeof mockUser>>(),
  delete: jest.fn<() => Promise<typeof mockUser>>(),
};

jest.unstable_mockModule("../lib/prisma.js", () => ({
  default: { user: mockFunctions },
}));

const { createUser, getAllUsers, getUserById, updateUser, deleteUser, runAction } =
  await import("./users.js");


const mockReq = (body = {}, params = {}) => ({ body, params }) as any;

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("createUser", () => {
  it("should create a user and return 201", async () => {
    mockFunctions.create.mockResolvedValue(mockUser);

    const req = mockReq({
      firstname: "Max",
      lastname: "Mustermann",
      email: "m.mustermann@test.de",
      actions: ["create-item", "view-item"],
    });

    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ...mockUser,
      actions: ["create-item", "view-item"],
    });
  });

  it("should return 400 if required fields are missing", async () => {
    const req = mockReq({ firstname: "Max" });
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "firstname, lastname and email are required",
    });
  });

  it("should return 409 if email already exists", async () => {
    mockFunctions.create.mockRejectedValue(new Error("Unique constraint"));

    const req = mockReq({
      firstname: "Max",
      lastname: "Mustermann",
      email: "m.mustermann@test.de",
      actions: [],
    });

    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });
});

describe("getAllUsers", () => {
  it("should return all users with parsed actions", async () => {
    mockFunctions.findMany.mockResolvedValue([mockUser]);

    const req = mockReq();
    const res = mockRes();

    await getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([{ ...mockUser, actions: ["create-item", "view-item"] }]);
  });

  it("should return an empty array if no users", async () => {
    mockFunctions.findMany.mockResolvedValue([]);

    const req = mockReq();
    const res = mockRes();

    await getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("getUserById", () => {
  it("should return a user by id", async () => {
    mockFunctions.findUnique.mockResolvedValue(mockUser);

    const req = mockReq({}, { id: "1" });
    const res = mockRes();

    await getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ...mockUser,
      actions: ["create-item", "view-item"],
    });
  });

  it("should return 404 if user not found", async () => {
    mockFunctions.findUnique.mockResolvedValue(null);

    const req = mockReq({}, { id: "99" });
    const res = mockRes();

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("updateUser", () => {
  it("should update a user and return the updated user", async () => {
    const updatedUser = { ...mockUser, firstname: "Maximilian" };
    mockFunctions.update.mockResolvedValue(updatedUser);

    const req = mockReq({ firstname: "Maximilian" }, { id: "1" });
    const res = mockRes();

    await updateUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ...updatedUser,
      actions: ["create-item", "view-item"],
    });
  });

  it("should return 404 if user not found", async () => {
    mockFunctions.update.mockRejectedValue(new Error("Not found"));

    const req = mockReq({ firstname: "Maximilian" }, { id: "99" });
    const res = mockRes();

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteUser", () => {
  it("should delete a user and return 204", async () => {
    mockFunctions.delete.mockResolvedValue(mockUser);

    const req = mockReq({}, { id: "1" });
    const res = mockRes();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should return 404 if user not found", async () => {
    mockFunctions.delete.mockRejectedValue(new Error("Not found"));

    const req = mockReq({}, { id: "99" });
    const res = mockRes();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("runAction", () => {
  it("should return 200 if user is allowed to execute the action", async () => {
    mockFunctions.findUnique.mockResolvedValue(mockUser);

    const req = mockReq({ userId: 1, action: "create-item" });
    const res = mockRes();

    await runAction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Action "create-item" executed successfully`,
    });
  });

  it("should return 401 if user is not allowed to execute the action", async () => {
    mockFunctions.findUnique.mockResolvedValue(mockUser);

    const req = mockReq({ userId: 1, action: "delete-item" });
    const res = mockRes();

    await runAction(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: `User is not allowed to execute "delete-item"`,
    });
  });

  it("should return 404 if user not found", async () => {
    mockFunctions.findUnique.mockResolvedValue(null);

    const req = mockReq({ userId: 99, action: "create-item" });
    const res = mockRes();

    await runAction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
