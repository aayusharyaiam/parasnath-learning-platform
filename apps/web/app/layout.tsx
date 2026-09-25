import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SkipToContent } from "@/components/skip-to-content";
import { CookieBanner } from "@/components/cookie-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#165b46",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Parasnath Learning | Digital School Education for Classes 9 & 10",
    template: "%s | Parasnath Learning",
  },
  description:
    "NCERT-aligned digital learning and assessment platform for Classes 9 & 10. Learn topics, practice competency MCQs, upload written notebook scans, get AI mind-maps, and track improvement.",
  keywords: [
    "Parasnath Learning",
    "NCERT Class 9",
    "NCERT Class 10",
    "CBSE Class 10 Social Science",
    "Competency Based Questions",
    "School Learning App",
    "Written Answer Verification",
    "Teacher Question Paper Generator",
  ],
  authors: [{ name: "Parasnath Learning Platform" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Parasnath Learning | Digital School Education",
    description:
      "NCERT-aligned digital learning for Classes 9 & 10. Learn, practice, test, write, evaluate, and revise.",
    url: "https://parasnathlearning.org",
    siteName: "Parasnath Learning",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brand-light selection:text-brand-dark">
        <SkipToContent />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
