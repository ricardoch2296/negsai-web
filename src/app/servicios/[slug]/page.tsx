import { ServiceDetail } from "@/components/services/ServiceDetail";
import {
  serviceBySlug,
  serviceSlugs,
} from "@/content/services.es";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};

  return buildMetadata({
    title: `${service.title} | Negsai`,
    description: service.metaDescription,
    path: `/servicios/${slug}`,
  });
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
