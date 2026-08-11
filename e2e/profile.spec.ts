import { test, expect } from "@playwright/test";

test("saving a profile with both fields works", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Name", { exact: true }).fill("Ada");
  await page.getByLabel("Surname").fill("Lovelace");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toHaveText("saved: Ada Lovelace");
});

test("saving a profile with an empty surname still works", async ({ page }) => {
  // This is the test the planted 500 breaks: an empty surname is a valid
  // payload, and the server must not fall over on it.
  await page.goto("/");
  await page.getByLabel("Name", { exact: true }).fill("Ada");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toHaveText("saved: Ada");
});

test("the submit button is not covered by the footer on mobile", async ({
  page,
}) => {
  // The planted layout defect makes this fail at 390x844: the fixed footer
  // overlaps the button once the container's bottom padding is removed.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const button = page.getByRole("button", { name: "Save profile" });
  await button.scrollIntoViewIfNeeded();

  const buttonBox = await button.boundingBox();
  const footerBox = await page.locator("footer").boundingBox();
  expect(buttonBox).not.toBeNull();
  expect(footerBox).not.toBeNull();

  const overlap =
    buttonBox!.y + buttonBox!.height > footerBox!.y &&
    buttonBox!.x < footerBox!.x + footerBox!.width;
  expect(overlap, "submit button overlaps the fixed footer").toBe(false);
});
