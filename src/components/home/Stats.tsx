"use client";

import { homeContent } from "@/content/home.es";
import { motion } from "framer-motion";

export function Stats() {
  return (
    <section className="bg-surface py-5 md:py-6">
      <div className="mx-auto flex max-w-6xl justify-center px-4 md:px-6">
        <div className="glass-soft grid w-full max-w-4xl grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-3 sm:gap-4 md:px-8 md:py-6">
          {homeContent.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="font-display text-3xl font-bold text-teal-light md:text-4xl">
                {stat.value}
              </p>
              <p className="mx-auto mt-1.5 max-w-[14rem] text-xs uppercase leading-snug tracking-wider text-muted sm:max-w-none md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
