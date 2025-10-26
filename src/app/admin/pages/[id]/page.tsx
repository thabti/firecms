"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Page, Section, Block, BlockType } from "@/types";
import type { Template } from "@/types/templates";
import { BlockEditor } from "@/components/block-editor";
import { TemplateSelector } from "@/components/template-selector";
import { apiCall } from "@/lib/api-client";

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<{
    sectionId: string;
    blockId: string;
  } | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [templateTargetSection, setTemplateTargetSection] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const data = await apiCall<Page>(`/api/pages/${id}`);
      setPage(data);
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePageMetadata = async () => {
    if (!page) return;
    setSaving(true);

    try {
      await apiCall(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          description: page.description,
          published: page.published,
        }),
      });
      alert("Page updated successfully");
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Failed to update page");
    } finally {
      setSaving(false);
    }
  };

  const addSection = async () => {
    const title = prompt("Section title:");
    if (!title) return;

    try {
      await apiCall(`/api/pages/${id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      fetchPage();
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section?")) return;

    try {
      await apiCall(`/api/pages/${id}/sections/${sectionId}`, {
        method: "DELETE",
      });
      fetchPage();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const addBlock = async (sectionId: string, type: BlockType) => {
    try {
      let blockData: any = { type };

      if (type === "text") {
        blockData.content = "Enter text here...";
      } else if (type === "heading") {
        blockData.content = "Heading";
        blockData.level = 2;
      } else if (type === "image") {
        blockData.url = "";
        blockData.alt = "";
      } else if (type === "list") {
        blockData.items = ["Item 1"];
        blockData.ordered = false;
      } else if (type === "quote") {
        blockData.content = "Quote text";
      }

      await apiCall(`/api/pages/${id}/sections/${sectionId}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blockData),
      });
      fetchPage();
    } catch (error) {
      console.error("Error adding block:", error);
    }
  };

  const updateBlock = async (
    sectionId: string,
    blockId: string,
    data: any
  ) => {
    try {
      await apiCall(`/api/pages/${id}/sections/${sectionId}/blocks/${blockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchPage();
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };

  const deleteBlock = async (sectionId: string, blockId: string) => {
    if (!confirm("Delete this block?")) return;

    try {
      await apiCall(`/api/pages/${id}/sections/${sectionId}/blocks/${blockId}`, {
        method: "DELETE",
      });
      fetchPage();
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  const moveBlockUp = async (sectionId: string, blockIndex: number) => {
    if (!page || blockIndex === 0 || reordering) return;

    const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = page.sections[sectionIndex];
    const blocks = [...section.blocks];

    // Optimistic update - update UI immediately
    const updatedSections = [...page.sections];
    const updatedBlocks = [...blocks];
    [updatedBlocks[blockIndex], updatedBlocks[blockIndex - 1]] = [
      updatedBlocks[blockIndex - 1],
      updatedBlocks[blockIndex],
    ];
    updatedBlocks.forEach((block, index) => {
      block.order = index;
    });
    updatedSections[sectionIndex] = { ...section, blocks: updatedBlocks };
    setPage({ ...page, sections: updatedSections });

    setReordering(true);
    setError(null);

    try {
      // Only update the two blocks that changed positions
      const block1 = updatedBlocks[blockIndex];
      const block2 = updatedBlocks[blockIndex - 1];

      await Promise.all([
        apiCall(`/api/pages/${id}/sections/${sectionId}/blocks/${block1.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: block1.order }),
        }),
        apiCall(`/api/pages/${id}/sections/${sectionId}/blocks/${block2.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: block2.order }),
        }),
      ]);
    } catch (error) {
      console.error("Error reordering blocks:", error);
      setError("Failed to reorder blocks. Please refresh the page.");
      // Revert optimistic update on error
      fetchPage();
    } finally {
      setReordering(false);
    }
  };

  const moveBlockDown = async (sectionId: string, blockIndex: number) => {
    if (!page || reordering) return;

    const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = page.sections[sectionIndex];
    if (blockIndex === section.blocks.length - 1) return;

    const blocks = [...section.blocks];

    // Optimistic update - update UI immediately
    const updatedSections = [...page.sections];
    const updatedBlocks = [...blocks];
    [updatedBlocks[blockIndex], updatedBlocks[blockIndex + 1]] = [
      updatedBlocks[blockIndex + 1],
      updatedBlocks[blockIndex],
    ];
    updatedBlocks.forEach((block, index) => {
      block.order = index;
    });
    updatedSections[sectionIndex] = { ...section, blocks: updatedBlocks };
    setPage({ ...page, sections: updatedSections });

    setReordering(true);
    setError(null);

    try {
      // Only update the two blocks that changed positions
      const block1 = updatedBlocks[blockIndex];
      const block2 = updatedBlocks[blockIndex + 1];

      await Promise.all([
        apiCall(`/api/pages/${id}/sections/${sectionId}/blocks/${block1.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: block1.order }),
        }),
        apiCall(`/api/pages/${id}/sections/${sectionId}/blocks/${block2.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: block2.order }),
        }),
      ]);
    } catch (error) {
      console.error("Error reordering blocks:", error);
      setError("Failed to reorder blocks. Please refresh the page.");
      // Revert optimistic update on error
      fetchPage();
    } finally {
      setReordering(false);
    }
  };

  const moveSectionUp = async (sectionIndex: number) => {
    if (!page || sectionIndex === 0 || reordering) return;

    // Optimistic update - update UI immediately
    const sections = [...page.sections];
    [sections[sectionIndex], sections[sectionIndex - 1]] = [
      sections[sectionIndex - 1],
      sections[sectionIndex],
    ];
    sections.forEach((section, index) => {
      section.order = index;
    });
    setPage({ ...page, sections });

    setReordering(true);
    setError(null);

    try {
      // Only update the two sections that changed positions
      const section1 = sections[sectionIndex];
      const section2 = sections[sectionIndex - 1];

      await Promise.all([
        apiCall(`/api/pages/${id}/sections/${section1.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: section1.order }),
        }),
        apiCall(`/api/pages/${id}/sections/${section2.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: section2.order }),
        }),
      ]);
    } catch (error) {
      console.error("Error reordering sections:", error);
      setError("Failed to reorder sections. Please refresh the page.");
      // Revert optimistic update on error
      fetchPage();
    } finally {
      setReordering(false);
    }
  };

  const moveSectionDown = async (sectionIndex: number) => {
    if (!page || sectionIndex === page.sections.length - 1 || reordering) return;

    // Optimistic update - update UI immediately
    const sections = [...page.sections];
    [sections[sectionIndex], sections[sectionIndex + 1]] = [
      sections[sectionIndex + 1],
      sections[sectionIndex],
    ];
    sections.forEach((section, index) => {
      section.order = index;
    });
    setPage({ ...page, sections });

    setReordering(true);
    setError(null);

    try {
      // Only update the two sections that changed positions
      const section1 = sections[sectionIndex];
      const section2 = sections[sectionIndex + 1];

      await Promise.all([
        apiCall(`/api/pages/${id}/sections/${section1.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: section1.order }),
        }),
        apiCall(`/api/pages/${id}/sections/${section2.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: section2.order }),
        }),
      ]);
    } catch (error) {
      console.error("Error reordering sections:", error);
      setError("Failed to reorder sections. Please refresh the page.");
      // Revert optimistic update on error
      fetchPage();
    } finally {
      setReordering(false);
    }
  };

  const insertTemplate = async (template: Template, sectionId: string) => {
    try {
      // Insert all blocks from the template
      for (const templateBlock of template.blocks) {
        await apiCall(`/api/pages/${id}/sections/${sectionId}/blocks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateBlock),
        });
      }
      fetchPage();
    } catch (error) {
      console.error("Error inserting template:", error);
      alert("Failed to insert template");
    }
  };

  if (loading || !page) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <Link href="/admin">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pages
        </Button>
      </Link>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-800">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Reordering Indicator */}
      {reordering && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">Reordering content...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Settings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Page Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={page.slug} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={page.description || ""}
                onChange={(e) =>
                  setPage({ ...page, description: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={page.published}
                onChange={(e) =>
                  setPage({ ...page, published: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="published" className="flex items-center gap-2">
                {page.published ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                Published
              </Label>
            </div>

            <Button onClick={updatePageMetadata} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Page Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Content</h2>
            <Button onClick={addSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          {page.sections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No sections yet</p>
                <Button onClick={addSection}>Add your first section</Button>
              </CardContent>
            </Card>
          ) : (
            page.sections.map((section, sectionIndex) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <div className="flex gap-2">
                      {sectionIndex > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSectionUp(sectionIndex)}
                          title="Move section up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                      )}
                      {sectionIndex < page.sections.length - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSectionDown(sectionIndex)}
                          title="Move section down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.blocks.map((block, blockIndex) => (
                    <BlockEditor
                      key={block.id}
                      block={block}
                      onUpdate={(data) =>
                        updateBlock(section.id, block.id, data)
                      }
                      onDelete={() => deleteBlock(section.id, block.id)}
                      onMoveUp={() => moveBlockUp(section.id, blockIndex)}
                      onMoveDown={() => moveBlockDown(section.id, blockIndex)}
                      isFirst={blockIndex === 0}
                      isLast={blockIndex === section.blocks.length - 1}
                    />
                  ))}

                  <div className="flex gap-2 flex-wrap pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(section.id, "text")}
                    >
                      + Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(section.id, "heading")}
                    >
                      + Heading
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(section.id, "image")}
                    >
                      + Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(section.id, "list")}
                    >
                      + List
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(section.id, "quote")}
                    >
                      + Quote
                    </Button>
                    <div className="border-l pl-2 ml-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setTemplateTargetSection(section.id);
                          setShowTemplateSelector(true);
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && templateTargetSection && (
        <TemplateSelector
          onSelect={(template) => {
            insertTemplate(template, templateTargetSection);
          }}
          onClose={() => {
            setShowTemplateSelector(false);
            setTemplateTargetSection(null);
          }}
        />
      )}
    </div>
  );
}
