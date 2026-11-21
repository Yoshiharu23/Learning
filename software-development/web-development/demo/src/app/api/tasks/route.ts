import { readId, validateTask } from "../../../lib/tasks.ts";
import { createTask, deleteTask, listTasks, updateTask } from "../../../lib/store.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const badRequest = (error: string) => Response.json({ error }, { status: 400 });
const notFound = () => Response.json({ error: "対象のタスクが見つかりません。" }, { status: 404 });

async function readBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function GET() {
  return Response.json({ tasks: listTasks() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const result = validateTask(await readBody(request));
  if (!result.ok) return badRequest(result.error);
  return Response.json({ task: createTask(result.data) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await readBody(request);
  const id = readId(body);
  if (!id) return badRequest("対象のIDを確認してください。");
  const result = validateTask(body);
  if (!result.ok) return badRequest(result.error);
  const task = updateTask(id, result.data);
  return task ? Response.json({ task }) : notFound();
}

export async function DELETE(request: Request) {
  const id = readId(await readBody(request));
  if (!id) return badRequest("対象のIDを確認してください。");
  return deleteTask(id) ? Response.json({ deleted: true }) : notFound();
}
