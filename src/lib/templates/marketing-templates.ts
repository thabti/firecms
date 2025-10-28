import type { Template } from "@/types/templates";
import type { HeadingBlock, TextBlock, QuoteBlock, ActionBlock, ImageBlock, VideoBlock, ListBlock } from "@/types";

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

  // Landing Page Hero Section
  {
    id: "landing-hero",
    name: "Landing Page Hero",
    description: "Complete hero section with heading, text, action button, and image",
    category: "marketing",
    blocks: [
      {
        type: "heading",
        level: 1,
        content: "Build Amazing Products Faster",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "The all-in-one platform that helps teams collaborate, build, and ship products 10x faster. Join thousands of companies already transforming their workflow.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "action",
        actionType: "button",
        label: "Get Started Free",
        url: "/signup",
        style: "primary",
        openInNewTab: false,
      } as Omit<ActionBlock, "id" | "order">,
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
        alt: "Team collaboration illustration",
        caption: "Trusted by leading companies worldwide",
      } as Omit<ImageBlock, "id" | "order">,
    ],
  },

  // Landing Page Text + Video Section
  {
    id: "landing-text-video",
    name: "Text + Video Section",
    description: "Engaging section with heading, text, and embedded video",
    category: "marketing",
    blocks: [
      {
        type: "heading",
        level: 2,
        content: "See How It Works",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Watch this 2-minute demo to discover how our platform can transform your workflow. No fluff, just real results.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Product demo and walkthrough",
      } as Omit<VideoBlock, "id" | "order">,
    ],
  },

  // Landing Page Pricing Section
  {
    id: "landing-pricing",
    name: "Pricing Plans",
    description: "Three-tier pricing section with features and CTAs",
    category: "marketing",
    blocks: [
      {
        type: "heading",
        level: 2,
        content: "Simple, Transparent Pricing",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Choose the perfect plan for your needs. All plans include a 14-day free trial with full access to features.",
      } as Omit<TextBlock, "id" | "order">,

      // Starter Plan
      {
        type: "heading",
        level: 3,
        content: "Starter - $29/month",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content: "Perfect for individuals and small teams just getting started.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "list",
        items: [
          "Up to 5 team members",
          "10 GB storage",
          "Basic analytics",
          "Email support",
          "30-day history"
        ],
        ordered: false,
      } as Omit<ListBlock, "id" | "order">,
      {
        type: "action",
        actionType: "button",
        label: "Start Free Trial",
        url: "/signup?plan=starter",
        style: "outline",
        openInNewTab: false,
      } as Omit<ActionBlock, "id" | "order">,

      // Professional Plan
      {
        type: "heading",
        level: 3,
        content: "Professional - $79/month",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content: "Most popular plan for growing teams and businesses.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "list",
        items: [
          "Up to 20 team members",
          "100 GB storage",
          "Advanced analytics",
          "Priority support",
          "Unlimited history",
          "Custom integrations"
        ],
        ordered: false,
      } as Omit<ListBlock, "id" | "order">,
      {
        type: "action",
        actionType: "button",
        label: "Start Free Trial",
        url: "/signup?plan=professional",
        style: "primary",
        openInNewTab: false,
      } as Omit<ActionBlock, "id" | "order">,

      // Enterprise Plan
      {
        type: "heading",
        level: 3,
        content: "Enterprise - Custom Pricing",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content: "For large organizations with advanced needs and compliance requirements.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "list",
        items: [
          "Unlimited team members",
          "Unlimited storage",
          "Custom analytics",
          "24/7 dedicated support",
          "Advanced security",
          "SLA guarantee",
          "On-premise option"
        ],
        ordered: false,
      } as Omit<ListBlock, "id" | "order">,
      {
        type: "action",
        actionType: "button",
        label: "Contact Sales",
        url: "/contact-sales",
        style: "secondary",
        openInNewTab: false,
      } as Omit<ActionBlock, "id" | "order">,
    ],
  },
];
