import { Request, Response } from "express";
import {
  checkIfEmailExists,
  getUserPasswordByEmail,
  handleGenerateJsobWebToken,
  handleMatchPassword,
  handlePasswordEncryption,
} from "../utils/auth.utils";
import { UserModel } from "../models/user.model";
import {
  IUser,
  IUserSignIn,
  IUserSignup,
} from "../commons/interfaces/auth.interface";

export const handleAuthSignUp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  // Validate if email provided
  if (!email) {
    res.status(400).json({
      message: "Email is required",
      status: "error",
    });
  }

  // Validate if email already exists or not
  const isEmailExists = await checkIfEmailExists(email);
  if (isEmailExists) {
    res.status(400).json({
      message: "Email already exists",
      status: "error",
    });
  } else {
    // Encrypt password and create user
    const hashedPassword = await handlePasswordEncryption(password);

    const user: IUserSignup = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User signed up successfully",
      user,
    });
  }
};

export const handleAuthSignIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body.email) {
    res.status(400).json({
      message: "Email is required",
      status: "error",
    });
  }
  // Validate if email exists
  const isEmailExists = await checkIfEmailExists(req.body.email);
  if (isEmailExists) {
    // Get user password by email
    const hashedPassword = await getUserPasswordByEmail(req.body.email);

    if (hashedPassword) {
      const isPasswordCorrect = await handleMatchPassword(
        req.body.password,
        hashedPassword
      );
      if (isPasswordCorrect) {
        const user: IUser | null = await UserModel.findOne(
          {
            email: req.body.email,
          },
          { password: 0, createdAt: 0, __v: 0 }
        );
        if (user) {
          const token = await handleGenerateJsobWebToken(user);
          res.status(200).json({
            success: true,
            message: "Authenticated successfully.",
            token,
          });
        }
      } else {
        res.json({
          message: "Invalid Password",
          status: "error",
        });
      }
    } else {
      res.status(400).json({
        message: "Bad Request",
        status: "error",
      });
    }
  } else {
    res.status(400).json({
      message: "Email does not exist",
      status: "error",
    });
  }
};
