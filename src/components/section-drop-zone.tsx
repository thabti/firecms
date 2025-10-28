"use client";

import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface SectionDropZoneProps {
  sectionId: string;
  onDropBlock: (sourceSectionId: string, targetSectionId: string, blockId: string) => void;
  children: React.ReactNode;
}

export function SectionDropZone({ sectionId, onDropBlock, children }: SectionDropZoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => {
        // Can drop blocks from other sections
        return (
          source.data.type === "block" &&
          source.data.sectionId !== sectionId
        );
      },
      getData: () => ({ sectionId, type: "section-drop-zone" }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false);
        const sourceSectionId = source.data.sectionId as string;
        const blockId = source.data.blockId as string;
        onDropBlock(sourceSectionId, sectionId, blockId);
      },
    });
  }, [sectionId, onDropBlock]);

  return (
    <div
      ref={ref}
      className={`transition-all ${
        isDraggedOver
          ? "bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg"
          : ""
      }`}
    >
      {children}
    </div>
  );
}
