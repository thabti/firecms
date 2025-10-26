"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { templates, templateCategories } from "@/lib/templates";
import type { Template } from "@/types/templates";

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("page");

  const filteredTemplates = templates.filter(
    (t) => t.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Insert Template</CardTitle>
              <CardDescription>
                Choose a pre-built template to quickly add content
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {templateCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  selectedCategory === category.id
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    {template.blocks.length} block{template.blocks.length !== 1 ? "s" : ""}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.blocks.slice(0, 5).map((block, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {block.type}
                      </span>
                    ))}
                    {template.blocks.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{template.blocks.length - 5} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No templates in this category yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
