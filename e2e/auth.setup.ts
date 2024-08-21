import { expect, test as setup } from "@playwright/test";
import dotenv from "dotenv";

const authFile = "e2e/.auth/user.json";

dotenv.config();

setup("authenticate", async ({ page }) => {
  if (
    process.env.ADMIN_USERNAME === undefined ||
    process.env.ADMIN_PASSWORD === undefined ||
    process.env.BLOG_NAME === undefined
  ) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set",
    );
  }
  await page.goto("/api/auth/signin");
  await page.getByLabel("Username").fill(process.env.ADMIN_USERNAME);
  await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in with Credentials" }).click();

  await expect(
    page.getByText(process.env.BLOG_NAME, { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
