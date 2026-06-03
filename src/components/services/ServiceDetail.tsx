import { ServiceIcon } from "@/components/home/service-icons";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ServicePage } from "@/content/services.es";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import Link from "next/link";

export function ServiceDetail({ service }: { service: ServicePage }) {
  const path = `/servicios/${service.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-28 md:px-6 md:py-32">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: service.title, path },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: service.title,
          description: service.metaDescription,
          path,
        })}
      />

      <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-teal-light">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/servicios" className="hover:text-teal-light">
          Servicios
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{service.title}</span>
      </nav>

      <div className="mb-6 inline-flex border border-border p-3">
        <ServiceIcon name={service.icon} />
      </div>

      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl">
        {service.title}
      </h1>
      <p className="mt-6 text-lg text-muted leading-relaxed">{service.intro}</p>

      <div className="mt-10 space-y-8">
        {service.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold uppercase text-foreground">
              {section.heading}
            </h2>
            <p className="mt-3 text-muted leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Button href="/#contacto">Cotizar este servicio</Button>
        <Button href="/servicios" variant="secondary">
          Ver todos los servicios
        </Button>
      </div>
    </article>
  );
}
