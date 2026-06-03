import { PrivacyContent } from "@/components/legal/PrivacyContent";
import { privacyPolicy } from "@/content/privacy.es";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Política de Privacidad y Protección de Datos | Negsai",
  description:
    "Política de privacidad y protección de datos personales de Negsai. Responsable: César Ricardo Chaves Carbajal.",
  path: "/politica-privacidad",
});

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-28 md:px-6 md:py-32">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-teal-light">
          Versión {privacyPolicy.version} · {privacyPolicy.issuedAt}
        </p>
        <h1 className="font-display mt-4 text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl">
          {privacyPolicy.title}
        </h1>
        <p className="mt-4 text-muted leading-relaxed">{privacyPolicy.subtitle}</p>
        <a
          href="/assets/politica-privacidad-negsai.pdf"
          download
          className="mt-6 inline-flex border border-border px-4 py-2 text-sm text-teal-light transition-colors hover:border-teal-light"
        >
          Descargar PDF oficial
        </a>
      </header>

      <PrivacyContent />

      <Link
        href="/"
        className="mt-12 inline-block text-teal-light hover:underline"
      >
        ← Volver al inicio
      </Link>
    </article>
  );
}
