"use client";

import { loginUser, registerUser } from "@/services/auth.service";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AuthResponseType,
  LoginUserType,
  RegisterUserType,
} from "@/types/auth.types";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/token";
import { useToast } from "@/context/ToastContext";

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginUserType>({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);

  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError) {
      alert("Please fix the errors before submitting.");
      return;
    }
    const response: AuthResponseType = await loginUser(formData);

    if (response.success) {
      addToast({
        message: "Login successful! Welcome back.",
        severity: "success",
        position: "top-right",
      });
      router.push("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.email) {
        if (!formData.email.includes("@")) {
          setEmailError("Please enter a valid email address.");
        } else {
          setEmailError(null);
        }
      } else {
        setEmailError(null);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formData]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-light-200 p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-y-4">
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                required
                label="Email address"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              label="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/auth?type=register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
