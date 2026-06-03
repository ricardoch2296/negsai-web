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
  phone: "+593 99 153 8433",
  phoneDisplay: "099 153 8433",
  whatsappNumber: "593991538433",
  whatsappUrl:
    "https://wa.me/593991538433?text=Hola%20Negsai%2C%20me%20gustar%C3%ADa%20consultar%20sobre%20sus%20servicios.",
  description:
    "Negsai: desarrollo de software a medida, inteligencia artificial, automatización e integración de sistemas en Ecuador y Latinoamérica. Soluciones cloud y soporte técnico para empresas.",
  address: {
    street: "Florencio Espinoza N56-119 y Av. Carlos V",
    city: "Quito",
    country: "EC",
    countryName: "Ecuador",
  },
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
