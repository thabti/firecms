import Link from "next/link";
import { FileText, Image as ImageIcon, Home } from "lucide-react";

const navigation = [
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - Responsive */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - Slightly smaller on mobile */}
            <Link href="/admin/pages" className="flex items-center gap-2 hover:no-underline flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">T</span>
              </div>
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white">ThabtiCMS</span>
            </Link>

            {/* Responsive Navigation Links */}
            <div className="flex items-center gap-1 sm:gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors"
                    title={item.name}
                  >
                    <Icon className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-4 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors"
                title="View Site"
              >
                <Home className="h-4 w-4 sm:hidden flex-shrink-0" />
                <span className="hidden sm:inline">View Site →</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
