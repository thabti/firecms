import Link from "next/link";
import { ArrowRight, Database, Layout, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ThabtiCMS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Modern Content Management System
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <Layout className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Page Builder</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create pages with sections and customizable content blocks
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <Database className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Storage</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Multiple storage adapters: PostgreSQL, SQLite, or JSON file
              storage
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <Zap className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Modern API</h3>
            <p className="text-gray-600 dark:text-gray-400">
              RESTful API endpoints for headless CMS capabilities
            </p>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link
            href="/admin/pages"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Pages
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="/api/pages"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            View API
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="mt-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ Pages with customizable sections</li>
            <li>
              ✓ Multiple block types: text, images, headings, lists, quotes
            </li>
            <li>✓ Drag & drop page and block reordering</li>
            <li>✓ Image optimization with Next.js Image</li>
            <li>✓ RESTful API for headless CMS usage</li>
            <li>✓ Modern UI with Tailwind CSS and shadcn/ui</li>
            <li>✓ TypeScript for type safety</li>
            <li>✓ Pluggable storage: PostgreSQL, SQLite, or JSON</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
