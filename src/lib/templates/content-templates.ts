import type { Template } from "@/types/templates";

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
      },
      {
        type: "text",
        content: "Find answers to common questions about our product and services.",
      },
      {
        type: "heading",
        level: 3,
        content: "How do I get started?",
      },
      {
        type: "text",
        content:
          "Simply sign up for a free account and follow our quick start guide. You'll be up and running in minutes!",
      },
      {
        type: "heading",
        level: 3,
        content: "Can I cancel anytime?",
      },
      {
        type: "text",
        content:
          "Yes, you can cancel your subscription at any time. No long-term commitments or cancellation fees.",
      },
      {
        type: "heading",
        level: 3,
        content: "What payment methods do you accept?",
      },
      {
        type: "text",
        content:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and wire transfers for enterprise customers.",
      },
      {
        type: "heading",
        level: 3,
        content: "Do you offer customer support?",
      },
      {
        type: "text",
        content:
          "Yes! We offer email support for all customers, with chat and phone support available for Professional and Enterprise plans. Our support team is here to help you succeed.",
      },
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
      },
      {
        type: "text",
        content:
          "This is your introduction paragraph. Hook your readers with an engaging opening that sets the stage for what's to come.",
      },
      {
        type: "heading",
        level: 2,
        content: "Main Point 1",
      },
      {
        type: "text",
        content:
          "Expand on your first main point. Provide details, examples, and insights that support your argument or narrative.",
      },
      {
        type: "heading",
        level: 2,
        content: "Main Point 2",
      },
      {
        type: "text",
        content:
          "Continue with your second main point. Keep your content organized and easy to follow.",
      },
      {
        type: "heading",
        level: 2,
        content: "Key Takeaways",
      },
      {
        type: "list",
        items: [
          "First key takeaway from your post",
          "Second important point to remember",
          "Third actionable insight",
        ],
        ordered: true,
      },
      {
        type: "heading",
        level: 2,
        content: "Conclusion",
      },
      {
        type: "text",
        content:
          "Wrap up your post with a strong conclusion. Summarize your main points and provide a clear call-to-action or next steps for your readers.",
      },
    ],
  },
];
