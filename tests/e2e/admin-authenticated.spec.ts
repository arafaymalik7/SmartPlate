import { expect, test, type Page, type Response } from "@playwright/test";

const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
// The public browser suite intentionally clears database variables to exercise
// illustrative fallback data. Credentials alone must not opt this suite into
// database-backed admin mutations.
const hasDisposableAdmin = Boolean(
  process.env.CI === "true" && adminEmail && adminPassword && process.env.DATABASE_URL,
);

function formWithHeading(page: Page, heading: string) {
  return page.locator("form").filter({ has: page.getByRole("heading", { name: heading }) });
}

async function submitCredentials(page: Page, password: string): Promise<Response> {
  await page.goto("/admin/sign-in");
  await page.getByLabel("Email").fill(adminEmail!);
  await page.getByLabel("Password").fill(password);
  const response = page.waitForResponse(
    (candidate) =>
      candidate.request().method() === "POST" &&
      candidate.url().includes("/api/auth/callback/credentials"),
  );
  await page.getByRole("button", { name: "Sign in" }).click();
  return response;
}

async function signIn(page: Page) {
  await submitCredentials(page, adminPassword!);
  await expect(page.getByRole("heading", { name: "Admin workspace" })).toBeVisible();
}

test.describe("authenticated administrator workflow", () => {
  test.skip(!hasDisposableAdmin, "requires disposable CI credentials and PostgreSQL");

  test("invalid credentials do not grant access", async ({ page }) => {
    await submitCredentials(page, "not-the-disposable-password");
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Protected workspace" })).toBeVisible();
  });

  test("valid credentials receive a successful Auth.js callback", async ({ page }) => {
    const response = await submitCredentials(page, adminPassword!);
    const body = await response.text();
    const error = body.match(/[?&]error=([^&"\\s]+)/)?.[1] ?? "none";
    console.log(`::warning title=Auth callback diagnostic::status=${response.status()}, error=${error}`);
    expect(response.status()).toBe(200);
  });

  test("valid credentials open the admin workspace", async ({ page }) => {
    await signIn(page);
  });

  test("admin UI persists a publish, update, archive, audit, and sign-out lifecycle", async ({
    page,
  }, testInfo) => {
    const suffix = testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const restaurantName = `CI Admin Venue ${suffix}`;
    const restaurantSlug = `ci-admin-venue-${suffix}`;
    const categoryName = `CI Specials ${suffix}`;
    const categorySlug = `ci-specials-${suffix}`;
    const itemName = `CI Admin Bowl ${suffix}`;
    const itemSlug = `ci-admin-bowl-${suffix}`;

    await signIn(page);

    const restaurantForm = formWithHeading(page, "Add a restaurant");
    await restaurantForm.getByLabel("Name").fill(restaurantName);
    await restaurantForm.getByLabel("Slug").fill(restaurantSlug);
    await restaurantForm.getByLabel("Cuisine").fill("Demonstration cuisine");
    await restaurantForm.getByLabel("Location").fill("CI-only test location");
    await restaurantForm
      .getByLabel("Description")
      .fill("A disposable CI record used to verify protected administration.");
    await restaurantForm.getByLabel("Status").selectOption("PUBLISHED");
    await restaurantForm.getByRole("button", { name: "Save restaurant" }).click();
    await expect(page.getByRole("status")).toHaveText(/restaurant saved/i);

    const categoryForm = formWithHeading(page, "Add a category");
    await categoryForm.getByLabel("Restaurant").selectOption({ label: restaurantName });
    await categoryForm.getByLabel("Name").fill(categoryName);
    await categoryForm.getByLabel("Slug").fill(categorySlug);
    await categoryForm.getByLabel("Status").selectOption("PUBLISHED");
    await categoryForm.getByRole("button", { name: "Save category" }).click();
    await expect(page.getByRole("status")).toHaveText(/category saved/i);

    const itemForm = formWithHeading(page, "Add an illustrative menu item");
    await itemForm.getByLabel("Restaurant").selectOption({ label: restaurantName });
    await itemForm.getByLabel("Category (optional)").selectOption({ label: categoryName });
    await itemForm.getByLabel("Name").fill(itemName);
    await itemForm.getByLabel("Slug").fill(itemSlug);
    await itemForm.getByLabel("Description").fill("A publishable CI-only illustrative menu item.");
    await itemForm.getByLabel("Price (MYR)").fill("12.50");
    await itemForm.getByLabel("Serving size").fill("1 bowl (250 g)");
    await itemForm.getByLabel("Ingredient disclosures (optional)").fill("oats | PRESENT");
    await itemForm.getByLabel("Allergen disclosures (optional)").fill("peanuts | ABSENT_VERIFIED");
    await itemForm.getByLabel("Calories (optional)").fill("420");
    await itemForm.getByLabel("Protein g (optional)").fill("18");
    await itemForm.getByLabel("Sodium mg (optional)").fill("350");
    await itemForm.getByLabel("Status").selectOption("PUBLISHED");
    await itemForm.getByRole("button", { name: "Save menu item" }).click();
    await expect(page.getByRole("status")).toHaveText(/menu item saved/i);

    await page.goto(`/restaurants/${restaurantSlug}`);
    await expect(page.getByRole("heading", { name: restaurantName })).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();

    await page.goto("/admin");
    const itemRecord = page.locator(".admin-list > li").filter({ hasText: itemName });
    await itemRecord.getByRole("button", { name: "Edit" }).click();
    const editingItemForm = formWithHeading(page, "Edit menu item");
    await editingItemForm
      .getByLabel("Description")
      .fill("A revised CI-only illustrative menu item.");
    await editingItemForm.getByRole("button", { name: "Update menu item" }).click();
    await expect(page.getByRole("status")).toHaveText(/menu item updated/i);
    await expect(page.getByText("MENU_ITEM_UPDATED").first()).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await itemRecord.getByRole("button", { name: "Archive" }).click();
    await expect(page.getByRole("status")).toHaveText(/record archived/i);

    await page.goto(`/restaurants/${restaurantSlug}`);
    await expect(page.getByText(itemName)).toHaveCount(0);

    await page.goto("/admin");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("heading", { name: "Protected workspace" })).toBeVisible();
  });
});
