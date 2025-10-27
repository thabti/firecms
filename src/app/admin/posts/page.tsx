import Link from "next/link";
import { Plus, Calendar, User } from "lucide-react";

// Mock data - in production, fetch this server-side
const posts = [
  {
    id: "1",
    title: "Making The World a Better Place",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: "David Clarke",
    category: "Big Data",
    publishDate: "Feb 12, 2019",
    status: "published" as const,
  },
  {
    id: "2",
    title: "Getting Started with ThabtiCMS",
    excerpt: "A comprehensive guide to setting up your first CMS project...",
    author: "Jane Doe",
    category: "Tutorials",
    publishDate: "Mar 5, 2024",
    status: "published" as const,
  },
  {
    id: "3",
    title: "Advanced Features in Modern CMSs",
    excerpt: "Exploring the latest features and best practices...",
    author: "John Smith",
    category: "Technology",
    publishDate: "Draft",
    status: "draft" as const,
  },
];

export default function PostsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your blog posts and articles
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="hover:no-underline"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.publishDate}</span>
                  </div>
                  <div className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                    {post.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
