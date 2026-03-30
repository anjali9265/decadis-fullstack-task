import type { Page } from "@playwright/test";
import type { Action, User } from "../../src/types";

export async function mockApi(page: Page) {
  let users: User[] = [];
  let nextId = 1;

  users = [];
  nextId = 1;

  // GET and POST
  await page.route("**/user", async (route) => {
    const req = route.request();

    if (req.method() === "GET") {
      return route.fulfill({ status: 200, json: users });
    }

    if (req.method() === "POST") {
      const body = req.postDataJSON();
      const newUser = { id: nextId++, ...body };
      users.push(newUser);
      return route.fulfill({ status: 201, json: newUser });
    }

    route.continue();
  });

  // GET single user, PUT and DELETE
  await page.route("**/user/*", async (route) => {
    const req = route.request();
    const id = Number(req.url().split("/").pop());

    if (req.method() === "GET") {
      const user = users.find((u) => u.id === id);
      return route.fulfill({
        status: user ? 200 : 404,
        json: user ?? { error: "User not found" },
      });
    }

    if (req.method() === "PUT") {
      const body = req.postDataJSON();
      users = users.map((u) => (u.id === id ? { ...u, ...body } : u));
      const updated = users.find((u) => u.id === id)!;
      return route.fulfill({ status: 200, json: updated });
    }

    if (req.method() === "DELETE") {
      users = users.filter((u) => u.id !== id);
      return route.fulfill({ status: 204, body: "" });
    }

    route.continue();
  });

  // POST
  await page.route("**/action", async (route) => {
    const { userId, action } = route.request().postDataJSON();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return route.fulfill({ status: 404, json: { error: "User not found" } });
    }

    if (!user.actions.includes(action)) {
      return route.fulfill({
        status: 401,
        json: { error: `User is not allowed to execute "${action}"` },
      });
    }

    return route.fulfill({
      status: 200,
      json: { message: `Action "${action}" executed successfully` },
    });
  });

  // POST /user/sample
  await page.route("**/user/sample", async (route) => {
    const sampleUser = {
      id: nextId++,
      firstname: "Sample",
      lastname: "User",
      email: `sample${Math.floor(Math.random() * 9999)}@example.com`,
      actions: ["create-item", "view-item", "delete-item"] as Action[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAT: null,
    };

    users.push(sampleUser);

    return route.fulfill({
      status: 201,
      json: sampleUser,
    });
  });
}
