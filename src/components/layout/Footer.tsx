import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#03070c]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:justify-between md:px-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted leading-relaxed">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 text-foreground hover:text-teal-light"
          >
            <Mail size={16} className="text-teal-light" />
            {siteConfig.email}
          </a>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-foreground hover:text-teal-light"
          >
            <Phone size={16} className="text-teal-light" />
            {siteConfig.phoneDisplay}
          </a>
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
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {year} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
