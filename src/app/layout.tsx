import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThabtiCMS - Modern Content Management System",
  description: "A powerful and beautiful CMS built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
