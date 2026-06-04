"use client";

import { motion } from "framer-motion";

export function SectionTitle({
  id,
  title,
  subtitle,
}: {
  id?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      id={id}
      className="mb-5 max-w-2xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base text-muted leading-relaxed md:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
