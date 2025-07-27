// src/config/db.ts
import dotenv from "dotenv";
import fs from "fs";
import mysql, { Connection } from "mysql2/promise";
import path from "path";
import { STORED_PROCEDURES } from "../commons/constants/query.constants";
import { getQueryFromFile } from "../services/app.services";
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

      multipleStatements: true,
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
  const registerUserQuery = getQueryFromFile(STORED_PROCEDURES.REGISTER_USER);

  await db.query(registerUserQuery);

  const saveDocumentQuery = getQueryFromFile(STORED_PROCEDURES.SAVE_DOCUMENT);
  await db.query(saveDocumentQuery);

  console.log("✅ Stored procedures Registered successfully");
};
