import { ThemeProvider } from "next-themes";
import { Sour_Gummy } from "next/font/google";
import Script from "next/script";

import { WikiHeader } from "@/components/wiki-header";
import { Toaster } from "@/components/ui/sonner";

import type { Metadata } from "next";

import "@/styles/globals.css";

const sourGummy = Sour_Gummy({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wiki",
  description: "Browse through our comprehensive knowledge base.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sourGummy.className}>
        <Script
          src="/stats/script.js"
          data-website-id="746201ec-fa02-4595-b007-9ae7bfdc6a6c"
          data-host-url="/stats"
          data-performance="true"
          strategy="afterInteractive"
        />
        <Script
          src="/stats/recorder.js"
          data-website-id="746201ec-fa02-4595-b007-9ae7bfdc6a6c"
          data-host-url="/stats"
          data-sample-rate="1"
          data-mask-level="moderate"
          data-max-duration="300000"
          strategy="afterInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WikiHeader />
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
