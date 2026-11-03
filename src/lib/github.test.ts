import { describe, expect, it, vi } from "vitest";
import { listUserRepos } from "./github";

describe("listUserRepos", () => {
  it("chama a API do GitHub com o token e converte a resposta", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      Response.json([
        {
          id: 1,
          full_name: "r2/app",
          private: true,
          default_branch: "main",
          html_url: "https://github.com/r2/app",
          updated_at: "2026-11-01T00:00:00Z",
        },
      ]),
    );

    const repos = await listUserRepos("tok", fetchImpl);

    expect(fetchImpl).toHaveBeenCalledWith(
      expect.stringContaining("https://api.github.com/user/repos"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer tok" }),
      }),
    );
    expect(repos).toEqual([
      {
        id: 1,
        fullName: "r2/app",
        private: true,
        defaultBranch: "main",
        url: "https://github.com/r2/app",
        updatedAt: "2026-11-01T00:00:00Z",
      },
    ]);
  });

  it("lança erro quando o GitHub recusa", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("", { status: 401 }));
    await expect(listUserRepos("tok", fetchImpl)).rejects.toThrow("401");
  });
});
