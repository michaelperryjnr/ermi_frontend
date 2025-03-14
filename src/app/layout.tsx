import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import UpcomingEvents from "@/components/upcoming-events";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eternal Redemption Ministry International",
  description: "Spreading the word of God and building a community of faith",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eternalredemption.org",
    title: "Eternal Redemption Ministry International",
    description: "Spreading the word of God and building a community of faith",
    siteName: "Eternal Redemption Ministry International",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal Redemption Ministry International",
    description: "Spreading the word of God and building a community of faith",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
              <UpcomingEvents />
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
