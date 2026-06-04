import { ServiceIcon } from "@/components/home/service-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { servicePages } from "@/content/services.es";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Servicios tecnológicos | Negsai Ecuador",
  description:
    "Servicios de Negsai: desarrollo de software, inteligencia artificial, automatización, integración de sistemas, análisis de datos, despliegue y soporte técnico.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-28 md:px-6 md:py-32">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ])}
      />

      <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-foreground">
        Servicios tecnológicos
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
        Soluciones de punta a punta para empresas en Ecuador y Latinoamérica.
        Cada servicio tiene una página con más detalle para que conozcas cómo
        podemos ayudarte.
      </p>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {servicePages.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/servicios/${service.slug}`}
              className="glass block h-full rounded-[var(--radius-xl)] p-6 transition-colors hover:border-teal-light/50"
            >
              <ServiceIcon name={service.icon} />
              <h2 className="font-display mt-4 text-xl font-semibold uppercase text-foreground">
                {service.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{service.intro}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
