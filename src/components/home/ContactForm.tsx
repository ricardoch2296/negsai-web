"use client";

import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { homeContent } from "@/content/home.es";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const { contact } = homeContent;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorDetail, setErrorDetail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) {
      setPrivacyError(true);
      return;
    }
    setPrivacyError(false);

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
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(json.error ?? "Request failed");
      }

      setStatus("success");
      form.reset();
      setPrivacyAccepted(false);
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
    <section id="contacto" className="py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle title={contact.title} subtitle={contact.subtitle} />
        <form
          onSubmit={onSubmit}
          className="glass-soft mx-auto max-w-2xl space-y-5 p-6 md:p-10"
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
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="company" className="mb-1 block text-sm text-muted">
              {contact.fields.company}
            </label>
            <input
              id="company"
              name="company"
              className="input-field"
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
                className="input-field"
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
                className="input-field"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="mb-1 block text-sm text-muted">
              {contact.fields.message}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="input-field resize-y"
            />

            <label className="flex cursor-pointer gap-2.5 pt-1 text-sm text-muted">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked);
                  if (e.target.checked) setPrivacyError(false);
                }}
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

            {privacyError && (
              <p className="text-xs text-red-400" role="alert">
                {contact.privacyRequired}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={status === "loading"}
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
        </form>
      </div>
    </section>
  );
}
