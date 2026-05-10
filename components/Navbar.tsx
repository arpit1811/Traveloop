"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
];

const loggedInLinks = [
  { href: "/trips", label: "My Trips" },
  { href: "/trips/new", label: "Create Trip" },
  { href: "/activity-search", label: "Activity Search" },
];

const journalCities = [
  { href: "/journal/delhi", label: "Delhi" },
  { href: "/journal/mumbai", label: "Mumbai" },
  { href: "/journal/paris", label: "Paris" },
];

const checklistCities = [
  { href: "/packing-checklist/delhi", label: "Delhi" },
  { href: "/packing-checklist/mumbai", label: "Mumbai" },
  { href: "/packing-checklist/paris", label: "Paris" },
];

const rightLinks = [
  { href: "/billing", label: "Billing" },
];

export default function Navbar() {
  const { user, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

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
          
          {user && (
            <div className="relative group">
              <button
                className={`text-sm transition-all duration-200 flex items-center gap-1 ${
                  pathname.startsWith("/journal") ? "text-[#FF6B35]" : "text-white/80"
                }`}
              >
                Journal ▾
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[120px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {journalCities.map((city) => (
                  <Link
                    key={city.href}
                    href={city.href}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-[#FF6B35] hover:text-white transition-all duration-150 ${
                      pathname === city.href ? "bg-[#FF6B35] text-white" : ""
                    }`}
                  >
                    {city.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {user && (
            <div className="relative group">
              <button
                className={`text-sm transition-all duration-200 flex items-center gap-1 ${
                  pathname.startsWith("/packing-checklist") ? "text-[#FF6B35]" : "text-white/80"
                }`}
              >
                Checklist ▾
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[120px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {checklistCities.map((city) => (
                  <Link
                    key={city.href}
                    href={city.href}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-[#FF6B35] hover:text-white transition-all duration-150 ${
                      pathname === city.href ? "bg-[#FF6B35] text-white" : ""
                    }`}
                  >
                    {city.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
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
        {user && rightLinks.map((link) => (
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
          
          {user && (
            <div className="flex flex-col gap-1 pl-2">
              <span className="text-xs text-white/50">Journal</span>
              {journalCities.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm hover:text-[#FF6B35] ${
                    pathname === city.href ? "text-[#FF6B35]" : "text-white/80"
                  }`}
                >
                  {city.label}
                </Link>
              ))}
            </div>
          )}
          
          {user && (
            <div className="flex flex-col gap-1 pl-2">
              <span className="text-xs text-white/50">Checklist</span>
              {checklistCities.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm hover:text-[#FF6B35] ${
                    pathname === city.href ? "text-[#FF6B35]" : "text-white/80"
                  }`}
                >
                  {city.label}
                </Link>
              ))}
            </div>
          )}
          
          {user && rightLinks.map((link) => (
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