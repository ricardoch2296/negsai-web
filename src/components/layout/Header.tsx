"use client";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import {
  getActiveHomeSection,
  handleHashNavigation,
  HOME_HASH_SECTIONS,
  type HomeScrollSection,
} from "@/lib/hash-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";

const nav = [
  { href: "/servicios", label: "Servicios" },
  { href: "/#por-que", label: "Por qué Negsai" },
  { href: "/#contacto", label: "Contacto" },
];

function isNavActive(
  href: string,
  pathname: string,
  homeSection: HomeScrollSection | null,
): boolean {
  if (href === "/servicios") {
    return (
      pathname === "/servicios" ||
      pathname.startsWith("/servicios/") ||
      (pathname === "/" && homeSection === "servicios")
    );
  }
  const hash = href.split("#")[1];
  if (hash && pathname === "/") {
    return homeSection === hash;
  }
  return false;
}

const navLinkClass = (active: boolean) =>
  [
    "cursor-pointer text-sm uppercase tracking-wider transition-colors",
    active
      ? "font-semibold text-teal-light"
      : "text-muted hover:text-teal-light",
  ].join(" ");

const navLinkClassMobile = (active: boolean) =>
  [
    "cursor-pointer text-lg transition-colors",
    active ? "font-semibold text-teal-light" : "text-foreground hover:text-teal-light",
  ].join(" ");

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [homeSection, setHomeSection] = useState<HomeScrollSection | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setHomeSection(null);
      return;
    }

    const sync = () => {
      const section = getActiveHomeSection();
      setHomeSection(section);

      const hash = window.location.hash.replace("#", "");
      if (
        !section &&
        HOME_HASH_SECTIONS.includes(hash as HomeScrollSection)
      ) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [pathname]);

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      handleHashNavigation(e, href, pathname);
    }
    setOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${scrolled ? "px-3 pt-3 md:px-6" : ""}`}
    >
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "header-glass mx-auto max-w-6xl py-3"
            : "bg-transparent py-5 md:py-5"
        }`}
      >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = isNavActive(item.href, pathname, homeSection);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(active)}
                aria-current={active ? "page" : undefined}
                onClick={(e) => onNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            );
          })}
          <Button href="/#contacto" variant="primary" className="!py-2 !px-4 text-xs">
            Cotizar
          </Button>
        </nav>
        <button
          type="button"
          className="cursor-pointer md:hidden text-teal-light"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#0084a340] bg-[#0a1520]/50 px-2 pb-4 backdrop-blur-xl backdrop-saturate-150 md:hidden">
          <nav className="flex flex-col gap-4 px-6 py-6" aria-label="Móvil">
            {nav.map((item) => {
              const active = isNavActive(item.href, pathname, homeSection);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClassMobile(active)}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => onNavClick(e, item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/#contacto"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-teal px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-teal-light"
              onClick={(e) => onNavClick(e, "/#contacto")}
            >
              Cotizar
            </Link>
          </nav>
        </div>
      )}
      </div>
    </header>
  );
}
