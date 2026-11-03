import { signInWithGitHub } from "@/app/actions";

export function SignInButton() {
  return (
    <form action={signInWithGitHub}>
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Entrar com GitHub
      </button>
    </form>
  );
}
