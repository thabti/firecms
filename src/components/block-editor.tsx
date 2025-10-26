"use client";

import { useState } from "react";
import { Trash2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Block } from "@/types";

interface BlockEditorProps {
  block: Block;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

export function BlockEditor({ block, onUpdate, onDelete }: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(block);
  const [uploading, setUploading] = useState(false);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setEditData({ ...editData, url: data.url });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const renderPreview = () => {
    switch (block.type) {
      case "text":
        return (
          <div className="prose max-w-none">
            <p>{block.content}</p>
          </div>
        );
      case "heading":
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return (
          <div className="prose max-w-none">
            <HeadingTag className="font-bold">{block.content}</HeadingTag>
          </div>
        );
      case "image":
        return (
          <div>
            {block.url ? (
              <img
                src={block.url}
                alt={block.alt}
                className="max-w-full h-auto rounded"
              />
            ) : (
              <div className="bg-gray-100 h-48 flex items-center justify-center rounded">
                <p className="text-gray-500">No image uploaded</p>
              </div>
            )}
            {block.caption && (
              <p className="text-sm text-gray-600 mt-2">{block.caption}</p>
            )}
          </div>
        );
      case "list":
        return (
          <div className="prose max-w-none">
            {block.ordered ? (
              <ol className="list-decimal list-inside">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc list-inside">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      case "quote":
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic">
            <p>{block.content}</p>
            {block.author && (
              <footer className="text-sm text-gray-600 mt-2">
                — {block.author}
              </footer>
            )}
          </blockquote>
        );
    }
  };

  const renderEditor = () => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={editData.content || ""}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
              rows={4}
            />
          </div>
        );
      case "heading":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Input
                value={editData.content || ""}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select
                value={editData.level || 2}
                onChange={(e) =>
                  setEditData({ ...editData, level: Number(e.target.value) })
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm">Uploading...</span>}
              </div>
              {editData.url && (
                <img
                  src={editData.url}
                  alt="Preview"
                  className="max-w-xs h-auto rounded mt-2"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={editData.alt || ""}
                onChange={(e) =>
                  setEditData({ ...editData, alt: e.target.value })
                }
                placeholder="Describe the image"
              />
            </div>
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input
                value={editData.caption || ""}
                onChange={(e) =>
                  setEditData({ ...editData, caption: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editData.ordered || false}
                onChange={(e) =>
                  setEditData({ ...editData, ordered: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label>Ordered List</Label>
            </div>
            <div className="space-y-2">
              <Label>Items</Label>
              {(editData.items || []).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...editData.items];
                      newItems[index] = e.target.value;
                      setEditData({ ...editData, items: newItems });
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = editData.items.filter(
                        (_: any, i: number) => i !== index
                      );
                      setEditData({ ...editData, items: newItems });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setEditData({
                    ...editData,
                    items: [...(editData.items || []), ""],
                  })
                }
              >
                Add Item
              </Button>
            </div>
          </div>
        );
      case "quote":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quote</Label>
              <Textarea
                value={editData.content || ""}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Author (optional)</Label>
              <Input
                value={editData.author || ""}
                onChange={(e) =>
                  setEditData({ ...editData, author: e.target.value })
                }
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600 uppercase">
          {block.type}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditData(block);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? renderEditor() : renderPreview()}
    </div>
  );
}
