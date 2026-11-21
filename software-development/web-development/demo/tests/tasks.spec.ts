import { expect, test } from "@playwright/test";

test("追加・編集・検索・完了・削除を画面から行う", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "タスクを追加", exact: true })).toBeEnabled();
  const title = `テスト用タスク-${test.info().project.name}`;
  await page.getByLabel("タイトル", { exact: false }).fill(title);
  await page.getByLabel("説明", { exact: false }).fill("架空のタスクです。");
  await page.getByRole("button", { name: "タスクを追加", exact: true }).click();
  let card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "編集", exact: true }).click();
  await page.getByLabel("タイトル", { exact: false }).fill(`${title}-更新`);
  await page.getByRole("button", { name: "変更を保存", exact: true }).click();
  card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: `${title}-更新`, exact: true }) });
  await expect(card).toBeVisible();
  await page.getByLabel("キーワード検索").fill(`${title}-更新`);
  await expect(page.getByRole("article")).toHaveCount(1);
  await card.getByRole("button", { name: "完了にする", exact: true }).click();
  await expect(card.getByRole("button", { name: "進行中に戻す" })).toBeVisible();
  await page.getByLabel("状態で絞り込み").selectOption("todo");
  await expect(page.getByText("該当するタスクはありません。")).toBeVisible();
  await page.getByLabel("状態で絞り込み").selectOption("done");
  await expect(card).toBeVisible();
  await page.reload();
  await page.getByLabel("キーワード検索").fill(`${title}-更新`);
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "削除", exact: true }).click();
  await expect(card).toHaveCount(0);
  await expect(page.getByText("タスクを削除しました。", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("APIは不正入力を保存せず、存在しないIDに404を返す", async ({ request }) => {
  const before = (await (await request.get("/api/tasks")).json()).tasks.length;
  const invalid = await request.post("/api/tasks", { data: { title: " ", description: "", status: "todo" } });
  expect(invalid.status()).toBe(400);
  const malformed = await request.post("/api/tasks", { data: "{", headers: { "Content-Type": "application/json" } });
  expect(malformed.status()).toBe(400);
  const missing = await request.patch("/api/tasks", { data: { id: "missing", title: "テスト", description: "", status: "todo" } });
  expect(missing.status()).toBe(404);
  const invalidId = await request.delete("/api/tasks", { data: { id: 1 } });
  expect(invalidId.status()).toBe(400);
  const missingDelete = await request.delete("/api/tasks", { data: { id: "missing" } });
  expect(missingDelete.status()).toBe(404);
  const after = (await (await request.get("/api/tasks")).json()).tasks.length;
  expect(after).toBe(before);
});

test("保存失敗時は入力を保持し、再送信できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "タスクを追加", exact: true })).toBeEnabled();
  await page.getByLabel("タイトル", { exact: false }).fill("通信失敗時の入力");
  await page.route("**/api/tasks", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "一時的なエラーです。" }) });
    } else await route.continue();
  });
  await page.getByRole("button", { name: "タスクを追加", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "一時的なエラーです。" })).toBeVisible();
  await expect(page.getByLabel("タイトル", { exact: false })).toHaveValue("通信失敗時の入力");
  await expect(page.getByRole("button", { name: "タスクを追加", exact: true })).toBeEnabled();
  await page.unroute("**/api/tasks");
  await page.getByRole("button", { name: "タスクを追加", exact: true }).click();
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "通信失敗時の入力", exact: true }) });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "削除", exact: true }).click();
  await expect(card).toHaveCount(0);
});
