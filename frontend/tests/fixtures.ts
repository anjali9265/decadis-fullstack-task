import { test as base } from "@playwright/test";
import { mockApi } from "./mocks/mockApi";

type Fixtures = {
  setup: void;
};

export const test = base.extend<Fixtures>({
  setup: [
    async ({ page }, use) => {
      await mockApi(page);
      await page.goto("/users");
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
