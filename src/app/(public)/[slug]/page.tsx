import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getStorageAdapter } from "@/lib/adapters";
import { OptimizedImage } from "@/components/optimized-image";
import type { Block } from "@/types";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

// Enable dynamic params
export const dynamicParams = true;

// Generate static params for published pages
export async function generateStaticParams() {
  try {
    const adapter = await getStorageAdapter();
    const pages = await adapter.getPages();

    return pages
      .filter((page) => page.published)
      .map((page) => ({
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

    if (!page || !page.published) {
      return {
        title: "Page Not Found",
      };
    }

    return {
      title: `${page.title} | FireCMS`,
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
      title: "FireCMS",
    };
  }
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "text":
      return (
        <div key={block.id} className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{block.content}</p>
        </div>
      );
    case "heading":
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
      const headingClasses = {
        1: "text-4xl font-bold",
        2: "text-3xl font-bold",
        3: "text-2xl font-semibold",
        4: "text-xl font-semibold",
        5: "text-lg font-semibold",
        6: "text-base font-semibold",
      };
      return (
        <HeadingTag
          key={block.id}
          className={`${headingClasses[block.level]} text-gray-900 mb-4`}
        >
          {block.content}
        </HeadingTag>
      );
    case "image":
      return (
        <OptimizedImage
          key={block.id}
          block={block}
          priority={index === 0} // Prioritize first image
        />
      );
    case "list":
      return (
        <div key={block.id} className="prose max-w-none">
          {block.ordered ? (
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          ) : (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "quote":
      return (
        <blockquote
          key={block.id}
          className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-blue-50 rounded-r"
        >
          <p className="text-lg italic text-gray-700">{block.content}</p>
          {block.author && (
            <footer className="text-sm text-gray-600 mt-2">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );
  }
}

async function PageContent({ slug }: { slug: string }) {
  const adapter = await getStorageAdapter();
  const page = await adapter.getPageBySlug(slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-xl text-gray-600">{page.description}</p>
          )}
        </header>

        <div className="space-y-16">
          {page.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <section key={section.id}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block, index) => renderBlock(block, index))}
                </div>
              </section>
            ))}
        </div>

        {/* Metadata footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Published: {new Date(page.createdAt).toLocaleDateString()}</span>
            <span>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
          </div>
        </footer>
      </div>
    </div>
  );
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
