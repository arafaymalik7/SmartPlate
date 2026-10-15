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

test("keyboard users can bypass repeated navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: /skip to content/i });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
});

test("restaurant search has a truthful empty state", async ({ page }) => {
  await page.goto("/restaurants");
  await page.getByLabel(/search restaurants/i).fill("no-such-venue");
  await expect(page.getByRole("heading", { name: /no demonstration venues match/i })).toBeVisible();
  await page.getByRole("button", { name: /clear filters/i }).click();
  await expect(page.getByText(/4 demonstration venues shown/i)).toBeVisible();
});

test("menu filters retain unknown-disclosure safeguards", async ({ page }, testInfo) => {
  await page.goto("/restaurants/green-ladle");
  await expect(page.getByText(/12 illustrative menu items shown/i)).toBeVisible();
  await page.getByLabel(/verified diet/i).selectOption("VEGAN");
  await expect(page.getByText(/Garden Grain Bowl/i)).toBeVisible();
  await page.getByLabel(/search this menu/i).fill("no-such-dish");
  await expect(page.getByRole("heading", { name: /no dishes match/i })).toBeVisible();
  await page.getByRole("button", { name: /clear filters/i }).click();
  await expect(page.getByText(/12 illustrative menu items shown/i)).toBeVisible();
  await page.screenshot({
    path: `docs/evidence/${testInfo.project.name}-menu-filters.png`,
    fullPage: true,
  });
});

test("strict allergy-related exclusions are never presented as safe", async ({
  page,
}, testInfo) => {
  await page.goto("/recommend");
  await page.getByLabel(/allergy-related exclusions/i).fill("peanuts");
  await expect(page.getByRole("heading", { name: /unable to verify/i })).toBeVisible();
  await expect(page.getByText(/not marked safe/i)).toBeVisible();
  await page.screenshot({
    path: `docs/evidence/${testInfo.project.name}-recommendations.png`,
    fullPage: true,
  });
});
