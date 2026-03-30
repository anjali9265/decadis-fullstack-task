import { test, expect } from "./fixtures";

test.describe("Users", () => {
  test("should display the users page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
  });

  test("should generate a sample user", async ({ page }) => {
    await expect(page.getByText("No users yet")).toBeVisible();
    await page.getByText("Click here").click();
    await expect(page.getByText(/Sample/)).toBeVisible();
  });

  test("should open create user modal on clicking Create button", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Create User")).toBeVisible();
  });

  test("should create a user and display in list", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Create User")).toBeVisible();

    await page.getByPlaceholder("Max").fill("John");
    await page.getByPlaceholder("Mustermann").fill("Doe");
    await page.getByPlaceholder("m.must@test.com").fill("john.doe@test.de");
    await page.getByRole("checkbox", { name: "Create Item" }).check();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("john.doe@test.de")).toBeVisible();
  });

  test("should edit a user", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Create User")).toBeVisible();

    await page.getByPlaceholder("Max").fill("Jane");
    await page.getByPlaceholder("Mustermann").fill("Doe");
    await page.getByPlaceholder("m.must@test.com").fill("jane.doe@test.de");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Jane Doe")).toBeVisible();

    await page.getByText("Jane Doe").locator("..").locator('[title="Edit"]').click();
    await expect(page.getByText("Edit User")).toBeVisible();

    await page.locator('input[value="Jane"]').fill("Janet");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Janet Doe")).toBeVisible();
  });

  test("should delete a user", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Create User")).toBeVisible();

    await page.getByPlaceholder("Max").fill("Delete");
    await page.getByPlaceholder("Mustermann").fill("Me");
    await page.getByPlaceholder("m.must@test.com").fill("delete.me@test.de");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Delete Me")).toBeVisible();

    page.on("dialog", (dialog) => dialog.accept());

    const row = page.getByRole("row", { name: "Delete Me" });
    await row.getByTitle("Delete").click();

    await expect(page.getByText("Delete Me")).not.toBeVisible();
  });

  test("should run an allowed action successfully", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Create User")).toBeVisible();

    await page.getByPlaceholder("Max").fill("Action");
    await page.getByPlaceholder("Mustermann").fill("User");
    await page.getByPlaceholder("m.must@test.com").fill("action.user@test.de");
    await page.getByRole("checkbox", { name: "Create Item" }).check();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Action User")).toBeVisible();

    const row = page.getByRole("row", { name: "Action User" });
    await row.getByTitle("Run Action").click();

    // await expect(page.getByText("Run Action")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Run Action" })).toBeVisible();
    await page.getByRole("combobox").selectOption("create-item");
    const modal = page.locator(".fixed.inset-0");
    await modal.getByRole("button", { name: "Run" }).click();

    await expect(page.getByText(/executed successfully/i)).toBeVisible();
  });

  test("should return 401 for unauthorized action", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Create User")).toBeVisible();

    await page.getByPlaceholder("Max").fill("No");
    await page.getByPlaceholder("Mustermann").fill("Action");
    await page.getByPlaceholder("m.must@test.com").fill("no.action@test.de");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("No Action")).toBeVisible();

    const row = page.getByRole("row", { name: "No Action" });
    await row.getByTitle("Run Action").click();

    // await expect(page.getByText("Run Action")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Run Action" })).toBeVisible();

    await page.getByRole("combobox").selectOption("create-item");
    const modal = page.locator(".fixed.inset-0");
    await modal.getByRole("button", { name: "Run" }).click();

    await expect(page.getByText(/not allowed/)).toBeVisible();
  });
});
