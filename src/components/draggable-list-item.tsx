"use client";

import { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { attachClosestEdge, extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { GripVertical, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DraggableListItemProps {
  item: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
}

type DragState = "idle" | "dragging" | "over";

export function DraggableListItem({
  item,
  index,
  onUpdate,
  onRemove,
  onReorder
}: DraggableListItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>("idle");
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => ({ index, type: "list-item" }),
        onDragStart: () => setDragState("dragging"),
        onDrop: () => setDragState("idle"),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.type === "list-item" && source.data.index !== index;
        },
        getData: ({ input }) => {
          return attachClosestEdge({ index }, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: ({ self, source }) => {
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
        onDrop: ({ self, source }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(null);
          setDragState("idle");

          const sourceIndex = source.data.index as number;
          const targetIndex = index;

          if (sourceIndex === targetIndex) return;

          // Calculate destination based on edge
          let destinationIndex = targetIndex;
          if (edge === "bottom") {
            destinationIndex = sourceIndex < targetIndex ? targetIndex : targetIndex + 1;
          } else {
            destinationIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
          }

          onReorder(sourceIndex, destinationIndex);
        },
      })
    );
  }, [index, onReorder]);

  return (
    <div
      ref={ref}
      className={`relative flex gap-2 items-center transition-all ${
        dragState === "dragging" ? "opacity-50" : ""
      } ${dragState === "over" ? "scale-[1.02]" : ""}`}
    >
      {/* Drop indicator */}
      {closestEdge === "top" && (
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
      )}
      {closestEdge === "bottom" && (
        <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
      )}

      {/* Drag handle */}
      <div
        ref={dragHandleRef}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors p-1"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Input field */}
      <Input
        value={item}
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder={`Item ${index + 1}`}
        className="flex-1"
      />

      {/* Remove button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onRemove(index)}
        title="Remove item"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
