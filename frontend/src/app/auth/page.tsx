"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Login from "../components/login/page";
import Register from "../components/register/page";

export default function Auth() {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const authType = searchParams.get("type");
  console.log(pathname, authType);

  return <div>{authType?.trim() === "login" ? <Login /> : <Register />}</div>;
}
