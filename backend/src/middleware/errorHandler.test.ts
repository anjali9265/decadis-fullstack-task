import { errorHandler } from "./errorHandler.js";
import { describe, expect, it, jest } from "@jest/globals";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler middleware", () => {
  it("should return 409 for Prisma P2002 unique constraint error", () => {
    const err = { code: "P2002" };
    const req: any = {};
    const res = mockResponse();

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "A user with this email already exists",
    });
  });

  it("should return 404 for Prisma P2025 record not found error", () => {
    const err = { code: "P2025" };
    const req: any = {};
    const res = mockResponse();

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "User not found",
    });
  });

  it("should return 400 for Zod validation error", () => {
    const err = {
      name: "ZodError",
      errors: [{ message: "Invalid email" }],
    };
    const req: any = {};
    const res = mockResponse();

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email",
    });
  });

  it("should return 400 with fallback message when ZodError has no messages", () => {
    const err = {
      name: "ZodError",
      errors: [],
    };
    const req: any = {};
    const res = mockResponse();

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input",
    });
  });

  it("should return 500 for unknown errors", () => {
    const err = { message: "Something unexpected" };
    const req: any = {};
    const res = mockResponse();

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An unexpected error occurred",
    });
  });
});
