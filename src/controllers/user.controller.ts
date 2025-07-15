import { Response } from "express";
import { AuthenticatedRequest } from "../commons/types/express/global";
import {
  getPasswordByEmail,
  updateUserPassword,
} from "../services/user.service";
import { comparePassword, encryptPassword } from "../services/auth.service";
import { RESULT_ENUM } from "../commons/constants/app.constants";

export const getLoggedInUserEmail = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userEmail = _req.user?.email;

    if (!userEmail) {
      return res.status(404).json({ error: "User email not found" });
    }

    return res.status(200).json({ email: userEmail });
  } catch (error: unknown) {
    console.error("Error fetching user email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getLoggedInUserInfo = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = _req.user;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: unknown) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePassword = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { email } = _req.user;
    const { oldPassword, newPassword } = _req.body;

    const passwordFromDb = await getPasswordByEmail(email);
    const isPasswordValid = await comparePassword(oldPassword, passwordFromDb);

    if (isPasswordValid) {
      const hashedNewPassword = await encryptPassword(newPassword);
      const result = await updateUserPassword(email, hashedNewPassword);

      if (result === RESULT_ENUM.SUCCESS)
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      else return res.status(400).json({ error: "Failed to update password" });
    } else {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
  } catch (error: unknown) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
