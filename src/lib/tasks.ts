import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { AgentRunner } from "@/agent/runner";
import { memberships, repositories, tasks } from "@/db/schema";
import type { Db } from "@/db/types";

export const createTaskInput = z.object({
  repositoryId: z.string().uuid(),
  prompt: z.string().trim().min(10, "Descreva a tarefa com pelo menos 10 caracteres").max(10_000),
});

export class TaskError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 403 | 404,
  ) {
    super(message);
  }
}

async function findAccessibleRepository(db: Db, userId: string, repositoryId: string) {
  const [row] = await db
    .select({ repository: repositories })
    .from(repositories)
    .innerJoin(
      memberships,
      and(
        eq(memberships.organizationId, repositories.organizationId),
        eq(memberships.userId, userId),
      ),
    )
    .where(eq(repositories.id, repositoryId))
    .limit(1);
  return row?.repository;
}

export async function createTask(db: Db, runner: AgentRunner, userId: string, input: unknown) {
  const parsed = createTaskInput.safeParse(input);
  if (!parsed.success) {
    throw new TaskError(parsed.error.issues[0]?.message ?? "Dados inválidos", 400);
  }

  const repository = await findAccessibleRepository(db, userId, parsed.data.repositoryId);
  if (!repository) {
    throw new TaskError("Repositório não encontrado", 404);
  }

  const [task] = await db
    .insert(tasks)
    .values({
      organizationId: repository.organizationId,
      repositoryId: repository.id,
      createdById: userId,
      prompt: parsed.data.prompt,
    })
    .returning();

  await runner.start(task);
  return task;
}

export async function listTasks(db: Db, userId: string, repositoryId: string) {
  const repository = await findAccessibleRepository(db, userId, repositoryId);
  if (!repository) {
    throw new TaskError("Repositório não encontrado", 404);
  }
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.repositoryId, repositoryId))
    .orderBy(desc(tasks.createdAt))
    .limit(50);
}
