"use client";

import { Button } from "@/components/ui/Button";
import { homeContent } from "@/content/home.es";
import { motion } from "framer-motion";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative min-h-[72vh] overflow-hidden pt-24 pb-12 md:pt-28 md:pb-14">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #0084a3 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, #004b67 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <motion.span
          className="inline-block border border-border bg-card px-4 py-1 text-xs uppercase tracking-[0.2em] text-teal-light"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {hero.badge}
        </motion.span>

        <motion.h1
          className="font-display mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-wide md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {hero.title}{" "}
          <span className="text-gradient">{hero.titleHighlight}</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg text-muted leading-relaxed md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button href="/#contacto">{hero.ctaPrimary}</Button>
          <Button href="/#servicios" variant="secondary">
            {hero.ctaSecondary}
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 h-px w-full max-w-md bg-gradient-to-r from-teal via-teal-light to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ originX: 0 }}
        />
      </div>
    </section>
  );
}
