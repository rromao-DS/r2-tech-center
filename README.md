# R2 Tech Center

Agente de código com IA para equipes brasileiras: recebe uma tarefa, trabalha no repositório da equipe e abre um pull request para revisão.

## Requisitos

- Node.js 22 ou mais recente
- pnpm 10 (`corepack enable` instala a versão certa)
- Docker, para o Postgres local

## Começando

```bash
pnpm install
cp .env.example .env.local
pnpm db:up       # sobe o Postgres
pnpm db:migrate  # aplica as migrations
pnpm dev
```

O app sobe em http://localhost:3000 e a rota `GET /api/health` responde com o status do serviço.

## Scripts

| Comando          | O que faz                       |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Servidor de desenvolvimento     |
| `pnpm build`     | Build de produção               |
| `pnpm lint`      | ESLint                          |
| `pnpm typecheck` | Checagem de tipos do TypeScript |
| `pnpm test`      | Testes com Vitest               |
| `pnpm format`    | Formata o código com Prettier   |

O CI no GitHub Actions roda lint, tipos, formatação, testes e build em todo pull request.

## Estrutura

- `src/app`: rotas do Next.js (App Router)
- `src/lib`: código compartilhado
- `src/db`: schema do Drizzle e conexão com o Postgres
- `drizzle/`: migrations geradas (não edite à mão)
- `site/`: páginas estáticas públicas (política de privacidade, exclusão de dados)

## Banco de dados

O schema fica em `src/db/schema.ts`. Depois de mudar o schema, rode `pnpm db:generate` e faça commit da migration gerada. Os testes aplicam as migrations num Postgres em memória (PGlite), então não precisam de Docker.

## Login com GitHub

O login usa Auth.js com sessões guardadas no Postgres.

1. Crie um OAuth App em https://github.com/settings/developers com a callback `http://localhost:3000/api/auth/callback/github`.
2. Preencha `AUTH_GITHUB_ID` e `AUTH_GITHUB_SECRET` no `.env.local`.
3. Gere o `AUTH_SECRET` com `npx auth secret`.

Depois de entrar, `/painel` lista os repositórios do usuário. Com o escopo padrão do OAuth App aparecem só os públicos; o acesso aos privados virá pela GitHub App.

## Tarefas do agente

`POST /api/tasks` recebe `{ "repositoryId": "...", "prompt": "..." }`, confere se o usuário é membro da organização dona do repositório e grava a tarefa com status `queued`. `GET /api/tasks?repositoryId=...` lista as últimas 50.

A execução fica atrás da interface `AgentRunner` em `src/agent/runner.ts`. Por enquanto o `queueOnlyRunner` só registra a tarefa; quando o fornecedor de sandbox for escolhido, a implementação real entra ali sem mexer na rota.
