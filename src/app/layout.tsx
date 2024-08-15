import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

import { Footer } from "@/components/footer/footer";
import { Categories } from "@/components/header/categories";
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
  const theme = env.BLOG_THEME;
  return (
    <html
      lang="en"
      className={`${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex h-full min-h-dvh flex-col">
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={theme}
            disableTransitionOnChange
          >
            <Toaster />
            <Header />
            <Categories />
            <BackSection />
            <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-start gap-2 p-4">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
