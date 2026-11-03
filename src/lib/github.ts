export type GitHubRepo = {
  id: number;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  url: string;
  updatedAt: string;
};

type ApiRepo = {
  id: number;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
  updated_at: string;
};

export async function listUserRepos(
  accessToken: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubRepo[]> {
  const res = await fetchImpl("https://api.github.com/user/repos?sort=updated&per_page=50", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub respondeu ${res.status} ao listar repositórios`);
  }
  const data = (await res.json()) as ApiRepo[];
  return data.map((r) => ({
    id: r.id,
    fullName: r.full_name,
    private: r.private,
    defaultBranch: r.default_branch,
    url: r.html_url,
    updatedAt: r.updated_at,
  }));
}
