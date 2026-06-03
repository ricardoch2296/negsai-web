"use client";

import { ServiceIcon } from "@/components/home/service-icons";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { homeContent } from "@/content/home.es";
import { siteConfig } from "@/lib/site";
import { motion } from "framer-motion";

export function Services() {
  const { services } = homeContent;

  return (
    <section id="servicios" className="py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle
          title={services.title}
          subtitle={services.subtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, i) => (
            <motion.article
              key={item.title}
              className="glass group p-6 transition-colors hover:border-teal-light/40"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="mb-4 inline-flex rounded border border-border p-3 transition-colors group-hover:border-teal-light/50">
                <ServiceIcon name={item.icon} />
              </div>
              <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/#contacto">Cotizar</Button>
          <Button href={siteConfig.whatsappUrl} variant="secondary">
            Contactar
          </Button>
        </div>
      </div>
    </section>
  );
}
