import { beforeAll, describe, expect, it, vi } from "vitest";
import type { AgentRunner } from "@/agent/runner";
import * as schema from "@/db/schema";
import { createTestDb } from "@/test/db";
import { createTask, listTasks } from "./tasks";

let db: Awaited<ReturnType<typeof createTestDb>>;
let memberId: string;
let outsiderId: string;
let repositoryId: string;

beforeAll(async () => {
  db = await createTestDb();
  const [member, outsider] = await db
    .insert(schema.users)
    .values([{ name: "Membro" }, { name: "De fora" }])
    .returning();
  memberId = member.id;
  outsiderId = outsider.id;
  const [org] = await db
    .insert(schema.organizations)
    .values({ name: "R2", slug: "r2" })
    .returning();
  await db.insert(schema.memberships).values({ organizationId: org.id, userId: memberId });
  const [repo] = await db
    .insert(schema.repositories)
    .values({ organizationId: org.id, githubRepoId: 7, fullName: "r2/app" })
    .returning();
  repositoryId = repo.id;
});

function fakeRunner(): AgentRunner {
  return { start: vi.fn().mockResolvedValue(undefined) };
}

describe("createTask", () => {
  it("cria a tarefa na fila e entrega ao runner", async () => {
    const runner = fakeRunner();
    const task = await createTask(db, runner, memberId, {
      repositoryId,
      prompt: "Adicionar testes para o checkout",
    });

    expect(task).toMatchObject({ status: "queued", repositoryId, createdById: memberId });
    expect(runner.start).toHaveBeenCalledWith(task);
    expect(await listTasks(db, memberId, repositoryId)).toHaveLength(1);
  });

  it("recusa prompt curto demais", async () => {
    await expect(
      createTask(db, fakeRunner(), memberId, { repositoryId, prompt: "oi" }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("não deixa quem não é da organização criar ou listar tarefas", async () => {
    const runner = fakeRunner();
    await expect(
      createTask(db, runner, outsiderId, {
        repositoryId,
        prompt: "Refatorar o módulo de pagamentos",
      }),
    ).rejects.toMatchObject({ status: 404 });
    await expect(listTasks(db, outsiderId, repositoryId)).rejects.toMatchObject({ status: 404 });
    expect(runner.start).not.toHaveBeenCalled();
  });
});
