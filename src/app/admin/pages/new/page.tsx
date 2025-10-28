"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import slug from "slug";
import { apiCall } from "@/lib/api-client";
import { fullPageTemplates } from "@/lib/templates";
import type { Page } from "@/types";

export default function NewPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newPage = await apiCall<Page>("/api/pages", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // If a template is selected, create sections and blocks
      if (selectedTemplate) {
        const template = fullPageTemplates.find(t => t.id === selectedTemplate);
        if (template) {
          for (const sectionTemplate of template.sections) {
            // Create section
            const newSection = await apiCall(`/api/pages/${newPage.id}/sections`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: sectionTemplate.title }),
            });

            // Create blocks in the section
            for (const block of sectionTemplate.blocks) {
              await apiCall(`/api/pages/${newPage.id}/sections/${newSection.id}/blocks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(block),
              });
            }
          }
        }
      }

      router.push(`/admin/pages/${newPage.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Failed to create page");
      setSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      // Only auto-generate slug if user hasn't manually edited it
      slug: manualSlugEdit ? prev.slug : slug(title),
    }));
  };

  const handleSlugChange = (slugValue: string) => {
    setManualSlugEdit(true);
    setFormData({ ...formData, slug: slug(slugValue) });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pages
        </Link>
      </div>

      <div className="max-w-4xl bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Page</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter page title"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/</span>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="page-url-slug"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Auto-generated from title. Edit to customize.
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the page"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                Start with Template (Optional)
              </label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Blank Page</option>
                {fullPageTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Choose a template to pre-populate your page with sections and content
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? "Creating..." : "Create Page"}
              </button>
              <Link
                href="/admin/pages"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
    </div>
  );
}
