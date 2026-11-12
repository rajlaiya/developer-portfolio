import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raj Laiya | Full-Stack MERN & AI Developer for Hire in India",
  description:
    "Full-stack developer building SaaS web apps, CRMs, e-commerce stores and AI chatbots with Next.js, React and Node.js. 2.5+ years, 20+ projects delivered.",
  keywords: [
    "hire MERN stack developer India",
    "freelance full stack developer India",
    "hire Next.js developer",
    "freelance React developer for startups",
    "hire Node.js developer India",
    "AI full stack developer for hire",
    "custom SaaS development",
    "custom SaaS development services",
    "custom CRM development",
    "multi-tenant SaaS developer",
    "AI chatbot development",
    "chatbot development and designing",
    "e-commerce website development",
    "real estate listing portal development",
    "cloud kitchen and restaurant website development",
    "web app development for small business",
    "landing page designer and developer",
    "LP developer",
    "AI forward deployed engineer",
    "Web Helper",
    "Raj Laiya",
    "Raj Laiya full stack developer",
    "PeoplePerHour Raj Laiya",
    "freelancer Raj",
    "Raj freelancer",
    "Code with RL freelancer",
    "Raj Ervon",
    "Ervon Technology web app developer",
  ],
  authors: [{ name: "Raj Laiya" }],
  creator: "Raj Laiya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-900 flex flex-col">{children}</body>
    </html>
  );
}
