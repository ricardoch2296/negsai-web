import { Footer } from "@/components/layout/Footer";
import { HashScrollOnLoad } from "@/components/layout/HashScrollOnLoad";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildMetadata,
  localBusinessJsonLd,
  organizationJsonLd,
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

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({
    title:
      "Negsai | Desarrollo de software, IA y soluciones cloud",
    description: siteConfig.description,
  }),
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
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
        <link rel="preconnect" href="https://challenges.cloudflare.com" />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <HashScrollOnLoad />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
