import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduTools — Your everyday digital toolkit",
  description: "Ten thoughtfully built tools for websites, business and media. Audit, create, capture and optimise in one workspace.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
