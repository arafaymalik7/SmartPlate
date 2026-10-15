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
test("comparison preserves unavailable values", async ({ page }, testInfo) => {
  await page.goto("/compare");
  await expect(page.getByRole("heading", { name: /compare meals/i })).toBeVisible();
  await expect(page.getByText("Not available").first()).toBeVisible();
  const checkboxes = page.getByRole("checkbox");
  await checkboxes.nth(1).uncheck();
  await checkboxes.nth(3).check();
  await expect(page.getByRole("columnheader", { name: /oat pancakes/i })).toBeVisible();
  await page.screenshot({
    path: `docs/evidence/${testInfo.project.name}-comparison.png`,
    fullPage: true,
  });
});

test("keyboard users can bypass repeated navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: /skip to content/i });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
});

test("public crawl metadata excludes protected routes", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  await expect(robots.text()).resolves.toContain("Disallow: /admin");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  await expect(sitemap.text()).resolves.toContain("/restaurants");
});

test("rendered internal navigation and images resolve", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href]").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") ?? ""),
  );
  const internalHrefs = [...new Set(hrefs.filter((href) => href.startsWith("/") && !href.includes("#")))];
  expect(internalHrefs.length).toBeGreaterThan(0);

  for (const href of internalHrefs) {
    const response = await request.get(href);
    expect(response.status(), `${href} should not be broken`).toBeLessThan(400);
  }

  const imageSources = await page.locator("img[src]").evaluateAll((images) =>
    images.map((image) => image.getAttribute("src") ?? ""),
  );
  for (const source of imageSources) {
    const response = await request.get(source);
    expect(response.status(), `${source} should not be broken`).toBeLessThan(400);
  }
});

test("admin workspace remains protected without a session", async ({ page }, testInfo) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /protected workspace/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /admin sign in/i })).toBeVisible();
  await page.screenshot({
    path: `docs/evidence/${testInfo.project.name}-admin-protected.png`,
    fullPage: true,
  });
});

test("admin APIs reject unauthenticated reads and mutations", async ({ request }) => {
  for (const path of [
    "/api/admin/restaurants",
    "/api/admin/categories",
    "/api/admin/menu-items",
    "/api/admin/summary",
    "/api/admin/audit",
  ]) {
    expect((await request.get(path)).status(), `${path} should require an admin session`).toBe(401);
  }

  expect((await request.post("/api/admin/restaurants", { data: {} })).status()).toBe(401);
  expect((await request.patch("/api/admin/menu-items/not-a-record", { data: {} })).status()).toBe(
    401,
  );
  expect(
    (
      await request.post("/api/admin/restaurants", {
        data: {},
        headers: { origin: "https://attacker.example" },
      })
    ).status(),
  ).toBe(403);
});

test("restaurant search has a truthful empty state", async ({ page }) => {
  await page.goto("/restaurants");
  await page.getByLabel(/search restaurants/i).fill("no-such-venue");
  await expect(
    page.getByRole("heading", { name: /no (demonstration )?venues match/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: /clear filters/i }).click();
  await expect(page.getByText(/4 (demonstration )?venues shown/i)).toBeVisible();
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
