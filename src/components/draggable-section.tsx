"use client";

import { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { attachClosestEdge, extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { ReactNode } from "react";

interface DraggableSectionProps {
  sectionId: string;
  index: number;
  children: ReactNode;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
}

type DragState = "idle" | "dragging" | "over";

export function DraggableSection({ sectionId, index, children, onReorder }: DraggableSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>("idle");
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ sectionId, index, type: "section" }),
        onDragStart: () => setDragState("dragging"),
        onDrop: () => setDragState("idle"),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.type === "section" && source.data.sectionId !== sectionId;
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            { sectionId, index },
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

          const sourceIndex = source.data.index as number;
          const destinationIndex = index;

          if (sourceIndex === destinationIndex) return;

          // Calculate the actual destination index based on edge
          let finalDestination = destinationIndex;
          if (edge === "bottom") {
            finalDestination = sourceIndex < destinationIndex ? destinationIndex : destinationIndex + 1;
          } else if (edge === "top") {
            finalDestination = sourceIndex < destinationIndex ? destinationIndex - 1 : destinationIndex;
          }

          onReorder(sourceIndex, finalDestination);
        },
      })
    );
  }, [sectionId, index, onReorder]);

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: dragState === "dragging" ? 0.5 : 1,
      }}
    >
      {/* Drop indicator - top */}
      {closestEdge === "top" && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-10" />
      )}

      {children}

      {/* Drop indicator - bottom */}
      {closestEdge === "bottom" && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-10" />
      )}
    </div>
  );
}
