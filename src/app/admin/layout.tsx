import Link from "next/link";
import { LayoutDashboard, FileText } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">FireCMS Admin</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/admin"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Pages</span>
              </Link>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
