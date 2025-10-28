"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, FileText, Image as ImageIcon } from "lucide-react";

const navigation = [
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Store original overflow to restore later
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
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
          {/* Backdrop with fade animation */}
          <div
            className="fixed inset-0 bg-black/50 md:hidden animate-fadeIn"
            style={{ zIndex: "var(--z-nav-backdrop)" }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel with slide down animation */}
          <div
            className="fixed top-16 left-0 right-0 bg-blue-600 shadow-lg md:hidden animate-slideDown"
            style={{ zIndex: "var(--z-nav-menu)" }}
          >
            <nav className="px-4 py-3 space-y-1" role="navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors touch-manipulation"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors touch-manipulation"
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
