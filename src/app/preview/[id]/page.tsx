"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageRenderer } from "@/components/page-renderer";
import { apiCall } from "@/lib/api-client";
import type { Page } from "@/types";

export default function PreviewPage() {
  const params = useParams();
  const pageId = params.id as string;
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiCall<Page>(`/api/pages/${pageId}`);
        setPage(data);
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Failed to load page preview");
      } finally {
        setLoading(false);
      }
    }

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Preview Not Available
          </h1>
          <p className="text-gray-600">{error || "Page not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Preview banner */}
      <div className="sticky top-0 z-50 bg-yellow-100 border-b-2 border-yellow-300 px-4 py-2 text-center">
        <p className="text-sm font-medium text-yellow-900">
          📋 Preview Mode - This is how your page will look when live
        </p>
      </div>

      {/* Page content */}
      <PageRenderer page={page} showMetadata={true} />
    </div>
  );
}
