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
