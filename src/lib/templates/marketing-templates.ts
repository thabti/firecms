import type { Template } from "@/types/templates";

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
      },
      {
        type: "text",
        content:
          "Discover the powerful tools and features that will help you grow faster, work smarter, and achieve more than you ever thought possible.",
      },
      {
        type: "text",
        content: "Get started today with our 14-day free trial. No credit card required.",
      },
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
      },
      {
        type: "text",
        content:
          "Everything you need to succeed, all in one place. No complexity, just results.",
      },
      {
        type: "heading",
        level: 3,
        content: "Easy to Use",
      },
      {
        type: "text",
        content:
          "Intuitive interface designed for users of all skill levels. Get up and running in minutes.",
      },
      {
        type: "heading",
        level: 3,
        content: "Powerful Analytics",
      },
      {
        type: "text",
        content:
          "Make data-driven decisions with comprehensive analytics and reporting tools.",
      },
      {
        type: "heading",
        level: 3,
        content: "Secure & Reliable",
      },
      {
        type: "text",
        content:
          "Enterprise-grade security with 99.9% uptime. Your data is always safe and accessible.",
      },
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
      },
      {
        type: "text",
        content:
          "Don't just take our word for it. Here's what real customers have to say about their experience.",
      },
      {
        type: "quote",
        content:
          "This product has completely transformed how we work. The team is more productive and our customers are happier. Highly recommended!",
        author: "Sarah Johnson, CEO at TechCorp",
      },
      {
        type: "quote",
        content:
          "The best investment we've made this year. The ROI was clear within the first month. Support is fantastic too!",
        author: "Michael Chen, Marketing Director",
      },
      {
        type: "quote",
        content:
          "Simple, powerful, and exactly what we needed. Setup was a breeze and the results speak for themselves.",
        author: "Emily Rodriguez, Product Manager",
      },
    ],
  },
];
