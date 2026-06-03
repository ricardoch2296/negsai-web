import { ContactForm } from "@/components/home/ContactForm";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Stats } from "@/components/home/Stats";
import { WhyNegsai } from "@/components/home/WhyNegsai";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Negsai | Desarrollo de software e IA en Ecuador",
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <WhyNegsai />
      <ContactForm />
    </>
  );
}
