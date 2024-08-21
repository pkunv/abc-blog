import { expect, test } from "@playwright/test";

test("create public post", async ({ page, browserName }) => {
  test.slow(); // Easy way to triple the default timeout
  const title = "Post " + browserName;
  const description = "First post description";
  const category = "2024-08";
  const keywords = "first,post,test";

  await page.goto("/dashboard");

  await expect(page.getByLabel("Title")).toBeVisible();

  await page.getByLabel("Title").fill(title);

  await expect(page.getByLabel("Title")).toHaveValue(title);

  await page.getByRole("textbox", { name: "content" }).fill(description);

  await page.getByLabel("Keywords").fill(keywords);

  await page.getByLabel("Category").fill(category);

  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Post created!")).toBeVisible();

  await page.goto("/");

  await expect(page.getByRole("link", { name: title }).first()).toBeVisible();

  await page.getByRole("link", { name: title }).first().click();

  await expect(page.getByText(description).first()).toBeVisible();
});
