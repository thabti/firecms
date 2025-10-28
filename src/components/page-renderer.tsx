"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OptimizedImage } from "@/components/optimized-image";
import type { Block, Page } from "@/types";

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "text":
      return (
        <div key={block.id} data-block-cms-id={block.id} data-block-type="text" className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-gray-700 leading-relaxed">
            {block.content}
          </ReactMarkdown>
        </div>
      );
    case "heading":
      const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
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
          data-block-cms-id={block.id}
          data-block-type="heading"
          className={`${headingClasses[block.level]} text-gray-900 mb-4`}
        >
          {block.content}
        </HeadingTag>
      );
    case "image":
      return (
        <div key={block.id} data-block-cms-id={block.id} data-block-type="image">
          <OptimizedImage
            block={block}
            priority={index === 0}
          />
        </div>
      );
    case "list":
      return (
        <div key={block.id} data-block-cms-id={block.id} data-block-type="list" className="prose max-w-none">
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
          data-block-cms-id={block.id}
          data-block-type="quote"
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
    case "action":
      const styleClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
      };
      const actionClass = styleClasses[block.style || "primary"];

      if (block.actionType === "button") {
        return (
          <div key={block.id} data-block-cms-id={block.id} data-block-type="action" className="my-6">
            <a
              href={block.url}
              target={block.openInNewTab ? "_blank" : undefined}
              rel={block.openInNewTab ? "noopener noreferrer" : undefined}
              className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${actionClass}`}
            >
              {block.label}
            </a>
          </div>
        );
      } else {
        return (
          <div key={block.id} data-block-cms-id={block.id} data-block-type="action" className="my-6">
            <a
              href={block.url}
              target={block.openInNewTab ? "_blank" : undefined}
              rel={block.openInNewTab ? "noopener noreferrer" : undefined}
              className="text-blue-600 hover:underline font-semibold text-lg"
            >
              {block.label} →
            </a>
          </div>
        );
      }
    case "video":
      // Extract YouTube video ID from URL
      const getYouTubeId = (url: string) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[7].length === 11 ? match[7] : null;
      };
      const videoId = getYouTubeId(block.url);

      if (!videoId) {
        return (
          <div key={block.id} data-block-cms-id={block.id} data-block-type="video" className="my-8 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">Invalid YouTube URL</p>
          </div>
        );
      }

      return (
        <div key={block.id} data-block-cms-id={block.id} data-block-type="video" className="my-8">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={block.caption || "YouTube video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
          {block.caption && (
            <p className="text-sm text-gray-600 mt-3 text-center italic">{block.caption}</p>
          )}
        </div>
      );
  }
}

interface PageRendererProps {
  page: Page;
  showMetadata?: boolean;
}

export function PageRenderer({ page, showMetadata = true }: PageRendererProps) {
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
              <section key={section.id} data-section-cms-id={section.id}>
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

        {showMetadata && (
          <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Published: {new Date(page.createdAt).toLocaleDateString()}</span>
              <span>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
