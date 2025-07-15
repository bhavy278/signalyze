// src/config/db.ts
import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_NAME) {
  throw new Error("⚠️ DB_NAME is not defined in .env");
}
export let db: mysql.Pool;
export async function connectToDatabase(): Promise<mysql.Pool> {
  try {
    // Step 1: Connect without DB to check/create it
    const connection: Connection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // 1. Create DB
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

    await createAllTables(connection);

    await connection.end();

    // Step 2: Now create pool with the actual DB
    db = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectionLimit: 10,
      multipleStatements: true,
    });

    // Optional: test pool connection
    await db.getConnection();

    await createStoredProcedures(db);
    return db;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    process.exit(1);
  }
}

const createAllTables = async (connection: Connection) => {
  const dbSetupQuery = fs.readFileSync(
    path.join(__dirname, "../sql/init/init.sql"),
    "utf8"
  );

  await connection.query(dbSetupQuery);

  console.log("✅ Tables created successfully");
};

const createStoredProcedures = async (db: mysql.Pool) => {
  const registerUserQuery = fs.readFileSync(
    path.join(__dirname, "../sql/procedures/sp_register_user.sql"),
    "utf8"
  );
  await db.query(registerUserQuery);

  console.log("✅ Stored procedures Registered successfully");
};
