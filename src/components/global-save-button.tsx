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
      // Prepare batch operations
      const updates: any[] = [];
      const creates: any[] = [];

      for (const section of page.sections) {
        for (const block of section.blocks) {
          // Check if this is a new block (has temp ID)
          if (block.id.startsWith('temp-')) {
            // Create new block
            const { id, ...blockWithoutId } = block;
            creates.push({
              sectionId: section.id,
              tempId: id,
              data: blockWithoutId,
            });
          } else {
            // Update existing block
            updates.push({
              blockId: block.id,
              sectionId: section.id,
              data: block,
            });
          }
        }
      }

      // Make single batch API call instead of N individual calls
      const response = await apiCall(`/api/pages/${pageId}/batch-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates, creates }),
      });

      console.log("Batch save completed:", response);

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
  );
}
