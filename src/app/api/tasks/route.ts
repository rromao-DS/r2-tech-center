import { queueOnlyRunner } from "@/agent/runner";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { createTask, listTasks, TaskError } from "@/lib/tasks";

function errorResponse(err: unknown) {
  if (err instanceof TaskError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  throw err;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  try {
    const task = await createTask(getDb(), queueOnlyRunner, session.user.id, body);
    return Response.json(task, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const repositoryId = new URL(request.url).searchParams.get("repositoryId");
  if (!repositoryId) {
    return Response.json({ error: "Informe repositoryId" }, { status: 400 });
  }
  try {
    return Response.json(await listTasks(getDb(), session.user.id, repositoryId));
  } catch (err) {
    return errorResponse(err);
  }
}
