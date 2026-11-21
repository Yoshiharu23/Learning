"use client";

import { useEffect, useState, type FormEvent } from "react";
import { filterTasks, type Status, type Task, type TaskInput } from "../lib/tasks.ts";

const empty: TaskInput = { title: "", description: "", status: "todo" };

async function request<T>(method: string, data?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch("/api/tasks", {
    method, signal, cache: "no-store",
    headers: data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "通信に失敗しました。");
  return result;
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState<TaskInput>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    request<{ tasks: Task[] }>("GET", undefined, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setTasks(data.tasks); })
      .catch(() => { if (!controller.signal.aborted) setError("一覧を読み込めませんでした。再読み込みしてください。"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reload]);

  async function mutate(action: () => Promise<void>, message: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "通信に失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setDraft(empty);
    setEditing(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void mutate(async () => {
      const { task } = await request<{ task: Task }>(editing ? "PATCH" : "POST", { ...draft, ...(editing ? { id: editing } : {}) });
      setTasks((previous) => editing ? previous.map((item) => item.id === task.id ? task : item) : [...previous, task]);
      resetForm();
    }, editing ? "タスクを更新しました。" : "タスクを追加しました。");
  }

  function toggle(task: Task) {
    void mutate(async () => {
      const { task: updated } = await request<{ task: Task }>("PATCH", { ...task, status: task.status === "done" ? "todo" : "done" });
      setTasks((previous) => previous.map((item) => item.id === task.id ? updated : item));
      if (editing === task.id) setDraft(updated);
    }, "状態を変更しました。");
  }

  function remove(id: string) {
    void mutate(async () => {
      await request("DELETE", { id });
      setTasks((previous) => previous.filter((item) => item.id !== id));
      if (editing === id) resetForm();
    }, "タスクを削除しました。");
  }

  const visible = filterTasks(tasks, query, status);
  const done = tasks.filter((task) => task.status === "done").length;
  const disabled = busy || loading;

  return (
    <>
      <section className="overview" aria-label="タスクの集計">
        <div><strong>{tasks.length}</strong><span>すべてのタスク</span></div>
        <div><strong>{tasks.length - done}</strong><span>進行中</span></div>
        <div><strong>{done}</strong><span>完了</span></div>
      </section>
      {error && <div role="alert" className="message error">{error} <button disabled={disabled} onClick={() => setReload((count) => count + 1)}>一覧を再読み込み</button></div>}
      <p role="status" className="notice">{notice || (busy ? "保存しています…" : "")}</p>
      <div className="workspace">
        <section className="editor" aria-labelledby="form-heading">
          <div className="section-label">01 / WRITE</div>
          <h2 id="form-heading">{editing ? "タスクを編集" : "新しいタスク"}</h2>
          <form onSubmit={submit}>
            <fieldset disabled={disabled}>
              <label htmlFor="title">タイトル <span>1〜80文字</span></label>
              <input id="title" required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="次に取り組むこと" />
              <label htmlFor="description">説明 <span>任意・300文字まで</span></label>
              <textarea id="description" rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="小さなステップを書いてみる" />
              <label htmlFor="draft-status">状態</label>
              <select id="draft-status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Status })}>
                <option value="todo">進行中</option><option value="done">完了</option>
              </select>
              <button className="primary" type="submit">{editing ? "変更を保存" : "タスクを追加"}<span aria-hidden="true">↗</span></button>
              {editing && <button type="button" className="cancel" onClick={resetForm}>編集をキャンセル</button>}
            </fieldset>
          </form>
        </section>
        <section className="task-list" aria-labelledby="list-heading" aria-busy={loading}>
          <div className="section-label">02 / ORGANIZE</div>
          <div className="list-heading"><h2 id="list-heading">タスク一覧</h2><span>{visible.length} 件</span></div>
          <div className="filters">
            <div><label htmlFor="query">キーワード検索</label><input id="query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="タイトル・説明を検索" /></div>
            <div><label htmlFor="filter-status">状態で絞り込み</label><select id="filter-status" value={status} onChange={(event) => setStatus(event.target.value as Status | "all")}><option value="all">すべて</option><option value="todo">進行中</option><option value="done">完了</option></select></div>
          </div>
          {loading ? <p className="empty">読み込んでいます…</p> : visible.length === 0 ? <p className="empty">該当するタスクはありません。</p> : (
            <ul>
              {visible.map((task) => (
                <li key={task.id}>
                  <article className={task.status === "done" ? "task completed" : "task"}>
                    <div className="task-top"><span className={`badge ${task.status}`}>{task.status === "done" ? "完了" : "進行中"}</span></div>
                    <h3>{task.title}</h3>
                    {task.description && <p className="description">{task.description}</p>}
                    <div className="actions">
                      <button disabled={disabled} onClick={() => toggle(task)}>{task.status === "done" ? "進行中に戻す" : "完了にする"}</button>
                      <button disabled={disabled} onClick={() => { setEditing(task.id); setDraft({ title: task.title, description: task.description, status: task.status }); setNotice(""); setError(""); }}>編集</button>
                      <button disabled={disabled} className="delete" onClick={() => remove(task.id)}>削除</button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
