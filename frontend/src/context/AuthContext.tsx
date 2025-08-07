"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken, removeToken } from "@/lib/token";
import { useToast } from "./ToastContext";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const { addToast } = useToast();

  useEffect(() => {
    const token = getToken();

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
    addToast({
      message: "Login successful.",
      severity: "success",
      position: "top-right",
    });
    router.push("/");
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    addToast({
      message: "Logout successful! Goodbye.",
      severity: "success",
      position: "top-right",
    });
    router.push("/auth?type=login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
