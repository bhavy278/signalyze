// src/app/auth/page.tsx

import { Suspense } from "react";
import AuthClient from "./AuthClient";
import { Loader2 } from "lucide-react"; // Or any loading component

// A simple fallback component to show while the client component loads
const AuthLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default function Auth() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthClient />
    </Suspense>
  );
}
