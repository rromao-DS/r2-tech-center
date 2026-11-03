import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não está definida. Veja o .env.example.");
  }
  return drizzle(postgres(url), { schema });
}

let instance: ReturnType<typeof createDb> | undefined;

// Conexão criada só no primeiro uso, para o build não exigir DATABASE_URL.
export function getDb() {
  instance ??= createDb();
  return instance;
}
