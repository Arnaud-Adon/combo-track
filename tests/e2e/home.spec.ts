import { expect, test } from "@playwright/test";

test.describe("Homepage E2E Test", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "ComboTrack" }),
    ).toBeInViewport();
  });

  test("should navigate to the sign in page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page.getByText("Connexion", { exact: true })).toBeVisible();
  });

  test("should navigate to the sign up page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(
      page.getByText("Rejoignez ComboTrack pour suivre vos combos"),
    ).toBeVisible();
  });
});
