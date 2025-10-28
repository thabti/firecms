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
      // Step 1: Save section order if needed
      await apiCall(`/api/pages/${pageId}/sections/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionIds: page.sections.map(s => s.id) }),
      });

      // Step 2: Build batch update payload
      const updates: any[] = [];
      const creates: any[] = [];

      for (const section of page.sections) {
        for (const block of section.blocks) {
          // Check if this is a new block (has temp ID)
          if (block.id.startsWith('temp-')) {
            // Create new block - remove temp ID and spread all properties
            const { id, ...blockWithoutId } = block;
            creates.push({
              sectionId: section.id,
              tempId: block.id,
              data: blockWithoutId,
            });
          } else {
            // Update existing block with its current section ID
            updates.push({
              blockId: block.id,
              sectionId: section.id,
              data: block,
            });
          }
        }
      }

      // Step 3: Send batch update request
      if (updates.length > 0 || creates.length > 0) {
        await apiCall(`/api/pages/${pageId}/batch-update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates, creates }),
        });
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
