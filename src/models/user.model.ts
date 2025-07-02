import mongoose, { Schema } from "mongoose";
import { IUserSignup } from "../commons/interfaces/auth.interface";

const UserSchema: Schema = new Schema<IUserSignup>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

export const UserModel = mongoose.model<IUserSignup>("User", UserSchema);
