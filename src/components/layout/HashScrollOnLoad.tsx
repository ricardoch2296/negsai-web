"use client";

import { useEffect } from "react";

export function HashScrollOnLoad() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const scroll = () => {
      const el = document.getElementById(hash);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    };

    requestAnimationFrame(() => {
      scroll();
      setTimeout(scroll, 100);
    });
  }, []);

  return null;
}
