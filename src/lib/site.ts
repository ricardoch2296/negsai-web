function parseSameAs(): string[] {
  const raw = process.env.NEXT_PUBLIC_SAME_AS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export const siteConfig = {
  name: "Negsai",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negsai.com",
  locale: "es_EC",
  language: "es",
  email: "rchaves@negsai.com",
  description:
    "Negsai: desarrollo de software a medida, inteligencia artificial, automatización e integración de sistemas en Ecuador y Latinoamérica. Soluciones cloud y soporte técnico para empresas.",
  sameAs: parseSameAs(),
  keywords: [
    "desarrollo de software Ecuador",
    "desarrollo de software a medida",
    "inteligencia artificial empresas",
    "automatización de procesos",
    "integración de sistemas",
    "infraestructura cloud",
    "soporte técnico empresas",
    "soluciones tecnológicas Ecuador",
    "Negsai",
  ],
} as const;
