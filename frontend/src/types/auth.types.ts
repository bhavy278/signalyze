import { AxiosResponse } from "axios";

export interface RegisterUserType {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}
export interface LoginUserType {
  email: string;
  password: string;
}
export interface AuthResponseType extends AxiosResponse {
  data: string;
  success: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    token: string;
  };
}
