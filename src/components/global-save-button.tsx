"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { usePageEditorStore } from "@/store/page-editor-store";
import { apiCall } from "@/lib/api-client";

interface GlobalSaveButtonProps {
  pageId: string;
}

export function GlobalSaveButton({ pageId }: GlobalSaveButtonProps) {
  const { page, hasUnsavedChanges, markAsSaved } = usePageEditorStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!page || !hasUnsavedChanges) return;

    setSaving(true);
    try {
      // Save all blocks in all sections
      for (const section of page.sections) {
        for (const block of section.blocks) {
          // Check if this is a new block (has temp ID)
          if (block.id.startsWith('temp-')) {
            // Create new block - remove temp ID and spread all properties
            const { id, ...blockWithoutId } = block;
            await apiCall(`/api/pages/${pageId}/sections/${section.id}/blocks`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(blockWithoutId),
            });
          } else {
            // Update existing block - spread all properties
            await apiCall(`/api/pages/${pageId}/sections/${section.id}/blocks/${block.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(block),
            });
          }
        }
      }

      markAsSaved();

      // Reload the page to get proper IDs from server
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (!hasUnsavedChanges) return null;

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="fixed bottom-8 right-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all hover:shadow-xl hover:scale-105 z-50"
    >
      {saving ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-5 h-5" />
          Save Changes
        </>
      )}
    </button>
  );
}
