export type BlockType = "text" | "image" | "heading" | "list" | "quote" | "action" | "video";

export interface TextBlock {
  id: string;
  type: "text";
  content: string;
  order: number;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  urls?: {
    original?: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
  alt: string;
  caption?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
  order: number;
}

export interface HeadingBlock {
  id: string;
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
  order: number;
}

export interface ListBlock {
  id: string;
  type: "list";
  items: string[];
  ordered: boolean;
  order: number;
}

export interface QuoteBlock {
  id: string;
  type: "quote";
  content: string;
  author?: string;
  order: number;
}

export interface ActionBlock {
  id: string;
  type: "action";
  actionType: "button" | "link";
  label: string;
  url: string;
  style?: "primary" | "secondary" | "outline";
  openInNewTab?: boolean;
  order: number;
}

export interface VideoBlock {
  id: string;
  type: "video";
  url: string; // YouTube URL
  caption?: string;
  order: number;
}

export type Block = TextBlock | ImageBlock | HeadingBlock | ListBlock | QuoteBlock | ActionBlock | VideoBlock;

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sections: Section[];
  live: boolean; // Whether the page is live and publicly accessible
  version: number; // Version number for optimistic locking
  createdAt: Date;
  updatedAt: Date;
}

// API Response wrapper with metadata
export interface APIResponse<T> {
  data: T;
  meta: {
    version: string; // API version (e.g., "v1")
    timestamp: string; // ISO 8601 timestamp
    requestId?: string; // Optional request ID for tracking
  };
}

// Paginated API Response
export interface PaginatedAPIResponse<T> extends APIResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface CreatePageInput {
  slug: string;
  title: string;
  description?: string;
  live?: boolean;
}

export interface UpdatePageInput {
  title?: string;
  description?: string;
  live?: boolean;
}

export interface CreateSectionInput {
  pageId: string;
  title: string;
  order?: number;
}

export interface UpdateSectionInput {
  title?: string;
  order?: number;
}

export interface CreateBlockInput {
  pageId: string;
  sectionId: string;
  type: BlockType;
  // Text & Heading
  content?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  // Image & Video
  url?: string;
  urls?: {
    original?: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
  alt?: string;
  caption?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
  // List
  items?: string[];
  ordered?: boolean;
  // Quote
  author?: string;
  // Action
  actionType?: "button" | "link";
  label?: string;
  style?: "primary" | "secondary" | "outline";
  openInNewTab?: boolean;
  // General
  order?: number;
}

export interface UpdateBlockInput {
  // Text & Heading
  content?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  // Image & Video
  url?: string;
  urls?: {
    original?: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
  alt?: string;
  caption?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
  // List
  items?: string[];
  ordered?: boolean;
  // Quote
  author?: string;
  // Action
  actionType?: "button" | "link";
  label?: string;
  style?: "primary" | "secondary" | "outline";
  openInNewTab?: boolean;
  // General
  order?: number;
}
