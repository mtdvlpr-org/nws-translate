import initSqlJs, { type Database } from "sql.js";

/**
 * Loads the database from the data.
 * @param data The data to load the database from.
 * @returns The loaded database.
 */
export const loadDatabase = async (
  data: ArrayLike<number> | Buffer,
): Promise<Database> => {
  try {
    console.log("Initializing SQL...");
    const SQL = await initSqlJs({
      locateFile: () =>
        new URL("./../../public/sql-wasm.wasm", import.meta.url).toString(),
    });
    console.log("SQL initialized");
    const db = new SQL.Database(data);
    console.log("Database loaded");
    return db;
  } catch (e) {
    console.error(e);
    throw createError({ cause: e, message: "Failed to load database" });
  }
};

/**
 * Queries the database for multiple rows.
 * @param db The database to query.
 * @param query The query to execute.
 * @returns The multiple rows of the query.
 */
export const queryDatabase = <T extends Record<string, unknown>>(
  db: Database,
  query: string,
): T[] => {
  try {
    console.log("Executing query...");
    const result = db.exec(query);
    const rows = result.flatMap((execResult) => {
      return execResult.values.map((rowValues) => {
        const object: T = {} as T;
        execResult.columns.forEach((col, i) => {
          object[col as keyof T] = rowValues[i] as T[keyof T];
        });
        return object;
      });
    });

    return rows;
  } catch (e) {
    console.error(e);
    throw createError({ cause: e, message: "SQL query failed" });
  }
};

/**
 * Queries the database for a single row.
 * @param db The database to query.
 * @param query The query to execute.
 * @returns The single row of the query.
 */
export const queryDatabaseSingle = <T extends Record<string, unknown>>(
  db: Database,
  query: string,
): T => {
  const result = queryDatabase<T>(db, query);
  if (result.length === 0)
    throw createError({ message: "No result found for query" });
  return result[0]!;
};
