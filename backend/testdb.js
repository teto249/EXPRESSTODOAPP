import pool from "./db.js";

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected successfully!");
  console.log("Server time:", result.rows[0].now);
} catch (err) {
  console.error("Database connection failed:", err.message);
} finally {
  await pool.end();
}
