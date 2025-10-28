"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Save, ArrowLeft, Trash2, Plus, FileText, Eye,
  Settings2, Loader2, CheckCircle2, AlertCircle,
  GripVertical, ArrowUp, ArrowDown, ChevronUp, ChevronDown, Code, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { apiCall } from "@/lib/api-client";
import { BlockEditor } from "@/components/block-editor";
import { TemplateSelector } from "@/components/template-selector";
import { DraggableSection } from "@/components/draggable-section";
import { DraggableBlock } from "@/components/draggable-block";
import { EditableSectionTitle } from "@/components/editable-section-title";
import { GlobalSaveButton } from "@/components/global-save-button";
import { SectionDropZone } from "@/components/section-drop-zone";
import { Button } from "@/components/ui/button";
import { usePageEditorStore } from "@/store/page-editor-store";
import type { Page, Section, Block } from "@/types";
import type { Template } from "@/types/templates";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  // Zustand store
  const {
    page,
    setPage: setPageInStore,
    updatePage: updatePageInStore,
    addSection: addSectionToStore,
    updateSection: updateSectionInStore,
    deleteSection: deleteSectionFromStore,
    reorderSections: reorderSectionsInStore,
    updateBlock: updateBlockInStore,
    addBlock: addBlockToStore,
    deleteBlock: deleteBlockFromStore,
    moveBlockBetweenSections,
  } = usePageEditorStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    live: false,
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "settings">("content");

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const data = await apiCall<Page>(`/api/pages/${pageId}`);
      setPageInStore(data); // Use Zustand store
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        live: data.live,
      });
    } catch (error) {
      console.error("Error fetching page:", error);
      showNotification("Failed to load page", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    // Simple notification - you could enhance this with a toast library
    if (type === "error") {
      console.error(message);
    }
    setSaveStatus(type === "error" ? "error" : "saved");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("saving");

    try {
      await apiCall(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Update local page state with new metadata
      updatePageInStore(formData);

      showNotification("Page updated successfully!", "success");
    } catch (error) {
      console.error("Error updating page:", error);
      showNotification("Failed to update page", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    // Reload the page from the server, discarding any unsaved changes
    window.location.reload();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) return;

    try {
      await apiCall(`/api/pages/${pageId}`, {
        method: "DELETE",
      });

      router.push("/admin/pages");
    } catch (error) {
      console.error("Error deleting page:", error);
      showNotification("Failed to delete page", "error");
    }
  };

  const addSection = async () => {
    // Generate a unique 8-char identifier
    const generateId = () => Math.random().toString(36).substring(2, 10);
    const title = generateId();

    try {
      const newSection = await apiCall<Section>(`/api/pages/${pageId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      // Add section to store
      addSectionToStore(newSection);

      showNotification("Section added", "success");
    } catch (error) {
      console.error("Error adding section:", error);
      showNotification("Failed to add section", "error");
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section and all its blocks?")) return;

    // Delete section from store
    deleteSectionFromStore(sectionId);

    try {
      await apiCall(`/api/pages/${pageId}/sections/${sectionId}`, {
        method: "DELETE",
      });
      showNotification("Section deleted", "success");
    } catch (error) {
      console.error("Error deleting section:", error);
      showNotification("Failed to delete section", "error");
      // Revert on error
      fetchPage();
    }
  };

  const updateSectionTitle = async (sectionId: string, newTitle: string) => {
    // Update section title in store
    updateSectionInStore(sectionId, { title: newTitle });

    try {
      await apiCall(`/api/pages/${pageId}/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      showNotification("Section title updated", "success");
    } catch (error) {
      console.error("Error updating section title:", error);
      showNotification("Failed to update section title", "error");
      // Revert on error
      fetchPage();
    }
  };

  const moveSectionUp = (sectionIndex: number) => {
    if (sectionIndex === 0 || !page) return;

    const sections = [...page.sections];
    const [section] = sections.splice(sectionIndex, 1);
    sections.splice(sectionIndex - 1, 0, section);

    // Update store (will be saved with global save button)
    reorderSectionsInStore(sections);
  };

  const moveSectionDown = (sectionIndex: number) => {
    if (!page || sectionIndex === page.sections.length - 1) return;

    const sections = [...page.sections];
    const [section] = sections.splice(sectionIndex, 1);
    sections.splice(sectionIndex + 1, 0, section);

    // Update store (will be saved with global save button)
    reorderSectionsInStore(sections);
  };

  const handleSectionReorder = (sourceIndex: number, destinationIndex: number) => {
    if (!page || sourceIndex === destinationIndex) return;

    const sections = [...page.sections];
    const [section] = sections.splice(sourceIndex, 1);
    sections.splice(destinationIndex, 0, section);

    // Update store (will be saved with global save button)
    reorderSectionsInStore(sections);
  };

  const handleBlockReorder = (sectionId: string, sourceIndex: number, destinationIndex: number) => {
    if (!page || sourceIndex === destinationIndex) return;

    const sectionIndex = page.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const sections = [...page.sections];
    const section = { ...sections[sectionIndex] };
    const blocks = [...section.blocks];

    // Reorder blocks
    const [block] = blocks.splice(sourceIndex, 1);
    blocks.splice(destinationIndex, 0, block);

    // Update blocks with new order values
    const reorderedBlocks = blocks.map((b, index) => ({ ...b, order: index }));

    // Update store (will be saved with global save button)
    updateSectionInStore(sectionId, { blocks: reorderedBlocks });
  };

  const addBlock = async (sectionId: string, blockType: string) => {
    const blockData: any = { type: blockType };

    switch (blockType) {
      case "text":
        blockData.content = "Enter your text here...";
        break;
      case "heading":
        blockData.level = 2;
        blockData.content = "Heading";
        break;
      case "image":
        blockData.url = "";
        blockData.alt = "";
        break;
      case "list":
        blockData.items = ["Item 1"];
        blockData.ordered = false;
        break;
      case "quote":
        blockData.content = "Enter quote here...";
        break;
      case "action":
        blockData.actionType = "button";
        blockData.label = "Click me";
        blockData.url = "";
        blockData.style = "primary";
        blockData.openInNewTab = false;
        break;
      case "video":
        blockData.url = "";
        blockData.caption = "";
        break;
    }

    const section = page?.sections.find(s => s.id === sectionId);
    if (!section) return;

    // Create a temporary block with a unique ID
    const newBlock = {
      ...blockData,
      id: `temp-${Date.now()}`,
      order: section.blocks.length,
    } as Block;

    // Use Zustand store to add block (no API call - saved with global save button)
    addBlockToStore(sectionId, newBlock);
  };

  const updateBlock = (sectionId: string, blockId: string, data: any) => {
    // Use Zustand store to update block (no API call)
    updateBlockInStore(sectionId, blockId, data);
  };

  const deleteBlock = (sectionId: string, blockId: string) => {
    // Use Zustand store to delete block (no API call - saved with global save button)
    deleteBlockFromStore(sectionId, blockId);
  };

  const moveBlock = (sectionId: string, blockId: string, direction: "up" | "down") => {
    const section = page?.sections.find(s => s.id === sectionId);
    if (!section) return;

    const blockIndex = section.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const targetIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;
    if (targetIndex < 0 || targetIndex >= section.blocks.length) return;

    // Reorder blocks in local state
    const newBlocks = [...section.blocks];
    [newBlocks[blockIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[blockIndex]];

    // Update order property and use Zustand store
    const reorderedBlocks = newBlocks.map((block, idx) => ({ ...block, order: idx }));
    updateSectionInStore(sectionId, { blocks: reorderedBlocks });
  };

  const handleTemplateSelect = (template: Template) => {
    if (!selectedSectionId) return;

    const section = page?.sections.find(s => s.id === selectedSectionId);
    if (!section) return;

    // Create temporary blocks with unique IDs
    const newBlocks = template.blocks.map((block, idx) => ({
      ...block,
      id: `temp-${Date.now()}-${idx}`,
      order: section.blocks.length + idx,
    } as Block));

    // Add all blocks to the section using Zustand store
    newBlocks.forEach(block => addBlockToStore(selectedSectionId, block));

    setSelectedSectionId(null);
    showNotification(`Template "${template.name}" applied`, "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Link href="/admin/pages">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-0 shadow-sm" style={{ zIndex: "var(--z-editor-sticky)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link
                href="/admin/pages"
                className="inline-flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {page.title || "Untitled Page"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Status Indicator - Hidden on mobile */}
              {saveStatus && (
                <div className="hidden md:flex items-center gap-2 text-sm">
                  {saveStatus === "saving" && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-gray-600">Saving...</span>
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Saved</span>
                    </>
                  )}
                  {saveStatus === "error" && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Error</span>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Status Icon Only */}
              {saveStatus && (
                <div className="flex md:hidden">
                  {saveStatus === "saving" && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  {saveStatus === "saved" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {saveStatus === "error" && <AlertCircle className="w-4 h-4 text-red-600" />}
                </div>
              )}

              <Link href={`/preview/${pageId}`} target="_blank" className="hidden sm:inline-block">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Preview</span>
                </Button>
              </Link>

              {/* Mobile Preview Icon */}
              <Link href={`/preview/${pageId}`} target="_blank" className="sm:hidden">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>

              <Link href={`/api/pages/${pageId}`} target="_blank" className="hidden lg:inline-block">
                <Button variant="outline" size="sm">
                  <Code className="w-4 h-4 mr-2" />
                  API
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hidden sm:inline-flex"
              >
                <Trash2 className="w-4 h-4 lg:mr-2" />
                <span className="hidden lg:inline">Delete</span>
              </Button>

              {/* Mobile Delete Icon */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 sm:hidden"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("content")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "content"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "settings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Settings2 className="w-4 h-4 inline mr-1" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "settings" ? (
          /* Page Settings */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Page Settings</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Enter page title"
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 bg-gray-50 px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg">
                      /
                    </span>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      placeholder="page-url"
                      inputMode="url"
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                      required
                    />
                  </div>
                  <p className="mt-1.5 text-sm text-gray-500">
                    This will be the URL: {window.location.origin}/{formData.slug}
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    rows={3}
                    placeholder="A brief description of this page"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label htmlFor="live-toggle" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Page Status
                      </label>
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.live ? "Page is live and publicly visible" : "Page is in draft mode"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="live-toggle"
                        checked={formData.live}
                        onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {formData.live ? "Live" : "Draft"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {!formData.live ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          setFormData({ ...formData, live: false });
                          setTimeout(() => {
                            const form = (e.target as HTMLElement).closest('form');
                            if (form) form.requestSubmit();
                          }, 0);
                        }}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save as Draft
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          setFormData({ ...formData, live: true });
                          setTimeout(() => {
                            const form = (e.target as HTMLElement).closest('form');
                            if (form) form.requestSubmit();
                          }, 0);
                        }}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save & Publish
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Floating Save Button */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all hover:shadow-xl hover:scale-105"
              style={{ zIndex: "var(--z-save-button)" }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="text-sm sm:text-base">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Save</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Page Content */
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Page Content</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Build your page with sections and blocks</p>
              </div>
              <Button onClick={addSection} size="lg" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>

            {page.sections.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="max-w-md mx-auto">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections yet</h3>
                  <p className="text-gray-600 mb-6">
                    Get started by adding your first section to build your page content.
                  </p>
                  <Button onClick={addSection} size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Section
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {page.sections.map((section, sectionIndex) => (
                  <DraggableSection
                    key={section.id}
                    sectionId={section.id}
                    index={sectionIndex}
                    onReorder={handleSectionReorder}
                  >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <EditableSectionTitle
                              title={section.title}
                              sectionIndex={sectionIndex}
                              onSave={(newTitle) => updateSectionTitle(section.id, newTitle)}
                            />
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                              {section.blocks.length} {section.blocks.length === 1 ? "block" : "blocks"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          {/* Move buttons - Always visible since drag-and-drop doesn't work on touch */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveSectionUp(sectionIndex)}
                            disabled={sectionIndex === 0}
                            title="Move section up"
                            className="px-2"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveSectionDown(sectionIndex)}
                            disabled={sectionIndex === page.sections.length - 1}
                            title="Move section down"
                            className="px-2"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              setShowTemplateSelector(true);
                            }}
                            className="hidden md:inline-flex"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Insert Template
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSection(section.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 px-2"
                            title="Delete section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="p-6">
                      {section.blocks.length === 0 ? (
                        <SectionDropZone
                          sectionId={section.id}
                          onDropBlock={(sourceSectionId, targetSectionId, blockId) =>
                            moveBlockBetweenSections(sourceSectionId, targetSectionId, blockId, 0)
                          }
                        >
                          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-sm sm:text-base text-gray-600 mb-4">No blocks in this section yet. Drag a block here or add a new one.</p>
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "text")}
                                className="w-full sm:w-auto"
                              >
                                + Text
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "heading")}
                                className="w-full sm:w-auto"
                              >
                                + Heading
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "image")}
                                className="w-full sm:w-auto"
                              >
                                + Image
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "list")}
                                className="w-full sm:w-auto"
                              >
                                + List
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "quote")}
                                className="w-full sm:w-auto"
                              >
                                + Quote
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "action")}
                                className="w-full sm:w-auto"
                              >
                                + Action
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "video")}
                                className="w-full sm:w-auto"
                              >
                                + Video
                              </Button>
                            </div>
                          </div>
                        </SectionDropZone>
                      ) : (
                        <>
                          <div className="space-y-4 mb-4">
                            {section.blocks.map((block, index) => (
                              <DraggableBlock
                                key={block.id}
                                blockId={block.id}
                                sectionId={section.id}
                                index={index}
                                onReorder={(src, dest) => handleBlockReorder(section.id, src, dest)}
                                onMoveToSection={moveBlockBetweenSections}
                              >
                                <BlockEditor
                                  block={block}
                                  onUpdate={(data) => updateBlock(section.id, block.id, data)}
                                  onDelete={() => deleteBlock(section.id, block.id)}
                                  onMoveUp={() => moveBlock(section.id, block.id, "up")}
                                  onMoveDown={() => moveBlock(section.id, block.id, "down")}
                                  isFirst={index === 0}
                                  isLast={index === section.blocks.length - 1}
                                />
                              </DraggableBlock>
                            ))}
                          </div>

                          {/* Add Block Buttons */}
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-3">Add a block:</p>
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "text")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + Text
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "heading")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + Heading
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "image")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + Image
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "list")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + List
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "quote")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + Quote
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "action")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + Action
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBlock(section.id, "video")}
                                className="hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                              >
                                + Video
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  </DraggableSection>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showTemplateSelector && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => {
            setShowTemplateSelector(false);
            setSelectedSectionId(null);
          }}
        />
      )}

      {/* Global Save Button */}
      <GlobalSaveButton pageId={pageId} />
    </div>
  );
}
