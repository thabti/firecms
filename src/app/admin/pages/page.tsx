"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import type { Page } from "@/types";
import { apiCall } from "@/lib/api-client";

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await apiCall<Page[]>("/api/pages");
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    setPages(pages.filter((p) => p.id !== id));

    try {
      await apiCall(`/api/pages/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page");
      fetchPages();
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && page.published) ||
      (filter === "draft" && !page.published);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your content pages and their structure
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Page
        </Link>
      </div>

      {/* Search and Filters */}
      {pages.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "published"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "draft"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Draft
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {pages.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first page. You can add sections, blocks, and
            templates to build rich content.
          </p>
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create your first page
          </Link>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No pages found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/pages/${page.id}`} className="hover:no-underline">
                      <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">/{page.slug}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      page.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {page.published ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Live
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </>
                    )}
                  </span>
                </div>

                {page.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {page.description}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-5 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {page.sections.length}{" "}
                    {page.sections.length === 1 ? "section" : "sections"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="flex-1 text-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-1.5" />
                    Edit
                  </Link>
                  {page.published && (
                    <Link
                      href={`/${page.slug}`}
                      target="_blank"
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => deletePage(page.id)}
                    className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
