"use client";

import { homeContent } from "@/content/home.es";
import { motion } from "framer-motion";

export function Stats() {
  return (
    <section className="border-y border-border bg-[#070f18] py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-6">
        {homeContent.stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="font-display text-4xl font-bold text-teal-light md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm uppercase tracking-wider text-muted">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
