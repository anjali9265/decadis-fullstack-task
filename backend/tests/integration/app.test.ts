import { describe, it, expect, beforeEach, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/lib/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// clean up database before each test
beforeEach(async () => {
  await prisma.user.deleteMany();
});

const testUser = {
  firstname: "Max",
  lastname: "Mustermann",
  email: "max@test.de",
  actions: ["create-item", "view-item"],
};

describe("GET /", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("POST /user", () => {
  it("should create a user and return 201", async () => {
    const res = await request(app).post("/user").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.firstname).toBe("Max");
    expect(res.body.email).toBe("max@test.de");
    expect(res.body.actions).toEqual(["create-item", "view-item"]);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/user").send({ firstname: "Max" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("firstname, lastname and email are required");
  });

  it("should return 409 if email already exists", async () => {
    await request(app).post("/user").send(testUser);
    const res = await request(app).post("/user").send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("A user with this email already exists");
  });
});

describe("GET /user", () => {
  it("should return all users", async () => {
    await request(app).post("/user").send(testUser);

    const res = await request(app).get("/user");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].email).toBe("max@test.de");
  });

  it("should return empty array if no users", async () => {
    const res = await request(app).get("/user");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /user/:id", () => {
  it("should return a specific user", async () => {
    const created = await request(app).post("/user").send(testUser);
    const res = await request(app).get(`/user/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("max@test.de");
  });

  it("should return 404 if user not found", async () => {
    const res = await request(app).get("/user/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});

describe("PUT /user/:id", () => {
  it("should update a user", async () => {
    const created = await request(app).post("/user").send(testUser);
    const res = await request(app)
      .put(`/user/${created.body.id}`)
      .send({ firstname: "Maximilian" });

    expect(res.status).toBe(200);
    expect(res.body.firstname).toBe("Maximilian");
    expect(res.body.email).toBe("max@test.de");
  });

  it("should return 404 if user not found", async () => {
    const res = await request(app).put("/user/999").send({ firstname: "Max" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  it("should return 400 if field is empty string", async () => {
    const created = await request(app).post("/user").send(testUser);
    const res = await request(app).put(`/user/${created.body.id}`).send({ firstname: "" });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /user/:id", () => {
  it("should delete a user and return 204", async () => {
    const created = await request(app).post("/user").send(testUser);
    const res = await request(app).delete(`/user/${created.body.id}`);

    expect(res.status).toBe(204);
  });

  it("should return 404 if user not found", async () => {
    const res = await request(app).delete("/user/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});

describe("POST /action", () => {
  it("should return 200 if user is allowed to execute the action", async () => {
    const created = await request(app).post("/user").send(testUser);
    const res = await request(app)
      .post("/action")
      .send({ userId: created.body.id, action: "create-item" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Action "create-item" executed successfully`);
  });

  it("should return 401 if user is not allowed to execute the action", async () => {
    const created = await request(app).post("/user").send(testUser);
    const res = await request(app)
      .post("/action")
      .send({ userId: created.body.id, action: "delete-item" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe(`User is not allowed to execute "delete-item"`);
  });

  it("should return 404 if user not found", async () => {
    const res = await request(app).post("/action").send({ userId: 999, action: "create-item" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});
