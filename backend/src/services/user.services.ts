import { RESULT_ENUM } from "../commons/constants/app.constants";
import { USER_QUERIES } from "../commons/constants/query.constants";
import { db } from "../config/db.config";
import { getQueryFromFile } from "./app.services";

export const getPasswordByEmail = async (email: string) => {
  const query = getQueryFromFile(USER_QUERIES.GET_PASSWORD_BY_EMAIL);

  const [rows]: any[] = await db.query(query, [email]);

  if (rows.length === 0) {
    throw new Error("User not found");
  } else {
    return rows[0].password;
  }
};

export const updateUserPassword = async (
  email: string,
  newHashedPassword: string
): Promise<string> => {
  const query = getQueryFromFile(USER_QUERIES.UPDATE_PASSWORD_BY_EMAIL);

  const [rows]: any[] = await db.query(query, [newHashedPassword, email]);
  if (rows.affectedRows === 0) {
    return RESULT_ENUM.FAILED;
  } else {
    return RESULT_ENUM.SUCCESS;
  }
};
