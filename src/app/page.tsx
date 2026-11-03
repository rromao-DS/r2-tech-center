import { SignInButton } from "@/components/sign-in-button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <h1 className="text-4xl font-semibold tracking-tight">R2 Tech Center</h1>
      <p className="text-lg opacity-80">
        Um agente de código com IA que trabalha nos repositórios da sua equipe: recebe uma tarefa,
        abre um pull request e espera a sua revisão.
      </p>
      <div>
        <SignInButton />
      </div>
      <p className="text-sm opacity-60">Beta fechado em preparação.</p>
    </main>
  );
}
