import Link from "next/link";
import { type ReactNode } from "react";

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
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none " +
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
    return (
      <Link href={href} className={base}>
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
