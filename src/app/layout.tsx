import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "ABC Blog",
  description: "Simple markdown blog with admin panel.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistMono.variable}`}>
      <body>
        <TRPCReactProvider>
          <main className="flex max-w-2xl flex-col">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
