import type { Block, BlockType, Section } from "./index";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "page" | "section" | "marketing" | "content";
  blocks: Omit<Block, "id" | "order">[];
  preview?: string; // URL to preview image
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: "page";
  sections: {
    title: string;
    blocks: Omit<Block, "id" | "order">[];
  }[];
  preview?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
}
