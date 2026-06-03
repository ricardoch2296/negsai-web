"use client";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#por-que", label: "Por qué Negsai" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider text-muted transition-colors hover:text-teal-light"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/#contacto" variant="primary" className="!py-2 !px-4 text-xs">
            Cotizar
          </Button>
        </nav>
        <button
          type="button"
          className="md:hidden text-teal-light"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {open && (
        <div className="glass border-t border-border md:hidden">
          <nav className="flex flex-col gap-4 px-6 py-6" aria-label="Móvil">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contacto"
              className="inline-flex w-full items-center justify-center bg-teal px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-teal-light"
              onClick={() => setOpen(false)}
            >
              Cotizar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
