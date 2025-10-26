import type { Block, BlockType } from "./index";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "page" | "section" | "marketing" | "content";
  blocks: Omit<Block, "id" | "order">[];
  preview?: string; // URL to preview image
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
}
