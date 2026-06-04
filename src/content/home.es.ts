export const homeContent = {
  hero: {
    badge: "Soluciones tecnológicas",
    title: "Tecnología que impulsa tu negocio",
    titleHighlight: "sin fronteras",
    subtitle:
      "Desarrollo de software a medida, inteligencia artificial, automatización e infraestructura cloud con un equipo que se adapta a tu operación.",
    ctaPrimary: "Cotizar",
    ctaSecondary: "Ver servicios",
    ctaSecondaryHref: "/#servicios",
  },
  stats: [
    { value: "360°", label: "Soluciones tecnológicas integrales" },
    { value: "24/7", label: "Soporte y continuidad operativa" },
    { value: "100%", label: "Proyectos remotos y colaboración global" },
  ],
  services: {
    title: "Servicios",
    subtitle:
      "Acompañamos a empresas en Ecuador y la región con servicios tecnológicos de punta a punta.",
    items: [
      {
        title: "Desarrollo de software",
        slug: "desarrollo-de-software",
        description:
          "Aplicaciones web y empresariales a medida, escalables y alineadas a tu negocio.",
        icon: "code",
      },
      {
        title: "Automatización de procesos",
        slug: "automatizacion-de-procesos",
        description:
          "Reduce tareas manuales y errores con flujos inteligentes y RPA.",
        icon: "workflow",
      },
      {
        title: "Integración de sistemas",
        slug: "integracion-de-sistemas",
        description:
          "Conecta ERP, CRM, APIs y plataformas en un ecosistema unificado.",
        icon: "plug",
      },
      {
        title: "Inteligencia artificial",
        slug: "inteligencia-artificial",
        description:
          "Modelos, asistentes y análisis predictivo para decisiones más rápidas.",
        icon: "brain",
      },
      {
        title: "Análisis de información",
        slug: "analisis-de-informacion",
        description:
          "Dashboards, BI y datos accionables para tu dirección y operación.",
        icon: "chart",
      },
      {
        title: "Despliegue de aplicaciones",
        slug: "despliegue-de-aplicaciones",
        description:
          "CI/CD, contenedores y releases seguros en producción.",
        icon: "rocket",
      },
      {
        title: "Soporte técnico",
        slug: "soporte-tecnico",
        description:
          "Mesa de ayuda, monitoreo y resolución proactiva de incidentes.",
        icon: "headphones",
      },
    ],
  },
  why: {
    title: "Por qué Negsai",
    subtitle:
      "Ingeniería sólida y comunicación clara para proyectos que llegan a producción.",
    items: [
      {
        title: "Alcance global",
        description:
          "Trabajamos de forma remota con clientes en cualquier país y zona horaria.",
      },
      {
        title: "Ingeniería seria",
        description:
          "Buenas prácticas, seguridad y documentación en cada entrega.",
      },
      {
        title: "Innovación aplicada",
        description:
          "IA y automatización cuando aportan valor real, no por moda.",
      },
      {
        title: "Acompañamiento continuo",
        description:
          "Del diagnóstico al soporte post-lanzamiento, un solo equipo.",
      },
    ],
  },
  contact: {
    title: "Contacto",
    subtitle: "Cuéntanos tu proyecto. Te respondemos en breve.",
    fields: {
      name: "Nombre completo",
      company: "Empresa (opcional)",
      email: "Correo electrónico",
      phone: "Teléfono (opcional)",
      message: "Mensaje",
      privacy:
        "Acepto la política de privacidad y el tratamiento de mis datos para fines de contacto comercial.",
    },
    submit: "Enviar mensaje",
    privacyRequired:
      "Debes aceptar la política de privacidad para enviar el mensaje.",
    turnstileError:
      "No se pudo cargar la verificación anti-spam. Recarga la página; si sigue fallando, prueba en otro navegador sin extensiones de bloqueo.",
    success: "¡Gracias! Recibimos tu mensaje y te contactaremos pronto.",
    error: "No pudimos enviar el mensaje. Intenta de nuevo o escríbenos directamente.",
  },
} as const;
