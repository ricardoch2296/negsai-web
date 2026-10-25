import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-teal-light/30 bg-[#010408] shadow-[0_-12px_40px_rgba(0,151,178,0.08)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between md:px-6 md:py-10">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted leading-relaxed">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <p className="text-muted">Ecuador · Latinoamérica</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <Link href="/servicios" className="hover:text-teal-light">
            Servicios
          </Link>
          <Link href="/politica-privacidad" className="hover:text-teal-light">
            Política de privacidad
          </Link>
        </div>
      </div>
      <div className="border-t border-border/40 bg-black/30 py-4 text-center text-xs text-muted">
        © {year} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
