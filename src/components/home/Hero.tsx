"use client";

import { Button } from "@/components/ui/Button";
import { homeContent } from "@/content/home.es";
import { motion } from "framer-motion";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-6 md:pt-28 md:pb-8">
      <div className="pointer-events-none absolute inset-0 organic-bg" />
      <div
        className="pointer-events-none absolute -left-24 top-16 h-[28rem] w-[28rem] rounded-[40%_60%_50%_40%] opacity-25 blur-[100px]"
        style={{ background: "radial-gradient(circle, #0084a3 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-[60%_40%_45%_55%] opacity-20 blur-[90px]"
        style={{ background: "radial-gradient(circle, #004b67 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <motion.span
          className="inline-block rounded-full border border-border/80 bg-card/80 px-5 py-1.5 text-xs uppercase tracking-[0.2em] text-teal-light backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {hero.badge}
        </motion.span>

        <motion.h1
          className="font-display mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-wide md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {hero.title}{" "}
          <span className="text-gradient">{hero.titleHighlight}</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-7 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button href="/#contacto">{hero.ctaPrimary}</Button>
          <Button href={hero.ctaSecondaryHref} variant="secondary">
            {hero.ctaSecondary}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
