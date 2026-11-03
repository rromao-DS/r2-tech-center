import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type * as schema from "./schema";

// Aceita tanto o cliente postgres-js de produção quanto o PGlite dos testes.
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
