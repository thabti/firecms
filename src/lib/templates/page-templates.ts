import type { Template } from "@/types/templates";

export const pageTemplates: Template[] = [
  // About Us Template
  {
    id: "about-us",
    name: "About Us",
    description: "Complete about us section with hero, mission, and team introduction",
    category: "page",
    blocks: [
      {
        type: "heading",
        level: 1,
        content: "About Us",
      },
      {
        type: "text",
        content:
          "We are a passionate team dedicated to creating exceptional experiences for our customers. Our journey began with a simple idea: to make a positive impact in people's lives through innovative solutions.",
      },
      {
        type: "heading",
        level: 2,
        content: "Our Mission",
      },
      {
        type: "text",
        content:
          "Our mission is to empower individuals and businesses with cutting-edge technology that simplifies complex challenges. We believe in innovation, integrity, and putting our customers first in everything we do.",
      },
      {
        type: "heading",
        level: 2,
        content: "Our Values",
      },
      {
        type: "list",
        items: [
          "Innovation: We constantly push boundaries and explore new possibilities",
          "Integrity: We operate with transparency and honesty",
          "Excellence: We strive for the highest quality in all our work",
          "Collaboration: We believe in the power of teamwork",
          "Customer Focus: Your success is our success",
        ],
        ordered: false,
      },
      {
        type: "heading",
        level: 2,
        content: "Our Story",
      },
      {
        type: "text",
        content:
          "Founded in 2020, we started as a small team with big dreams. Today, we serve thousands of customers worldwide, helping them achieve their goals and transform their businesses. Our growth has been driven by our commitment to innovation and our unwavering focus on customer satisfaction.",
      },
    ],
  },

  // Contact Us Template
  {
    id: "contact-us",
    name: "Contact Us",
    description: "Contact page with multiple contact methods and information",
    category: "page",
    blocks: [
      {
        type: "heading",
        level: 1,
        content: "Get in Touch",
      },
      {
        type: "text",
        content:
          "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      },
      {
        type: "heading",
        level: 2,
        content: "Contact Information",
      },
      {
        type: "list",
        items: [
          "Email: hello@example.com",
          "Phone: +1 (555) 123-4567",
          "Address: 123 Main Street, City, State 12345",
          "Hours: Monday - Friday, 9:00 AM - 5:00 PM EST",
        ],
        ordered: false,
      },
      {
        type: "heading",
        level: 2,
        content: "Office Locations",
      },
      {
        type: "text",
        content:
          "We have offices around the world to better serve our global customer base. Our main headquarters is located in San Francisco, with additional offices in New York, London, and Tokyo.",
      },
      {
        type: "heading",
        level: 2,
        content: "Support",
      },
      {
        type: "text",
        content:
          "For technical support and customer service inquiries, please visit our help center or contact our support team directly at support@example.com. Our support team is available 24/7 to assist you.",
      },
    ],
  },

  // Pricing Template
  {
    id: "pricing",
    name: "Pricing",
    description: "Pricing page with tiers and feature comparison",
    category: "page",
    blocks: [
      {
        type: "heading",
        level: 1,
        content: "Simple, Transparent Pricing",
      },
      {
        type: "text",
        content:
          "Choose the plan that's right for you. All plans include our core features with no hidden fees.",
      },
      {
        type: "heading",
        level: 2,
        content: "Starter Plan - $29/month",
      },
      {
        type: "text",
        content: "Perfect for individuals and small teams getting started.",
      },
      {
        type: "list",
        items: [
          "Up to 5 users",
          "10 GB storage",
          "Basic analytics",
          "Email support",
          "Mobile app access",
        ],
        ordered: false,
      },
      {
        type: "heading",
        level: 2,
        content: "Professional Plan - $99/month",
      },
      {
        type: "text",
        content: "For growing teams that need more power and flexibility.",
      },
      {
        type: "list",
        items: [
          "Up to 20 users",
          "100 GB storage",
          "Advanced analytics",
          "Priority email & chat support",
          "API access",
          "Custom integrations",
          "Team collaboration tools",
        ],
        ordered: false,
      },
      {
        type: "heading",
        level: 2,
        content: "Enterprise Plan - Custom",
      },
      {
        type: "text",
        content:
          "For large organizations with specific needs and requirements.",
      },
      {
        type: "list",
        items: [
          "Unlimited users",
          "Unlimited storage",
          "Custom analytics & reporting",
          "24/7 phone, email & chat support",
          "Dedicated account manager",
          "Custom contracts & SLAs",
          "Advanced security features",
          "On-premise deployment options",
        ],
        ordered: false,
      },
      {
        type: "quote",
        content:
          "All plans come with a 30-day money-back guarantee. No questions asked.",
      },
    ],
  },
];
