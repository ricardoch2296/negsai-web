export type ServicePage = {
  slug: string;
  title: string;
  metaDescription: string;
  icon: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "desarrollo-de-software",
    title: "Desarrollo de software a medida",
    metaDescription:
      "Desarrollo de software a medida en Ecuador: aplicaciones web, APIs y sistemas empresariales escalables con Negsai.",
    icon: "code",
    intro:
      "Diseñamos y construimos software alineado a tus procesos reales, con arquitectura mantenible y entregas iterativas.",
    sections: [
      {
        heading: "Qué incluye",
        body: "Análisis de requerimientos, diseño técnico, desarrollo frontend y backend, pruebas, documentación y despliegue. Trabajamos con stacks modernos y buenas prácticas de ingeniería.",
      },
      {
        heading: "Para quién",
        body: "Empresas en Ecuador y Latinoamérica que necesitan digitalizar operaciones, reemplazar hojas de cálculo o integrar equipos y áreas en una sola plataforma.",
      },
    ],
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligencia artificial",
    metaDescription:
      "Soluciones de inteligencia artificial para empresas: asistentes, análisis predictivo e integración de IA con Negsai.",
    icon: "brain",
    intro:
      "Aplicamos IA cuando aporta valor medible: automatizar respuestas, clasificar información o apoyar decisiones con datos.",
    sections: [
      {
        heading: "Casos de uso",
        body: "Chatbots internos, extracción de datos de documentos, resúmenes, recomendaciones y copilotos conectados a tus sistemas vía API.",
      },
      {
        heading: "Enfoque responsable",
        body: "Minimizamos datos sensibles en herramientas externas, usamos entornos controlados y documentamos límites y riesgos para tu negocio.",
      },
    ],
  },
  {
    slug: "automatizacion-de-procesos",
    title: "Automatización de procesos",
    metaDescription:
      "Automatización de procesos empresariales y RPA en Ecuador. Reduce tareas manuales con Negsai.",
    icon: "workflow",
    intro:
      "Identificamos tareas repetitivas y las convertimos en flujos automáticos entre sistemas, correo, hojas de cálculo y APIs.",
    sections: [
      {
        heading: "Beneficios",
        body: "Menos errores humanos, tiempos de respuesta más cortos y equipos enfocados en trabajo de mayor valor.",
      },
      {
        heading: "Cómo trabajamos",
        body: "Mapeamos el proceso actual, definimos el flujo objetivo, implementamos integraciones y dejamos monitoreo y alertas.",
      },
    ],
  },
  {
    slug: "integracion-de-sistemas",
    title: "Integración de sistemas",
    metaDescription:
      "Integración de ERP, CRM, APIs y plataformas. Conecta tu ecosistema tecnológico con Negsai en Ecuador.",
    icon: "plug",
    intro:
      "Unificamos datos y eventos entre aplicaciones para que tu operación no dependa de exportaciones manuales.",
    sections: [
      {
        heading: "Integraciones típicas",
        body: "ERP, CRM, pasarelas de pago, almacenamiento cloud, bases de datos, servicios de mensajería y herramientas internas.",
      },
      {
        heading: "Resultado",
        body: "Un solo flujo de información, menos duplicidad y trazabilidad de extremo a extremo.",
      },
    ],
  },
  {
    slug: "analisis-de-informacion",
    title: "Análisis de información",
    metaDescription:
      "Business intelligence, dashboards y análisis de datos para decisiones empresariales. Negsai Ecuador.",
    icon: "chart",
    intro:
      "Transformamos datos dispersos en tableros y reportes que tu equipo puede usar cada día.",
    sections: [
      {
        heading: "Entregables",
        body: "Dashboards, KPIs, reportes programados y modelos de datos documentados para auditoría y mejora continua.",
      },
      {
        heading: "Fuentes",
        body: "Bases de datos, APIs, archivos y sistemas legacy — siempre con permisos y alcance acordados con el cliente.",
      },
    ],
  },
  {
    slug: "despliegue-de-aplicaciones",
    title: "Despliegue de aplicaciones",
    metaDescription:
      "CI/CD, contenedores y despliegue seguro de aplicaciones en cloud. Negsai Ecuador y LATAM.",
    icon: "rocket",
    intro:
      "Llevamos tu software a producción con pipelines repetibles y entornos separados (desarrollo, prueba, producción).",
    sections: [
      {
        heading: "Prácticas",
        body: "Control de versiones, revisiones de código, pruebas automatizadas cuando aplica y rollback planificado.",
      },
      {
        heading: "Plataformas",
        body: "Experiencia en AWS y servicios cloud; configuración según el diseño acordado con tu equipo.",
      },
    ],
  },
  {
    slug: "soporte-tecnico",
    title: "Soporte técnico",
    metaDescription:
      "Soporte técnico y mesa de ayuda para empresas. Monitoreo y resolución de incidentes con Negsai.",
    icon: "headphones",
    intro:
      "Acompañamos tus sistemas después del go-live con soporte proactivo y comunicación clara.",
    sections: [
      {
        heading: "Alcance",
        body: "Tickets, monitoreo, actualizaciones planificadas, respaldos y escalamiento según criticidad.",
      },
      {
        heading: "Compromiso",
        body: "Tiempos de respuesta acordados por contrato y documentación de cada incidente resuelto.",
      },
    ],
  },
];

export const serviceBySlug = Object.fromEntries(
  servicePages.map((s) => [s.slug, s]),
) as Record<string, ServicePage>;

export const serviceSlugs = servicePages.map((s) => s.slug);
