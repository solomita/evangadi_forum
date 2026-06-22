import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { db } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Runs schema.sql against the connected database.
 * Uses IF NOT EXISTS so it is safe to call on every startup —
 * existing tables and data are never dropped.
 */
export async function runMigrations() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = readFileSync(schemaPath, "utf8");

  // Split on semicolons to execute each statement individually
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  const conn = await db.getConnection();
  try {
    for (const stmt of statements) {
      await conn.query(stmt);
    }
    console.log("✅ Database migrations applied successfully.");
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    throw err;
  } finally {
    conn.release();
  }
}
