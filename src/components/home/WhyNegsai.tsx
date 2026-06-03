"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { homeContent } from "@/content/home.es";
import { motion } from "framer-motion";
import { Globe2, Lightbulb, Shield, Users } from "lucide-react";

const icons = [Globe2, Shield, Lightbulb, Users];

export function WhyNegsai() {
  const { why } = homeContent;

  return (
    <section id="por-que" className="bg-[#070f18] py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle title={why.title} subtitle={why.subtitle} />
        <div className="grid gap-6 md:grid-cols-2">
          {why.items.map((item, i) => {
            const Icon = icons[i] ?? Globe2;
            return (
              <motion.div
                key={item.title}
                className="flex gap-5 border-l-2 border-teal-light pl-6"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon className="mt-1 h-8 w-8 shrink-0 text-teal-light" />
                <div>
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted leading-relaxed">
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
