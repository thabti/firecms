import type { Template } from "@/types/templates";

export const templates: Template[] = [
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

export const templateCategories = [
  {
    id: "page",
    name: "Full Pages",
    description: "Complete page templates",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Marketing and sales sections",
  },
  {
    id: "content",
    name: "Content",
    description: "Content-focused sections",
  },
];

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
