import type { Metadata } from "next";
import { siteConfig } from "./site";

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Negsai — Soluciones tecnológicas",
};

const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

export function buildMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_EC",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    robots: noIndexRobots,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/assets/logo-negsai.png`,
    areaServed: [
      { "@type": "Country", name: "Ecuador" },
      { "@type": "Place", name: "Latinoamérica" },
    ],
    description: siteConfig.description,
    ...(siteConfig.sameAs.length > 0 ? { sameAs: siteConfig.sameAs } : {}),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/assets/logo-negsai.png`,
    description: siteConfig.description,
    areaServed: [
      { "@type": "Country", name: "Ecuador" },
      { "@type": "Place", name: "Latinoamérica" },
    ],
    priceRange: "$$",
  };
}

export function professionalServiceJsonLd() {
  return localBusinessJsonLd();
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "es-EC",
    description: siteConfig.description,
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: siteConfig.name },
    areaServed: { "@type": "Country", name: "Ecuador" },
    url: `${siteConfig.url}${path}`,
  };
}
