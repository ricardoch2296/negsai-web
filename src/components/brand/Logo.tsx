import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/assets/logo.svg"
        alt="Negsai - Soluciones tecnológicas"
        width={140}
        height={34}
        priority
        className="h-8 w-auto md:h-9"
      />
    </Link>
  );
}
