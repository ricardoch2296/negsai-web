"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/** Sube el número al cambiar el archivo en public/assets/logo-negsai.png */
const LOGO_VERSION = "20260604-v3";
const LOGO_OFFICIAL = `/assets/logo-negsai.png?v=${LOGO_VERSION}`;
const LOGO_FALLBACK = "/assets/logo.svg";

export function Logo({ className = "" }: { className?: string }) {
  const [src, setSrc] = useState(LOGO_OFFICIAL);
  const isOfficial = src.startsWith("/assets/logo-negsai.png");

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 cursor-pointer items-center overflow-hidden rounded-[var(--radius-lg)] ${className}`}
    >
      <Image
        key={src}
        src={src}
        alt="Negsai — Soluciones tecnológicas"
        width={isOfficial ? 140 : 140}
        height={isOfficial ? 56 : 34}
        priority
        unoptimized
        className={
          isOfficial
            ? "h-11 w-auto rounded-[var(--radius-lg)] md:h-12"
            : "h-10 w-auto rounded-[var(--radius-lg)] brightness-110 contrast-105 drop-shadow-[0_0_10px_rgba(0,229,255,0.35)] md:h-11"
        }
        onError={() => {
          if (isOfficial) setSrc(LOGO_FALLBACK);
        }}
      />
    </Link>
  );
}
