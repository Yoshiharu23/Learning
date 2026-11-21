export const statuses = ["todo", "done"] as const;
export type Status = (typeof statuses)[number];
export type TaskInput = { title: string; description: string; status: Status };
export type Task = TaskInput & { id: string };
export type ValidationResult =
  | { ok: true; data: TaskInput }
  | { ok: false; error: string };

export function validateTask(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "入力の形式を確認してください。" };
  }
  const value = input as Record<string, unknown>;
  if (typeof value.title !== "string" || typeof value.description !== "string") {
    return { ok: false, error: "タイトルと説明を文字列で入力してください。" };
  }
  const title = value.title.trim();
  const description = value.description.trim();
  if (!title || [...title].length > 80 || /[\u0000-\u001f\u007f]/.test(title)) {
    return { ok: false, error: "タイトルは改行を含まない1〜80文字で入力してください。" };
  }
  if ([...description].length > 300 || description.includes("\0")) {
    return { ok: false, error: "説明は300文字以内で入力してください。" };
  }
  if (value.status !== "todo" && value.status !== "done") {
    return { ok: false, error: "状態を選び直してください。" };
  }
  return { ok: true, data: { title, description, status: value.status } };
}

export function readId(input: unknown): string | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const id = (input as Record<string, unknown>).id;
  return typeof id === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(id) ? id : null;
}

export function filterTasks(tasks: Task[], query: string, status: Status | "all"): Task[] {
  const keyword = query.trim().normalize("NFKC").toLocaleLowerCase("ja");
  return tasks.filter((task) =>
    (status === "all" || task.status === status) &&
    `${task.title} ${task.description}`.normalize("NFKC").toLocaleLowerCase("ja").includes(keyword),
  );
}
