import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db";
import type { Block } from "@/types";

function renderBlock(block: Block) {
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
        <div key={block.id} className="my-8">
          {block.url && (
            <img
              src={block.url}
              alt={block.alt}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          )}
          {block.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {block.caption}
            </p>
          )}
        </div>
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

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

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
                    .map((block) => renderBlock(block))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}
