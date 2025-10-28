"use client";

import { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { attachClosestEdge, extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { ReactNode } from "react";

interface DraggableBlockProps {
  blockId: string;
  sectionId: string;
  index: number;
  children: ReactNode;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onMoveToSection?: (sourceSectionId: string, targetSectionId: string, blockId: string, targetIndex: number) => void;
}

type DragState = "idle" | "dragging" | "over";

export function DraggableBlock({ blockId, sectionId, index, children, onReorder, onMoveToSection }: DraggableBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>("idle");
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ blockId, sectionId, index, type: "block" }),
        onDragStart: () => setDragState("dragging"),
        onDrop: () => setDragState("idle"),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          // Can drop blocks from any section (if onMoveToSection is provided) or same section
          return (
            source.data.type === "block" &&
            source.data.blockId !== blockId
          );
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            { blockId, sectionId, index },
            {
              element,
              input,
              allowedEdges: ["top", "bottom"],
            }
          );
        },
        onDragEnter: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
          setDragState("over");
        },
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => {
          setClosestEdge(null);
          setDragState("idle");
        },
        onDrop: ({ source, self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(null);
          setDragState("idle");

          const sourceSectionId = source.data.sectionId as string;
          const sourceBlockId = source.data.blockId as string;
          const sourceIndex = source.data.index as number;
          const destinationIndex = index;

          // Check if moving to a different section
          if (sourceSectionId !== sectionId && onMoveToSection) {
            // Cross-section move
            let finalDestination = destinationIndex;
            if (edge === "bottom") {
              finalDestination = destinationIndex + 1;
            }
            onMoveToSection(sourceSectionId, sectionId, sourceBlockId, finalDestination);
          } else if (sourceSectionId === sectionId) {
            // Same section reorder
            if (sourceIndex === destinationIndex) return;

            // Calculate the actual destination index based on edge
            let finalDestination = destinationIndex;
            if (edge === "bottom") {
              finalDestination = sourceIndex < destinationIndex ? destinationIndex : destinationIndex + 1;
            } else if (edge === "top") {
              finalDestination = sourceIndex < destinationIndex ? destinationIndex - 1 : destinationIndex;
            }

            onReorder(sourceIndex, finalDestination);
          }
        },
      })
    );
  }, [blockId, sectionId, index, onReorder, onMoveToSection]);

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: dragState === "dragging" ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {/* Drop indicator - top */}
      {closestEdge === "top" && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
      )}

      {children}

      {/* Drop indicator - bottom */}
      {closestEdge === "bottom" && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
      )}
    </div>
  );
}
