"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, FileText, Image as ImageIcon } from "lucide-react";

const navigation = [
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed top-16 left-0 right-0 bg-blue-600 shadow-lg z-50 md:hidden">
            <nav className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View Site →
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
