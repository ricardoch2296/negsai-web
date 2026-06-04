import type { MouseEvent } from "react";

/** Secciones de inicio que pueden marcar el nav al hacer scroll. */
export const HOME_SCROLL_SECTIONS = ["servicios", "por-que", "contacto"] as const;
export type HomeScrollSection = (typeof HOME_SCROLL_SECTIONS)[number];

/** Hashes de ancla en `/` que se limpian al salir de la sección. */
export const HOME_HASH_SECTIONS = ["servicios", "por-que", "contacto"] as const;
export type HomeHashSection = HomeScrollSection;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: "smooth" });
}

export function handleHashNavigation(
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
) {
  const url = new URL(href, window.location.origin);
  const hash = url.hash.replace("#", "");
  if (!hash) return;

  const targetPath = url.pathname || "/";
  const onSamePage =
    pathname === targetPath || (targetPath === "/" && pathname === "/");

  if (onSamePage) {
    e.preventDefault();
    scrollToSection(hash);
    window.history.pushState(null, "", `#${hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

/** Sección activa en inicio solo mientras sea visible bajo el header. */
export function getActiveHomeSection(): HomeScrollSection | null {
  const headerOffset = 96;
  const viewportHeight = window.innerHeight;
  const minVisible = Math.min(120, viewportHeight * 0.15);

  let bestId: HomeScrollSection | null = null;
  let bestVisible = 0;

  for (const id of HOME_SCROLL_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, headerOffset);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);
    const visible = Math.max(0, visibleBottom - visibleTop);

    if (visible > bestVisible) {
      bestVisible = visible;
      bestId = id;
    }
  }

  if (bestVisible < minVisible) return null;
  return bestId;
}
