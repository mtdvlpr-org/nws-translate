import { expect, test } from "@nuxt/test-utils/playwright";

test("example e2e test", async ({ goto, page }) => {
  await goto("/", { waitUntil: "hydration" });
  await expect(page).toHaveTitle(/Nuxt/);
});
