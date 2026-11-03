import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb } from "@/test/db";
import * as schema from "./schema";

let db: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  db = await createTestDb();
});

describe("schema do banco", () => {
  it("aplica as migrations e liga usuário, organização e repositório", async () => {
    const [user] = await db
      .insert(schema.users)
      .values({ name: "Renato", email: "renato@example.com" })
      .returning();
    const [org] = await db
      .insert(schema.organizations)
      .values({ name: "R2", slug: "r2" })
      .returning();
    await db
      .insert(schema.memberships)
      .values({ organizationId: org.id, userId: user.id, role: "owner" });
    await db.insert(schema.repositories).values({
      organizationId: org.id,
      githubRepoId: 3_000_000_000,
      fullName: "r2/app",
    });

    const repos = await db
      .select()
      .from(schema.repositories)
      .where(eq(schema.repositories.organizationId, org.id));
    expect(repos).toHaveLength(1);
    expect(repos[0]).toMatchObject({ fullName: "r2/app", defaultBranch: "main" });
  });

  it("impede o mesmo repositório duas vezes na organização", async () => {
    const [org] = await db
      .insert(schema.organizations)
      .values({ name: "Outra", slug: "outra" })
      .returning();
    const repo = { organizationId: org.id, githubRepoId: 42, fullName: "outra/app" };
    await db.insert(schema.repositories).values(repo);
    await expect(db.insert(schema.repositories).values(repo)).rejects.toThrow();
  });
});
