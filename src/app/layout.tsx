import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildMetadata,
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({
    title:
      "Negsai | Desarrollo de software, IA y soluciones cloud",
    description: siteConfig.description,
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.language}
      className={`${inter.variable} ${rajdhani.variable} h-full`}
    >
      <head>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={professionalServiceJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
