import assert from "node:assert/strict";
import test from "node:test";
import { filterTasks, readId, validateTask, type Task } from "../src/lib/tasks.ts";

const valid = { title: "  学習  ", description: " メモ ", status: "todo" };

test("空白を除去し、保存するフィールドだけを返す", () => {
  assert.deepEqual(validateTask({ ...valid, id: "injected" }), {
    ok: true, data: { title: "学習", description: "メモ", status: "todo" },
  });
});

test("型が不正なJSON・未知の状態を拒否する", () => {
  for (const input of [null, [], "text", {}, { ...valid, title: 1 }, { ...valid, description: null }, { ...valid, status: "admin" }]) {
    assert.equal(validateTask(input).ok, false);
  }
});

test("空のタイトル・制御文字を拒否する", () => {
  for (const title of [" ", "名前\n次の行", "a\0b"]) {
    assert.equal(validateTask({ ...valid, title }).ok, false);
  }
});

test("文字数の境界をUnicodeのコードポイントで数える", () => {
  assert.equal(validateTask({ ...valid, title: "📝".repeat(80), description: "あ".repeat(300) }).ok, true);
  assert.equal(validateTask({ ...valid, title: "📝".repeat(81) }).ok, false);
  assert.equal(validateTask({ ...valid, description: "あ".repeat(301) }).ok, false);
});

test("説明の改行を許可し、NULを拒否する", () => {
  assert.equal(validateTask({ ...valid, description: "一行目\n二行目" }).ok, true);
  assert.equal(validateTask({ ...valid, description: "a\0b" }).ok, false);
});

test("更新・削除のIDは文字列の許可形式だけを受け取る", () => {
  assert.equal(readId({ id: "sample-1" }), "sample-1");
  for (const value of [null, [], {}, { id: 1 }, { id: "" }, { id: "../path" }]) {
    assert.equal(readId(value), null);
  }
});

test("日本語・全角英字を正規化し、検索と状態を同時に絞る", () => {
  const tasks: Task[] = [
    { id: "1", title: "ＡＰＩ設計", description: "入力検証", status: "todo" },
    { id: "2", title: "API実装", description: "動作確認", status: "done" },
  ];
  assert.deepEqual(filterTasks(tasks, " api ", "todo").map((task) => task.id), ["1"]);
  assert.deepEqual(filterTasks(tasks, "入力", "all").map((task) => task.id), ["1"]);
  assert.deepEqual(filterTasks(tasks, "存在しない", "all"), []);
  assert.equal(filterTasks(tasks, "", "all").length, 2);
});
