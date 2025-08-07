import {
  RegisterUserType,
  LoginUserType,
  AuthResponseType,
} from "@/types/auth.types";
import api from "./api";
import { setToken } from "@/lib/token";

export const registerUser = async (
  user: RegisterUserType
): Promise<AuthResponseType> => {
  try {
    console.log(user);
    const response = await api.post("/auth/register", user);

    if (response.data.user) {
      setToken(response.data.user.token);
    }
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Registration failed. Try again later."
    );
  }
};
export const loginUser = async (
  userData: LoginUserType
): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>("/auth/login", userData);

    if (response.data.user) {
      console.log(response.data.user.token);
      setToken(response.data.user.token);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.msg || "Invalid credentials");
  }
};
