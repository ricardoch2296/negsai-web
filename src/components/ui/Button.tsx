"use client";

import { handleHashNavigation } from "@/lib/hash-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-teal text-foreground font-semibold hover:bg-teal-light border border-teal-light/30",
  secondary:
    "border border-border text-foreground hover:border-teal-light hover:text-teal-light",
  ghost: "text-muted hover:text-teal-light",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const base =
    "inline-flex cursor-pointer items-center justify-center rounded-full px-7 py-3 text-sm tracking-wide uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none " +
    variants[variant] +
    " " +
    className;

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className={base}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    const hasHash = href.includes("#");

    return (
      <Link
        href={href}
        className={base}
        onClick={(e) => {
          if (hasHash) {
            handleHashNavigation(
              e as unknown as MouseEvent<HTMLAnchorElement>,
              href,
              pathname,
            );
          }
          onClick?.();
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={base}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
