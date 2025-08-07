import {
  RegisterUserType,
  LoginUserType,
  AuthResponseType,
} from "@/types/auth.types";
import api from "./api";
import { setToken } from "@/lib/token";

interface AxiosErrorData {
  message?: string;
  msg?: string;
}

interface AxiosErrorResponse {
  data?: AxiosErrorData | null;
}

interface AxiosErrorLike {
  response?: AxiosErrorResponse | null;
}

const getErrorMessage = (
  error: unknown,
  fallback = "An error occurred"
): string => {
  const err = error as AxiosErrorLike;

  if (err && typeof err === "object" && err.response && err.response.data) {
    return err.response.data.message || err.response.data.msg || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const registerUser = async (
  user: RegisterUserType
): Promise<AuthResponseType> => {
  try {
    console.log(user);
    const response = await api.post<AuthResponseType>("/auth/register", user);

    if (response.data.user) {
      setToken(response.data.user.token);
    }
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, "Registration failed. Try again later.")
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
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Invalid credentials"));
  }
};
