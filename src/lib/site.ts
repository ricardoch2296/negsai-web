export const siteConfig = {
  name: "Negsai",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://negsai.com",
  locale: "es",
  language: "es",
  email: "rchaves@negsai.com",
  phone: "+593 99 153 8433",
  phoneDisplay: "099 153 8433",
  whatsappNumber: "593991538433",
  whatsappUrl:
    "https://wa.me/593991538433?text=Hola%20Negsai%2C%20me%20gustar%C3%ADa%20consultar%20sobre%20sus%20servicios.",
  description:
    "Negsai ofrece desarrollo de software, inteligencia artificial, automatización, integración de sistemas e infraestructura cloud.",
  keywords: [
    "desarrollo de software a medida",
    "soluciones tecnológicas empresas",
    "automatización de procesos",
    "inteligencia artificial empresas",
    "infraestructura cloud",
    "integración de sistemas",
    "soporte técnico empresas",
    "Negsai",
  ],
} as const;
