"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Page } from "@/types";

export default function AdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      await fetch(`/api/pages/${id}`, { method: "DELETE" });
      setPages(pages.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-gray-600 mt-1">Manage your content pages</p>
        </div>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No pages yet</p>
            <Link href="/admin/pages/new">
              <Button>Create your first page</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{page.title}</CardTitle>
                      {page.published ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      /{page.slug}
                      {page.description && ` • ${page.description}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/pages/${page.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePage(page.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {page.sections.length} section(s)
                  {" • "}
                  {page.sections.reduce(
                    (acc, s) => acc + s.blocks.length,
                    0
                  )}{" "}
                  block(s)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
