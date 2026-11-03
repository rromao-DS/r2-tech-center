import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { accounts } from "@/db/schema";
import { listUserRepos } from "@/lib/github";

export default async function Painel() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const [account] = await getDb()
    .select({ accessToken: accounts.access_token })
    .from(accounts)
    .where(and(eq(accounts.userId, session.user.id), eq(accounts.provider, "github")))
    .limit(1);

  const repos = account?.accessToken ? await listUserRepos(account.accessToken) : [];

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel</h1>
          <p className="text-sm opacity-70">Olá, {session.user.name ?? session.user.email}</p>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="text-sm underline opacity-80 hover:opacity-100">
            Sair
          </button>
        </form>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Seus repositórios</h2>
        {repos.length === 0 ? (
          <p className="text-sm opacity-70">Nenhum repositório encontrado.</p>
        ) : (
          <ul className="divide-y divide-current/10 rounded-md border border-current/10">
            {repos.map((repo) => (
              <li key={repo.id} className="flex items-center justify-between px-4 py-3">
                <a href={repo.url} className="font-mono text-sm hover:underline">
                  {repo.fullName}
                </a>
                <span className="text-xs opacity-60">{repo.private ? "privado" : "público"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
