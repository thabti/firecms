"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, FileText, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Page } from "@/types";
import { apiCall } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) return;

    // Optimistic update
    setPages(pages.filter((p) => p.id !== id));

    try {
      await apiCall(`/api/pages/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page");
      // Revert on error
      fetchPages();
    }
  };

  const filteredPages = pages.filter(page => {
    if (filter === "published") return page.published;
    if (filter === "draft") return !page.published;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
              <p className="text-gray-600 mt-2">
                Manage your content pages and their structure
              </p>
            </div>
            <Link href="/admin/pages/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Page
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          {pages.length > 0 && (
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  filter === "all"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({pages.length})
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  filter === "published"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Published ({pages.filter(p => p.published).length})
              </button>
              <button
                onClick={() => setFilter("draft")}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  filter === "draft"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Draft ({pages.filter(p => !p.published).length})
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {pages.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first page. You can add sections, blocks, and templates to build rich content.
            </p>
            <Link href="/admin/pages/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create your first page
              </Button>
            </Link>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No {filter} pages found</p>
          </div>
        ) : (
          /* Pages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        /{page.slug}
                      </p>
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

                {/* Card Body */}
                <div className="p-5 bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      {page.sections.length} {page.sections.length === 1 ? "section" : "sections"}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/pages/${page.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                    </Link>
                    {page.published && (
                      <Link href={`/${page.slug}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePage(page.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
