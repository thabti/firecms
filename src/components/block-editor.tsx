"use client";

import { useState } from "react";
import { Trash2, Upload, Loader2, ChevronUp, ChevronDown, Link as LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Block } from "@/types";
import {
  compressImage,
  isValidImageType,
  formatFileSize,
} from "@/lib/image-utils";
import { unwrapAPIResponse } from "@/lib/api-client";

interface BlockEditorProps {
  block: Block;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: BlockEditorProps) {
  const [editData, setEditData] = useState<any>(block);
  const [uploading, setUploading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string>("");
  const [useImageUrl, setUseImageUrl] = useState(false);

  // Auto-save on change for text-based blocks
  const handleAutoSave = (data: any) => {
    setEditData(data);
    onUpdate(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidImageType(file)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    setUploading(true);
    setCompressionInfo("");

    try {
      // Show original file size
      const originalSize = file.size;
      setCompressionInfo(`Compressing ${formatFileSize(originalSize)}...`);

      // Compress image on client side
      const compressedFile = await compressImage(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2048,
      });

      const compressedSize = compressedFile.size;
      const savingsPercent = Math.round(
        ((originalSize - compressedSize) / originalSize) * 100
      );

      setCompressionInfo(
        `Compressed: ${formatFileSize(originalSize)} → ${formatFileSize(
          compressedSize
        )} (${savingsPercent}% smaller). Uploading...`
      );

      // Upload compressed image
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const responseData = await response.json();
      const data = unwrapAPIResponse<any>(responseData);

      // Update and save immediately
      const newData = {
        ...editData,
        url: data.url,
        urls: data.urls,
        dimensions: data.dimensions,
      };
      setEditData(newData);
      onUpdate(newData);

      setCompressionInfo(
        `✓ Uploaded successfully! Multiple sizes created.`
      );

      // Clear compression info after 3 seconds
      setTimeout(() => setCompressionInfo(""), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      setCompressionInfo("");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrlSave = () => {
    onUpdate(editData);
    setUseImageUrl(false);
  };

  const renderContent = () => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-gray-500">Text Block (Markdown supported)</Label>
            </div>
            <Textarea
              value={editData.content || ""}
              onChange={(e) =>
                handleAutoSave({ ...editData, content: e.target.value })
              }
              rows={6}
              placeholder="Enter your text here... Supports **bold**, *italic*, [links](url), etc."
              className="font-mono text-sm"
            />
            {editData.content && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <Label className="text-xs text-gray-500 mb-2 block">Preview:</Label>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {editData.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );

      case "heading":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Heading Text</Label>
              <Input
                value={editData.content || ""}
                onChange={(e) =>
                  handleAutoSave({ ...editData, content: e.target.value })
                }
                placeholder="Enter heading text..."
                className="text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select
                value={editData.level || 2}
                onChange={(e) =>
                  handleAutoSave({ ...editData, level: Number(e.target.value) })
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
            {editData.content && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <Label className="text-xs text-gray-500 mb-2 block">Preview:</Label>
                {(() => {
                  const HeadingTag = `h${editData.level || 2}` as keyof React.JSX.IntrinsicElements;
                  const sizes = {
                    1: "text-4xl",
                    2: "text-3xl",
                    3: "text-2xl",
                    4: "text-xl",
                    5: "text-lg",
                    6: "text-base",
                  };
                  return (
                    <HeadingTag className={`font-bold ${sizes[editData.level || 2]}`}>
                      {editData.content}
                    </HeadingTag>
                  );
                })()}
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image Source</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={!useImageUrl ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseImageUrl(false)}
                >
                  Upload File
                </Button>
                <Button
                  type="button"
                  variant={useImageUrl ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseImageUrl(true)}
                >
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Use URL
                </Button>
              </div>

              {useImageUrl ? (
                <div className="space-y-2">
                  <Input
                    type="url"
                    value={editData.url || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, url: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImageUrlSave}
                  >
                    Save URL
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="flex-1"
                  />
                  {uploading && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                </div>
              )}

              {compressionInfo && (
                <p className="text-sm text-blue-600">{compressionInfo}</p>
              )}
              {editData.url && (
                <div className="mt-2">
                  <img
                    src={editData.urls?.medium || editData.url}
                    alt="Preview"
                    className="max-w-xs h-auto rounded border"
                  />
                  {editData.dimensions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Original: {editData.dimensions.width} ×{" "}
                      {editData.dimensions.height}px
                    </p>
                  )}
                  {editData.urls && (
                    <div className="text-xs text-gray-500 mt-1">
                      Sizes available: thumbnail, medium, large, original
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={editData.alt || ""}
                onChange={(e) =>
                  handleAutoSave({ ...editData, alt: e.target.value })
                }
                placeholder="Describe the image for accessibility"
              />
            </div>
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input
                value={editData.caption || ""}
                onChange={(e) =>
                  handleAutoSave({ ...editData, caption: e.target.value })
                }
                placeholder="Optional caption text"
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
                  handleAutoSave({ ...editData, ordered: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label>Ordered List (1, 2, 3...)</Label>
            </div>
            <div className="space-y-2">
              <Label>List Items</Label>
              {(editData.items || []).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...editData.items];
                      newItems[index] = e.target.value;
                      handleAutoSave({ ...editData, items: newItems });
                    }}
                    placeholder={`Item ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = editData.items.filter(
                        (_: any, i: number) => i !== index
                      );
                      handleAutoSave({ ...editData, items: newItems });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  handleAutoSave({
                    ...editData,
                    items: [...(editData.items || []), ""],
                  })
                }
              >
                + Add Item
              </Button>
            </div>
            {editData.items && editData.items.length > 0 && editData.items[0] !== "" && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <Label className="text-xs text-gray-500 mb-2 block">Preview:</Label>
                <div className="prose prose-sm max-w-none">
                  {editData.ordered ? (
                    <ol className="list-decimal list-inside">
                      {editData.items.map((item: string, i: number) => (
                        item && <li key={i}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc list-inside">
                      {editData.items.map((item: string, i: number) => (
                        item && <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "quote":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quote Text</Label>
              <Textarea
                value={editData.content || ""}
                onChange={(e) =>
                  handleAutoSave({ ...editData, content: e.target.value })
                }
                rows={3}
                placeholder="Enter quote text..."
              />
            </div>
            <div className="space-y-2">
              <Label>Author (optional)</Label>
              <Input
                value={editData.author || ""}
                onChange={(e) =>
                  handleAutoSave({ ...editData, author: e.target.value })
                }
                placeholder="Quote author name"
              />
            </div>
            {editData.content && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <Label className="text-xs text-gray-500 mb-2 block">Preview:</Label>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
                  <p>{editData.content}</p>
                  {editData.author && (
                    <footer className="text-sm text-gray-600 mt-2">
                      — {editData.author}
                    </footer>
                  )}
                </blockquote>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600 uppercase flex items-center gap-2">
          {block.type}
          {(block.type === "text" || block.type === "heading" || block.type === "list" || block.type === "quote") && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Always Editable</span>
          )}
        </div>
        <div className="flex gap-2">
          {!isFirst && onMoveUp && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onMoveUp}
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
          {!isLast && onMoveDown && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onMoveDown}
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
