import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { RESULT_ENUM } from "../commons/constants/app.constants";
import jwt from "jsonwebtoken";
import { JWTInputType, JWTOutputType } from "../commons/types/auth.types";
import { db } from "../config/db.config";

export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 11;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateJWT = async (
  user: JWTInputType
): Promise<JWTOutputType> => {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return {
    token,
  };
};

export const verifyJWT = async (token: string): Promise<Boolean> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === "object" && "email" in decoded) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return false;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<string> => {
  try {
    const query = fs.readFileSync(
      path.join(__dirname, "../sql/queries/auth/register_new_user_call.sql"),
      "utf-8"
    );

    const [result] = await db.query(query, [name, email, password, role]);

    if ((result as any).affectedRows === 0) return RESULT_ENUM.FAILED;
    else return RESULT_ENUM.SUCCESS;
  } catch (error: any) {
    if (
      error.code === "ER_SIGNAL_EXCEPTION" &&
      error.sqlMessage === "Email already exists"
    ) {
      return RESULT_ENUM.EMAIL_EXISTS;
    }
    return RESULT_ENUM.SERVER_ERROR;
  }
};

export const findUserByEmail = async (email: string): Promise<any> => {
  const query = fs.readFileSync(
    path.join(__dirname, "../sql/queries/auth/find_user_by_email.sql"),
    "utf-8"
  );
  const [result]: any = await db.query(query, [email]);
  if (result.length === 0) return null;
  else return result[0];
};
