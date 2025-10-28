import type { PageTemplate } from "@/types/templates";
import type { HeadingBlock, TextBlock, ActionBlock, ImageBlock, VideoBlock, ListBlock } from "@/types";

export const fullPageTemplates: PageTemplate[] = [
  // Complete Landing Page
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Complete landing page with hero, text+video, and pricing sections",
    category: "page",
    sections: [
      // Hero Section
      {
        title: "Hero",
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
      // Text + Video Section
      {
        title: "How It Works",
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
      // Pricing Section
      {
        title: "Pricing",
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
    ],
  },
];
