import type { Template, PageTemplate } from "@/types/templates";
import { pageTemplates } from "./page-templates";
import { marketingTemplates } from "./marketing-templates";
import { contentTemplates } from "./content-templates";
import { fullPageTemplates } from "./full-page-templates";

export const templates: Template[] = [
  ...pageTemplates,
  ...marketingTemplates,
  ...contentTemplates,
];

export { fullPageTemplates };

export const templateCategories = [
  {
    id: "page",
    name: "Full Pages",
    description: "Complete page templates",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Marketing and sales sections",
  },
  {
    id: "content",
    name: "Content",
    description: "Content-focused sections",
  },
];

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getPageTemplateById(id: string): PageTemplate | undefined {
  return fullPageTemplates.find((t) => t.id === id);
}
