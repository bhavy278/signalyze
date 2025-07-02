import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import {
  IUser,
  IUserSignIn,
  IUserSignup,
} from "../commons/interfaces/auth.interface";

// Encrypt password using bcrypt
export const handlePasswordEncryption = async (password: string) => {
  try {
    const salt = 10; // Cost factor for hashing (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw error;
  }
};

// Compare plain password and hashed password using bcrypt
export const handleMatchPassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Password match:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

// function checks if email already exists or not in database
export const checkIfEmailExists = async (email: string) => {
  const user: IUserSignup | null = await UserModel.findOne({ email });
  if (user) return true;
  else return false;
};

// function gets user password by email
export const getUserPasswordByEmail = async (email: string) => {
  const data = await UserModel.findOne({ email }, { password: 1, _id: 0 });
  return data?.password;
};

// generating JSON web token
export const handleGenerateJsobWebToken = (user: IUser) => {
  const payload = { ...user }; // Payload for generating secret token
  const options = { expiresIn: 3600, issuer: "signalyze" }; // token lasts for 1 hour only

  const jwtSecret = process.env.JWT_SECRET_KEY;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY is missing in environment variables");
  }
  // generate token
  const token = jwt.sign(payload, jwtSecret, options);

  return token;
};
