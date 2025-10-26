import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Page,
  Section,
  Block,
  CreatePageInput,
  UpdatePageInput,
  CreateSectionInput,
  UpdateSectionInput,
  CreateBlockInput,
  UpdateBlockInput,
} from "@/types";

// Collections
const PAGES_COLLECTION = "pages";

// Helper to convert Firestore timestamps to Date objects
function convertTimestamps(data: any) {
  const result = { ...data };
  if (result.createdAt instanceof Timestamp) {
    result.createdAt = result.createdAt.toDate();
  }
  if (result.updatedAt instanceof Timestamp) {
    result.updatedAt = result.updatedAt.toDate();
  }
  if (result.sections) {
    result.sections = result.sections.map((section: any) => ({
      ...section,
      createdAt: section.createdAt instanceof Timestamp ? section.createdAt.toDate() : section.createdAt,
      updatedAt: section.updatedAt instanceof Timestamp ? section.updatedAt.toDate() : section.updatedAt,
    }));
  }
  return result;
}

// Pages
export async function getPages(): Promise<Page[]> {
  const pagesRef = collection(db, PAGES_COLLECTION);
  const q = query(pagesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Page[];
}

export async function getPage(id: string): Promise<Page | null> {
  const docRef = doc(db, PAGES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const pagesRef = collection(db, PAGES_COLLECTION);
  const q = query(pagesRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Page;
}

export async function createPage(data: CreatePageInput): Promise<Page> {
  const now = new Date();
  const pageData = {
    ...data,
    sections: [],
    published: data.published ?? false,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(collection(db, PAGES_COLLECTION), pageData);
  return {
    id: docRef.id,
    ...pageData,
  } as Page;
}

export async function updatePage(
  id: string,
  data: UpdatePageInput
): Promise<void> {
  const docRef = doc(db, PAGES_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deletePage(id: string): Promise<void> {
  const docRef = doc(db, PAGES_COLLECTION, id);
  await deleteDoc(docRef);
}

// Sections
export async function createSection(
  data: CreateSectionInput
): Promise<Section> {
  const { pageId, ...sectionData } = data;
  const page = await getPage(pageId);
  if (!page) throw new Error("Page not found");

  const now = new Date();
  const newSection: Section = {
    id: crypto.randomUUID(),
    title: sectionData.title,
    blocks: [],
    order: data.order ?? page.sections.length,
    createdAt: now,
    updatedAt: now,
  };

  const updatedSections = [...page.sections, newSection];
  await updatePage(pageId, { ...page, sections: updatedSections } as any);

  return newSection;
}

export async function updateSection(
  pageId: string,
  sectionId: string,
  data: UpdateSectionInput
): Promise<void> {
  const page = await getPage(pageId);
  if (!page) throw new Error("Page not found");

  const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) throw new Error("Section not found");

  const updatedSections = [...page.sections];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    ...data,
    updatedAt: new Date(),
  };

  await updatePage(pageId, { ...page, sections: updatedSections } as any);
}

export async function deleteSection(
  pageId: string,
  sectionId: string
): Promise<void> {
  const page = await getPage(pageId);
  if (!page) throw new Error("Page not found");

  const updatedSections = page.sections.filter((s) => s.id !== sectionId);
  await updatePage(pageId, { ...page, sections: updatedSections } as any);
}

// Blocks
export async function createBlock(data: CreateBlockInput): Promise<Block> {
  const { pageId, sectionId, ...blockData } = data;
  const page = await getPage(pageId);
  if (!page) throw new Error("Page not found");

  const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) throw new Error("Section not found");

  const section = page.sections[sectionIndex];
  const newBlock: Block = {
    id: crypto.randomUUID(),
    type: blockData.type,
    order: blockData.order ?? section.blocks.length,
    ...blockData,
  } as Block;

  const updatedSections = [...page.sections];
  updatedSections[sectionIndex] = {
    ...section,
    blocks: [...section.blocks, newBlock],
    updatedAt: new Date(),
  };

  await updatePage(pageId, { ...page, sections: updatedSections } as any);

  return newBlock;
}

export async function updateBlock(
  pageId: string,
  sectionId: string,
  blockId: string,
  data: UpdateBlockInput
): Promise<void> {
  const page = await getPage(pageId);
  if (!page) throw new Error("Page not found");

  const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) throw new Error("Section not found");

  const section = page.sections[sectionIndex];
  const blockIndex = section.blocks.findIndex((b) => b.id === blockId);
  if (blockIndex === -1) throw new Error("Block not found");

  const updatedSections = [...page.sections];
  const updatedBlocks = [...section.blocks];
  updatedBlocks[blockIndex] = {
    ...updatedBlocks[blockIndex],
    ...data,
  };

  updatedSections[sectionIndex] = {
    ...section,
    blocks: updatedBlocks,
    updatedAt: new Date(),
  };

  await updatePage(pageId, { ...page, sections: updatedSections } as any);
}

export async function deleteBlock(
  pageId: string,
  sectionId: string,
  blockId: string
): Promise<void> {
  const page = await getPage(pageId);
  if (!page) throw new Error("Page not found");

  const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) throw new Error("Section not found");

  const section = page.sections[sectionIndex];
  const updatedBlocks = section.blocks.filter((b) => b.id !== blockId);

  const updatedSections = [...page.sections];
  updatedSections[sectionIndex] = {
    ...section,
    blocks: updatedBlocks,
    updatedAt: new Date(),
  };

  await updatePage(pageId, { ...page, sections: updatedSections } as any);
}
