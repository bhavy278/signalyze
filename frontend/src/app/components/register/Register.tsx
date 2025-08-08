"use client";

import { useToast } from "@/context/ToastContext";
import { getToken } from "@/lib/token";
import { registerUser } from "@/services/auth.service";
import { AuthResponseType, RegisterUserType } from "@/types/auth.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import LoadingButton from "../ui/LoadingButton";

const Register = () => {
  const [formData, setFormData] = useState<RegisterUserType>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError) {
      alert("Please fix the errors before submitting.");
      return;
    }
    setIsRegistering(true);
    try {
      const response: AuthResponseType = await registerUser(formData);

      if (response.success) {
        console.log(response.success);
        addToast({
          message: "Registered successfully! Please login here.",
          severity: "success",
          position: "top-right",
        });
        router.push("/auth?type=login");
      }
    } catch (error: any) {
      addToast({
        message: error.message,
        severity: "error",
        position: "top-right",
      });
    } finally {
      setIsRegistering(false);
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

      console.log(formData);
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
  }, [router]);
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-light-200 p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              label="Full Name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <LoadingButton txt="Registering..." />
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth?type=login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
