import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

import { Header } from "@/components/header/header";
import { BackSection } from "@/components/ui/back-section";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: env.BLOG_NAME,
  description: env.BLOG_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={env.BLOG_THEME}
            disableTransitionOnChange
          >
            <Toaster />
            <Header />
            <BackSection />
            <main className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-2 p-4">
              {children}
            </main>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
