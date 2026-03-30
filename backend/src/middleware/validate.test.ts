import { validate, validateParams } from "./validate.js";
import { z } from "zod";
import { describe, expect, it, jest } from "@jest/globals";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validate middleware", () => {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z.number().int().positive("Age must be positive"),
  });

  it("calls next() when body is valid", () => {
    const req: any = { body: { name: "John", age: 30 } };
    const res = mockResponse();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.body).toEqual({ name: "John", age: 30 }); // sanitized
  });

  it("returns 400 when body is invalid", () => {
    const req: any = { body: { name: "", age: -5 } };
    const res = mockResponse();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Name is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns the first Zod error message", () => {
    const req: any = { body: { name: "John", age: -1 } };
    const res = mockResponse();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Age must be positive",
    });
  });
});

describe("validateParams middleware", () => {
  const schema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  });

  it("calls next() when params are valid", () => {
    const req: any = { params: { id: "123" } };
    const res = mockResponse();
    const next = jest.fn();

    validateParams(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.params).toEqual({ id: "123" }); // sanitized
  });

  it("returns 400 when params are invalid", () => {
    const req: any = { params: { id: "abc" } };
    const res = mockResponse();
    const next = jest.fn();

    validateParams(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "ID must be a number",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
