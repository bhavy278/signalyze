import mongoose from "mongoose";

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
export interface IUserSignIn {
  email: string;
  password: string;
}
export interface IUser {
  name: string;
  email: string;
}
