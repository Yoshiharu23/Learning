import { randomUUID } from "node:crypto";
import type { Task, TaskInput } from "./tasks.ts";

// 学習用。プロセスごとに独立し、再起動すると初期データに戻る。
const tasks = new Map<string, Task>([
  ["sample-1", { id: "sample-1", title: "画面の構成を考える", description: "一覧と入力フォームの役割を整理する。", status: "done" }],
  ["sample-2", { id: "sample-2", title: "APIの入力を検証する", description: "空欄と文字数の境界を確かめる。", status: "todo" }],
  ["sample-3", { id: "sample-3", title: "ブラウザで動作を確かめる", description: "追加から削除まで一連の操作を試す。", status: "todo" }],
]);

export function listTasks(): Task[] {
  return [...tasks.values()];
}

export function createTask(input: TaskInput): Task {
  const task = { ...input, id: randomUUID() };
  tasks.set(task.id, task);
  return task;
}

export function updateTask(id: string, input: TaskInput): Task | null {
  if (!tasks.has(id)) return null;
  const task = { ...input, id };
  tasks.set(id, task);
  return task;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}
