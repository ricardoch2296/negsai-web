import { PrivacyContent } from "@/components/legal/PrivacyContent";
import { Button } from "@/components/ui/Button";
import { privacyPolicy } from "@/content/privacy.es";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Política de Privacidad y Protección de Datos | Negsai",
  description:
    "Política de privacidad y protección de datos personales de Negsai.",
  path: "/politica-privacidad",
});

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 pt-28 pb-6 md:px-6 md:pt-32 md:pb-8">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl">
          {privacyPolicy.title}
        </h1>
        <p className="mt-4 text-muted leading-relaxed">{privacyPolicy.subtitle}</p>
      </header>

      <PrivacyContent />

      <div className="mt-8">
        <Button href="/" variant="secondary">
          Volver al inicio
        </Button>
      </div>
    </article>
  );
}
