/** Separador curvo minimalista entre secciones */
export function CurveDivider({
  fill = "var(--background)",
  flip = false,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`w-full leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="block h-6 w-full md:h-8"
      >
        <path
          fill={fill}
          d="M0,28 C320,52 640,12 960,36 C1200,52 1320,20 1440,32 L1440,56 L0,56 Z"
        />
      </svg>
    </div>
  );
}
