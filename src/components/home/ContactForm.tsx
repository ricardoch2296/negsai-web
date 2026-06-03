"use client";

import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { homeContent } from "@/content/home.es";
import Link from "next/link";
import { FormEvent, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void },
      ) => void;
      reset: () => void;
    };
  }
}

export function ContactForm() {
  const { contact } = homeContent;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          company: data.get("company") || null,
          email: data.get("email"),
          phone: data.get("phone") || null,
          message: data.get("message"),
          privacyAccepted: data.get("privacy") === "on",
          turnstileToken: turnstileToken || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
      window.turnstile?.reset();
      setTurnstileToken("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle title={contact.title} subtitle={contact.subtitle} />
        <form
          onSubmit={onSubmit}
          className="glass mx-auto max-w-2xl space-y-5 p-6 md:p-8"
          noValidate
        >
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm text-muted">
                {contact.fields.name}
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                className="w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-teal-light"
              />
            </div>
            <div>
              <label htmlFor="company" className="mb-1 block text-sm text-muted">
                {contact.fields.company}
              </label>
              <input
                id="company"
                name="company"
                className="w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-teal-light"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-muted">
                  {contact.fields.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-teal-light"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm text-muted">
                  {contact.fields.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-teal-light"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-muted">
                {contact.fields.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-y border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-teal-light"
              />
            </div>
            <label className="flex gap-3 text-sm text-muted">
              <input
                name="privacy"
                type="checkbox"
                required
                className="mt-1 accent-teal-light"
              />
              <span>
                Acepto la{" "}
                <Link
                  href="/politica-privacidad"
                  className="text-teal-light hover:underline"
                >
                  política de privacidad
                </Link>{" "}
                y el tratamiento de mis datos para contacto comercial.
              </span>
            </label>

            {siteKey && (
              <div
                className="cf-turnstile"
                data-sitekey={siteKey}
                ref={(el) => {
                  if (!el || !siteKey || el.dataset.rendered) return;
                  el.dataset.rendered = "1";
                  const script = document.createElement("script");
                  script.src =
                    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
                  script.async = true;
                  script.onload = () => {
                    window.turnstile?.render(el, {
                      sitekey: siteKey,
                      callback: (token) => setTurnstileToken(token),
                    });
                  };
                  if (!document.querySelector('script[src*="turnstile"]')) {
                    document.head.appendChild(script);
                  } else if (window.turnstile) {
                    window.turnstile.render(el, {
                      sitekey: siteKey,
                      callback: (token) => setTurnstileToken(token),
                    });
                  }
                }}
              />
            )}

            <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
              {status === "loading" ? "Enviando…" : contact.submit}
            </Button>

            {status === "success" && (
              <p className="text-sm text-teal-light" role="status">
                {contact.success}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400" role="alert">
                {contact.error}
              </p>
            )}
        </form>
      </div>
    </section>
  );
}
