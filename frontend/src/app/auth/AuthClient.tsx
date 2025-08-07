// src/app/auth/AuthClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Login from "@/app/components/login/Login";
import Register from "@/app/components/register/Register";

export default function AuthClient() {
  const searchParams = useSearchParams();
  const authType = searchParams.get("type");

  return <div>{authType?.trim() === "login" ? <Login /> : <Register />}</div>;
}
