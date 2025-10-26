import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="hover:no-underline">
                <h1 className="text-xl font-semibold text-blue-600">
                  FireCMS Admin
                </h1>
              </Link>
              <nav className="flex gap-6">
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium">
                  Pages
                </Link>
                <Link href="/admin/media" className="text-gray-600 hover:text-blue-600 font-medium">
                  Media
                </Link>
                <Link href="/admin/settings" className="text-gray-600 hover:text-blue-600 font-medium">
                  Settings
                </Link>
              </nav>
            </div>
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              View Site
            </Link>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
