import path from "path";
import { drizzle, PgliteDatabase } from "drizzle-orm/pglite";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js/driver";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import * as schema from "../schema";

export const createMockDb = async (): Promise<
  PgliteDatabase<typeof schema>
> => {
  const migrationsPath = path.resolve(__dirname, "../../drizzle");
  const db = drizzle({ schema, casing: "snake_case" });

  // Run your actual PostgreSQL migrations
  await migrate(db as any as PostgresJsDatabase, {
    migrationsFolder: migrationsPath,
  });

  return db;
};
