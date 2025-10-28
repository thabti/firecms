"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Loader2, FileText, Copy } from "lucide-react";
import Link from "next/link";
import type { Page, Section } from "@/types";
import { apiCall } from "@/lib/api-client";

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      // Fetch all pages including non-live for admin view
      const data = await apiCall<Page[]>("/api/pages?includeNonLive=true");
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

  const toggleLiveStatus = async (page: Page) => {
    const newLiveStatus = !page.live;

    // Optimistically update UI
    setPages(pages.map(p => p.id === page.id ? { ...p, live: newLiveStatus } : p));

    try {
      await apiCall(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          description: page.description,
          live: newLiveStatus,
        }),
      });
    } catch (error) {
      console.error("Error updating page status:", error);
      alert("Failed to update page status");
      // Revert on error
      fetchPages();
    }
  };

  const clonePage = async (page: Page) => {
    try {
      // Create a new page with the same content but a different slug
      const newSlug = `${page.slug}-copy-${Date.now()}`;
      const newPage = await apiCall<Page>("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${page.title} (Copy)`,
          slug: newSlug,
          description: page.description,
        }),
      });

      // Clone all sections and blocks
      for (const section of page.sections) {
        const newSection = await apiCall<Section>(`/api/pages/${newPage.id}/sections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: section.title }),
        });

        // Clone all blocks in the section
        for (const block of section.blocks) {
          // Spread all block properties except id (server will generate new ID)
          const { id, ...blockWithoutId } = block;
          await apiCall(`/api/pages/${newPage.id}/sections/${newSection.id}/blocks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blockWithoutId),
          });
        }
      }

      // Refresh the pages list
      fetchPages();
      alert("Page cloned successfully!");
    } catch (error) {
      console.error("Error cloning page:", error);
      alert("Failed to clone page");
    }
  };

  const filteredPages = pages.filter((page) => {
    return (
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your content pages and their structure
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>New Page</span>
        </Link>
      </div>

      {/* Search */}
      {pages.length > 0 && (
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search pages by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
      )}

      {/* Empty State */}
      {pages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Creating Content</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Create your first page to start building your website. Pages can contain multiple sections with text, images, videos, and more.
            </p>
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create First Page
            </Link>
          </div>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No pages match your search</p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredPages.map((page) => (
              <div key={page.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/pages/${page.id}`} className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {page.title}
                    </Link>
                    {page.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{page.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Slug:</span>
                    <code className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs">/{page.slug}</code>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Status:</span>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={page.live}
                          onChange={() => toggleLiveStatus(page)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                      {page.live ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Sections:</span>
                    <span className="text-gray-600">
                      {page.sections.length} {page.sections.length === 1 ? "section" : "sections"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Updated:</span>
                    <span className="text-gray-600">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => clonePage(page)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Clone
                  </button>
                  <Link
                    href={`/${page.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button
                    onClick={() => deletePage(page.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sections
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link href={`/admin/pages/${page.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {page.title}
                        </Link>
                        {page.description && (
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{page.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">/{page.slug}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={page.live}
                            onChange={() => toggleLiveStatus(page)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                        {page.live ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {page.sections.length} {page.sections.length === 1 ? "section" : "sections"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/pages/${page.id}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit page"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => clonePage(page)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Clone page"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-700 transition-colors"
                          title="View page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
