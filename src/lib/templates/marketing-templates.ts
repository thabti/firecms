import type { Template } from "@/types/templates";
import type { HeadingBlock, TextBlock, QuoteBlock } from "@/types";

export const marketingTemplates: Template[] = [
  // Hero Section Template
  {
    id: "hero-section",
    name: "Hero Section",
    description: "Eye-catching hero section with headline and CTA",
    category: "marketing",
    blocks: [
      {
        type: "heading",
        level: 1,
        content: "Transform Your Business Today",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Discover the powerful tools and features that will help you grow faster, work smarter, and achieve more than you ever thought possible.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "text",
        content: "Get started today with our 14-day free trial. No credit card required.",
      } as Omit<TextBlock, "id" | "order">,
    ],
  },

  // Features Overview Template
  {
    id: "features-overview",
    name: "Features Overview",
    description: "Showcase key product features",
    category: "marketing",
    blocks: [
      {
        type: "heading",
        level: 2,
        content: "Powerful Features Built for You",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Everything you need to succeed, all in one place. No complexity, just results.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "Easy to Use",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Intuitive interface designed for users of all skill levels. Get up and running in minutes.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "Powerful Analytics",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Make data-driven decisions with comprehensive analytics and reporting tools.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "Secure & Reliable",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Enterprise-grade security with 99.9% uptime. Your data is always safe and accessible.",
      } as Omit<TextBlock, "id" | "order">,
    ],
  },

  // Testimonials Template
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Customer testimonials and reviews",
    category: "marketing",
    blocks: [
      {
        type: "heading",
        level: 2,
        content: "What Our Customers Say",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Don't just take our word for it. Here's what real customers have to say about their experience.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "quote",
        content:
          "This product has completely transformed how we work. The team is more productive and our customers are happier. Highly recommended!",
        author: "Sarah Johnson, CEO at TechCorp",
      } as Omit<QuoteBlock, "id" | "order">,
      {
        type: "quote",
        content:
          "The best investment we've made this year. The ROI was clear within the first month. Support is fantastic too!",
        author: "Michael Chen, Marketing Director",
      } as Omit<QuoteBlock, "id" | "order">,
      {
        type: "quote",
        content:
          "Simple, powerful, and exactly what we needed. Setup was a breeze and the results speak for themselves.",
        author: "Emily Rodriguez, Product Manager",
      } as Omit<QuoteBlock, "id" | "order">,
    ],
  },
];
