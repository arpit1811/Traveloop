"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/activity-search", label: "Activity Search" },
];

const loggedInLinks = [
  { href: "/trips", label: "My Trips" },
  { href: "/trips/new", label: "Create Trip" },
  { href: "/billing", label: "Billing" },
];

export default function Navbar() {
  const { user, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  return (
    <nav className="bg-[#2E4057] text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-[#FF6B35]">Traveloop</Link>
        
        <div className="hidden md:flex items-center gap-6">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm hover:text-[#FF6B35] transition-colors ${
                pathname === link.href ? "text-[#FF6B35]" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && loggedInLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm hover:text-[#FF6B35] transition-colors ${
                pathname === link.href ? "text-[#FF6B35]" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && isAdmin && (
            <Link
              href="/admin"
              className={`text-sm hover:text-[#FF6B35] transition-colors ${
                pathname === "/admin" ? "text-[#FF6B35]" : "text-white/80"
              }`}
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <Link href="/profile">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-[#FF6B35]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-medium text-sm">
                {user.email?.[0].toUpperCase() || "?"}
              </div>
            )}
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/80 hover:text-white">Login</Link>
            <Link href="/signup" className="text-sm bg-[#FF6B35] px-3 py-1.5 rounded-lg hover:bg-[#e55a2b] transition-colors">
              Sign Up
            </Link>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#2E4057] border-t border-white/10 p-4 flex flex-col gap-3 md:hidden z-50">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm hover:text-[#FF6B35] ${
                pathname === link.href ? "text-[#FF6B35]" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && loggedInLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm hover:text-[#FF6B35] ${
                pathname === link.href ? "text-[#FF6B35]" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`text-sm hover:text-[#FF6B35] ${
                pathname === "/admin" ? "text-[#FF6B35]" : "text-white/80"
              }`}
            >
              Admin
            </Link>
          )}
          
          {!user && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-white/80 hover:text-white">Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-sm text-[#FF6B35]">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}