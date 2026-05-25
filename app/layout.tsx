import { Outfit, Orbitron } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import type { Metadata } from "next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Brooks Anime | Next-Gen Anime Streaming",
    template: "%s | Brooks Anime",
  },
  description:
    "Immersive cinematic anime streaming. Trending shows, seasonal releases, and AI-powered recommendations.",
  keywords: ["anime", "streaming", "brooks anime", "watch anime", "hd anime"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${orbitron.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
