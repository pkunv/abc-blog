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
import { blogProps } from "@/lib/getBlogProps";
import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXTAUTH_URL),
  title: env.BLOG_NAME,
  description: env.BLOG_DESCRIPTION,
  keywords: env.BLOG_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: env.BLOG_NAME,
    description: env.BLOG_DESCRIPTION,
    locale: env.BLOG_LANGUAGE,
    type: "website",
    siteName: env.BLOG_NAME,
    url: new URL(env.NEXTAUTH_URL),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await api.post.getCategories();

  const theme = blogProps.theme === "dark" ? "dark" : "light";

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistMono.variable}`}>
      {env.UMAMI_URL && env.UMAMI_WEBSITE_ID && (
        <Script
          async
          src={env.UMAMI_URL}
          data-website-id={env.UMAMI_WEBSITE_ID}
        />
      )}
      <body className="flex h-full min-h-dvh flex-col overflow-y-hidden">
        <NextIntlClientProvider messages={messages}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme={theme}
              disableTransitionOnChange
            >
              <Toaster />
              <div className="max-w-screen grid h-screen grid-cols-4">
                <div className="hidden xl:block"></div>
                <div className="col-span-full col-start-1 grid h-screen grid-cols-subgrid overflow-x-hidden overflow-y-scroll xl:col-span-3 xl:col-start-2">
                  <div className="col-span-full col-start-1 flex h-fit min-h-screen w-full flex-col items-center justify-start justify-self-center overflow-hidden sm:col-span-3 xl:col-span-2">
                    <Header />
                    <CategoriesHeader
                      links={categories.map((category) => {
                        return {
                          title: category.category,
                          href: category.href,
                        };
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
