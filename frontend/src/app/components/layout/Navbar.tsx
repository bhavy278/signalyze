"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "Upload", href: "/" },
  { name: "Dashboard", href: "/documents" },
  { name: "About", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();

  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-600"
        >
          Signalyze
        </Link>
        <div className="flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-gray-600 hover:text-blue-600 transition-colors duration-300 relative ${
                  isActive ? "font-semibold text-blue-600" : ""
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"></span>
                )}
              </Link>
            );
          })}
        </div>
        <div className="hidden md:block">
          {isAuthenticated ? (
            <Button variant="primary" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Link href="/auth?type=login">
              <Button variant="primary">Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
