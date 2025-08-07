import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Signalyze - AI Document Analysis",
  description:
    "Analyze your contracts, leases, and terms of service with the power of AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-50 text-gray-800 flex flex-col min-h-screen`}
      >
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
