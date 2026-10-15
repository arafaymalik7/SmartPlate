import { expect, test } from "@playwright/test";

test("public pages expose transparent demo guidance", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /choose a meal/i })).toBeVisible();
  await page.getByRole("link", { name: /explore restaurants/i }).click();
  await expect(page.getByText(/fictional demonstration/i)).toBeVisible();
  await page.screenshot({
    path: `docs/evidence/${testInfo.project.name}-restaurants.png`,
    fullPage: true,
  });
});
test("comparison preserves unavailable values", async ({ page }) => {
  await page.goto("/compare");
  await expect(page.getByRole("heading", { name: /compare meals/i })).toBeVisible();
  await expect(page.getByText("Not available").first()).toBeVisible();
});
