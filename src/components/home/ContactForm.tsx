"use client";

import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { homeContent } from "@/content/home.es";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          size?: "normal" | "flexible" | "compact";
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function ContactForm() {
  const { contact } = homeContent;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorDetail, setErrorDetail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const needsTurnstile = Boolean(siteKey);
  const canSubmit =
    privacyAccepted &&
    status !== "loading" &&
    (!needsTurnstile || Boolean(turnstileToken));

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;

    const mount = () => {
      const el = turnstileRef.current;
      if (!el || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: siteKey,
        size: "flexible",
        theme: "dark",
        callback: (token) => {
          setTurnstileToken(token);
          setTurnstileError(false);
        },
        "error-callback": () => {
          setTurnstileToken("");
          setTurnstileError(true);
        },
      });
    };

    if (window.turnstile) {
      mount();
    } else {
      const existing = document.querySelector(
        'script[src*="challenges.cloudflare.com/turnstile"]',
      );
      if (existing) {
        existing.addEventListener("load", mount);
      } else {
        const script = document.createElement("script");
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.onload = mount;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) return;
    if (needsTurnstile && !turnstileToken) {
      setErrorDetail(contact.turnstileError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorDetail("");

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
          privacyAccepted: true,
          turnstileToken: turnstileToken || null,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? "Request failed");
      }

      setStatus("success");
      form.reset();
      setPrivacyAccepted(false);
      if (widgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken("");
    } catch (err) {
      setStatus("error");
      setErrorDetail(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : contact.error,
      );
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

          <div className="space-y-2 border-t border-border/40 pt-4">
            <label className="flex cursor-pointer gap-2.5 text-sm text-muted">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 shrink-0 accent-teal-light"
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

            {!privacyAccepted && (
              <p className="text-xs text-muted">{contact.privacyRequired}</p>
            )}

            {siteKey && (
              <div ref={turnstileRef} className="min-h-[65px] w-full" />
            )}

            {turnstileError && (
              <p className="text-sm text-amber-400/90" role="alert">
                {contact.turnstileError}
              </p>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full sm:w-auto"
              >
                {status === "loading" ? "Enviando…" : contact.submit}
              </Button>

              {status === "success" && (
                <p className="text-sm text-teal-light" role="status">
                  {contact.success}
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  {errorDetail || contact.error}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
