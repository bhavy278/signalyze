import mongoose from "mongoose";

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  documents?: mongoose.Types.ObjectId[];
}
export interface IUserSignIn {
  email: string;
  password: string;
}
export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}
