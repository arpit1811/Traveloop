"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "🏠" },
  { label: "Community", href: "/community", icon: "👥" },
  { label: "My Trips", href: "/trips", icon: "✈️" },
  { label: "Create Trip", href: "/trips/new", icon: "➕" },
  { label: "Billing", href: "/billing", icon: "💳" },
  { label: "Activity Search", href: "/activity-search", icon: "🎯" },
  { label: "City Search", href: "/search/cities", icon: "🌍" },
  { label: "Profile", href: "/profile", icon: "👤" },
  { label: "Admin", href: "/admin", icon: "⚙️" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const filteredItems = navItems.filter(item => {
    if (item.href === "/admin") {
      return user && isAdmin;
    }
    return true;
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#2E4057] text-white rounded-lg shadow-lg hover:bg-[#3d5a80] md:hidden"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside 
        className={`fixed left-0 top-0 h-full bg-[#2E4057] text-white transition-transform duration-300 z-50 flex flex-col w-56
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${isCollapsed ? 'md:-translate-x-56' : ''}
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10 min-h-[64px] pl-12 md:pl-4">
          <Link href="/" className="text-xl font-bold text-[#FF6B35]">
            Traveloop
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
          >
            <span className="text-xl">✕</span>
          </button>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:block"
            title={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
          >
            <span className="text-xl">{isCollapsed ? '☰' : '◀'}</span>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-colors relative
                  ${isActive ? 'bg-[#FF6B35]' : 'hover:bg-white/10'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute right-0 w-1 h-8 bg-white rounded-l" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}