import { Request, Response } from "express";
import {
  comparePassword,
  encryptPassword,
  findUserByEmail,
  generateJWT,
  registerUser,
} from "../services/auth.services";
import { RESULT_ENUM } from "../commons/constants/app.constants";
import { User } from "../commons/types/auth.types";

export const register = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password, role } = _req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({
      error: "All fields are required: name, email, password, role",
    });

  if (role !== "admin" && role !== "user")
    return res.status(400).json({
      error: "Role must be either 'admin' or 'user'",
    });

  const hashedPassword = await encryptPassword(password);

  const status: string = await registerUser(name, email, hashedPassword, role);

  if (status === RESULT_ENUM.FAILED) {
    return res.status(500).json({
      error: "Failed to register user. Please try again later.",
    });
  } else if (status === RESULT_ENUM.SUCCESS) {
    return res.status(201).json({
      message: "User registered successfully. Please log in.",
    });
  } else if (status === RESULT_ENUM.EMAIL_EXISTS) {
    return res.status(409).json({
      error: "Email already exists. Please use a different email.",
    });
  } else if (status === RESULT_ENUM.SERVER_ERROR) {
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  } else {
    return res.status(500).json({
      error: "Unexpected error occurred. Please Try again later.",
    });
  }
};

export const login = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = _req.body;

  if (!email || !password)
    return res.status(400).json({
      error: "Email and password are required",
    });

  const user: User | null = await findUserByEmail(email);

  if (user === null) {
    return res.status(404).json({
      error: "Email not found. Please register first.",
    });
  } else if (user.email && user.password) {
    const isPasswordCorrect = await comparePassword(password, user.password);
    
    if (isPasswordCorrect) {
      const jwt = await generateJWT({
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      });
      return res.status(200).json({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          token: jwt.token,
        },
      });
    } else {
      return res.status(401).json({
        error: "Incorrect password. Please try again.",
      });
    }
  }

  return res.status(501).json({});
};
