import type { tasks } from "@/db/schema";

export type Task = typeof tasks.$inferSelect;

// Ponto de encaixe do agente. A implementação real vai abrir uma sandbox, clonar o
// repositório, rodar o Claude Agent SDK com o prompt da tarefa e abrir o pull request.
export interface AgentRunner {
  start(task: Task): Promise<void>;
}

// Enquanto o fornecedor de sandbox não está definido, a tarefa só fica na fila.
export const queueOnlyRunner: AgentRunner = {
  async start(task) {
    console.info(`[agent] tarefa ${task.id} na fila para ${task.repositoryId}`);
  },
};
