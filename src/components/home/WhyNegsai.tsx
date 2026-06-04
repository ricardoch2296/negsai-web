"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { homeContent } from "@/content/home.es";
import { motion } from "framer-motion";
import { Globe2, Lightbulb, Shield, Users } from "lucide-react";

const icons = [Globe2, Shield, Lightbulb, Users];

export function WhyNegsai() {
  const { why } = homeContent;

  return (
    <section id="por-que" className="bg-surface py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle title={why.title} subtitle={why.subtitle} />
        <div className="grid gap-4 md:grid-cols-2">
          {why.items.map((item, i) => {
            const Icon = icons[i] ?? Globe2;
            return (
              <motion.div
                key={item.title}
                className="glass flex gap-5 rounded-[var(--radius-xl)] p-5 transition-colors hover:border-teal-light/35"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal/15">
                  <Icon className="h-6 w-6 text-teal-light" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
