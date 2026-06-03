import type { Metadata } from "next";
import { siteConfig } from "./site";

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.locale.replace("_", "-"),
      url,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: { "@type": "Place", name: "Worldwide" },
    description: siteConfig.description,
    sameAs: [] as string[],
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/assets/logo.svg`,
    description: siteConfig.description,
    areaServed: { "@type": "Place", name: "Worldwide" },
    serviceType: [
      "Desarrollo de software",
      "Automatización de procesos",
      "Integración de sistemas",
      "Inteligencia artificial",
      "Infraestructura cloud",
      "Soporte técnico",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      availableLanguage: ["Spanish"],
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "es",
    description: siteConfig.description,
  };
}
