import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getStorageAdapter } from "@/lib/adapters";
import { PageRenderer } from "@/components/page-renderer";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

// Enable dynamic params
export const dynamicParams = true;

// Generate static params for all pages
export async function generateStaticParams() {
  try {
    const adapter = await getStorageAdapter();
    const pages = await adapter.getPages();

    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const adapter = await getStorageAdapter();
    const page = await adapter.getPageBySlug(slug);

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    return {
      title: `${page.title} | ThabtiCMS`,
      description: page.description || `Read about ${page.title}`,
      openGraph: {
        title: page.title,
        description: page.description || undefined,
        type: "article",
        publishedTime: page.createdAt.toISOString(),
        modifiedTime: page.updatedAt.toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: page.title,
        description: page.description || undefined,
      },
      alternates: {
        canonical: `/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "ThabtiCMS",
    };
  }
}

async function PageContent({ slug }: { slug: string }) {
  const adapter = await getStorageAdapter();
  const page = await adapter.getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <PageRenderer page={page} showMetadata={true} />;
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent slug={slug} />
    </Suspense>
  );
}
