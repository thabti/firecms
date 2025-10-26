import type { Template } from "@/types/templates";
import type { HeadingBlock, TextBlock, ListBlock } from "@/types";

export const contentTemplates: Template[] = [
  // FAQ Template
  {
    id: "faq",
    name: "FAQ Section",
    description: "Frequently asked questions",
    category: "content",
    blocks: [
      {
        type: "heading",
        level: 2,
        content: "Frequently Asked Questions",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content: "Find answers to common questions about our product and services.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "How do I get started?",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Simply sign up for a free account and follow our quick start guide. You'll be up and running in minutes!",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "Can I cancel anytime?",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Yes, you can cancel your subscription at any time. No long-term commitments or cancellation fees.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "What payment methods do you accept?",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and wire transfers for enterprise customers.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 3,
        content: "Do you offer customer support?",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Yes! We offer email support for all customers, with chat and phone support available for Professional and Enterprise plans. Our support team is here to help you succeed.",
      } as Omit<TextBlock, "id" | "order">,
    ],
  },

  // Blog Post Template
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Standard blog post structure",
    category: "content",
    blocks: [
      {
        type: "heading",
        level: 1,
        content: "Your Blog Post Title",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "This is your introduction paragraph. Hook your readers with an engaging opening that sets the stage for what's to come.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 2,
        content: "Main Point 1",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Expand on your first main point. Provide details, examples, and insights that support your argument or narrative.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 2,
        content: "Main Point 2",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Continue with your second main point. Keep your content organized and easy to follow.",
      } as Omit<TextBlock, "id" | "order">,
      {
        type: "heading",
        level: 2,
        content: "Key Takeaways",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "list",
        items: [
          "First key takeaway from your post",
          "Second important point to remember",
          "Third actionable insight",
        ],
        ordered: true,
      } as Omit<ListBlock, "id" | "order">,
      {
        type: "heading",
        level: 2,
        content: "Conclusion",
      } as Omit<HeadingBlock, "id" | "order">,
      {
        type: "text",
        content:
          "Wrap up your post with a strong conclusion. Summarize your main points and provide a clear call-to-action or next steps for your readers.",
      } as Omit<TextBlock, "id" | "order">,
    ],
  },
];
