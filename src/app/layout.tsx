import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FireCMS - Modern Content Management System",
  description: "A modern CMS built with Next.js and Firebase",
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
