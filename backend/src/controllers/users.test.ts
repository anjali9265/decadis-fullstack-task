import { describe, expect, it, jest } from "@jest/globals";

const mockUser = {
  id: 1,
  firstname: "Max",
  lastname: "Mustermann",
  email: "m.mustermann@test.de",
  actions: ["create-item", "view-item"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserService = {
  createUser: jest.fn<() => Promise<typeof mockUser>>(),
  getAllUsers: jest.fn<() => Promise<(typeof mockUser)[]>>(),
  getUserById: jest.fn<() => Promise<typeof mockUser | null>>(),
  updateUser: jest.fn<() => Promise<typeof mockUser>>(),
  deleteUser: jest.fn<() => Promise<typeof mockUser>>(),
};

jest.unstable_mockModule("../services/userService.js", () => ({
  UserService: mockUserService,
}));

const { createUser, getAllUsers, getUserById, updateUser, deleteUser, runAction } =
  await import("../controllers/users.js");

const mockReq = (body = {}, params = {}) => ({ body, params }) as any;

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn();

describe("createUser", () => {
  it("should create a user and return 201", async () => {
    mockUserService.createUser.mockResolvedValue(mockUser);

    const req = mockReq({
      firstname: "Max",
      lastname: "Mustermann",
      email: "m.mustermann@test.de",
      actions: ["create-item", "view-item"],
    });

    const res = mockRes();
    const next = mockNext();

    await createUser(req, res, next);

    expect(mockUserService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("should forward errors to errorHandler", async () => {
    const error = new Error("DB failed");
    mockUserService.createUser.mockRejectedValue(error);

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await createUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("getAllUsers", () => {
  it("should return all users with parsed actions", async () => {
    mockUserService.getAllUsers.mockResolvedValue([mockUser]);

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await getAllUsers(req, res, next);

    expect(res.json).toHaveBeenCalledWith([mockUser]);
  });

  it("should return an empty array if no users", async () => {
    mockUserService.getAllUsers.mockResolvedValue([]);

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await getAllUsers(req, res, next);

    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("getUserById", () => {
  it("should return a user by id", async () => {
    mockUserService.getUserById.mockResolvedValue(mockUser);

    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    const next = mockNext();

    await getUserById(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("should return 404 if user not found", async () => {
    mockUserService.getUserById.mockResolvedValue(null);

    const req = mockReq({}, { id: "99" });
    const res = mockRes();
    const next = mockNext();

    await getUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("updateUser", () => {
  it("should update a user and return the updated user", async () => {
    const updatedUser = { ...mockUser, firstname: "Maximilian" };
    mockUserService.updateUser.mockResolvedValue(updatedUser);

    const req = mockReq({ firstname: "Maximilian" }, { id: "1" });
    const res = mockRes();
    const next = mockNext();

    await updateUser(req, res, next);

    expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUser.id, req.body);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  it("should forward errors to errorHandler", async () => {
    const error = new Error("Not found");
    mockUserService.updateUser.mockRejectedValue(error);

    const req = mockReq({ firstname: "Maximilian" }, { id: "99" });
    const res = mockRes();
    const next = mockNext();

    await updateUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("deleteUser", () => {
  it("should delete a user and return 204", async () => {
    mockUserService.deleteUser.mockResolvedValue(mockUser);

    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    const next = mockNext();

    await deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should return 404 if user not found", async () => {
    const error = new Error("Not found");
    mockUserService.deleteUser.mockRejectedValue(error);

    const req = mockReq({}, { id: "99" });
    const res = mockRes();
    const next = mockNext();

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("runAction", () => {
  it("should return 200 if user is allowed to execute the action", async () => {
    mockUserService.getUserById.mockResolvedValue(mockUser);

    const req = mockReq({ userId: 1, action: "create-item" });
    const res = mockRes();
    const next = mockNext();

    await runAction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Action "create-item" executed successfully`,
    });
  });

  it("should return 401 if user is not allowed to execute the action", async () => {
    mockUserService.getUserById.mockResolvedValue(mockUser);

    const req = mockReq({ userId: 1, action: "delete-item" });
    const res = mockRes();
    const next = mockNext();

    await runAction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: `User is not allowed to execute "delete-item"`,
    });
  });

  it("should return 404 if user not found", async () => {
    mockUserService.getUserById.mockResolvedValue(null);

    const req = mockReq({}, { id: "99" });
    const res = mockRes();
    const next = mockNext();

    await getUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
