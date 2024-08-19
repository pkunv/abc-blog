import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

import { Footer } from "@/components/footer/footer";
import { CategoriesHeader } from "@/components/header/categories";
import { CategoriesSidebar } from "@/components/header/categories-sidebar";
import { Header } from "@/components/header/header";
import { BackSection } from "@/components/ui/back-section";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: env.BLOG_NAME,
  description: env.BLOG_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await api.post.getCategories();

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
            <div className="max-w-screen grid h-screen grid-cols-4">
              <div className="hidden sm:block"></div>
              <div className="col-span-full grid h-screen grid-cols-subgrid overflow-x-hidden overflow-y-scroll sm:col-span-3">
                <div className="col-span-full col-start-1 flex h-fit min-h-screen w-full flex-col items-center justify-start justify-self-center overflow-hidden sm:col-span-2">
                  <Header />
                  <CategoriesHeader
                    links={categories.map((category) => {
                      return { title: category.category, href: category.href };
                    })}
                  />
                  <BackSection />
                  <main className="mx-auto flex w-full flex-1 flex-col items-center justify-start gap-2 p-4">
                    {children}
                  </main>
                  <Footer />
                </div>
                <CategoriesSidebar categories={categories} />
              </div>
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
