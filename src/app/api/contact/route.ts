import { siteConfig } from "@/lib/site";
import { NextResponse } from "next/server";

type ContactBody = {
  fullName?: string;
  company?: string | null;
  email?: string;
  phone?: string | null;
  message?: string;
  privacyAccepted?: boolean;
  turnstileToken?: string | null;
};

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    },
  );
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

async function saveToSupabase(payload: ContactBody) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  const res = await fetch(`${url}/rest/v1/contact_leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      full_name: payload.fullName,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      source: "web",
      turnstile_verified: !!payload.turnstileToken,
    }),
  });

  return res.ok;
}

async function sendEmail(payload: ContactBody) {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.CONTACT_NOTIFY_EMAIL ?? siteConfig.email;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Negsai Web <onboarding@resend.dev>";

  if (!apiKey) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Nuevo contacto web — Negsai",
      html: `
        <h2>Nuevo mensaje desde negsai.com</h2>
        <p><strong>Nombre:</strong> ${payload.fullName}</p>
        <p><strong>Empresa:</strong> ${payload.company ?? "—"}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Teléfono:</strong> ${payload.phone ?? "—"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${String(payload.message).replace(/\n/g, "<br>")}</p>
      `,
    }),
  });

  return res.ok;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;

    if (!body.privacyAccepted) {
      return NextResponse.json(
        { error: "Debe aceptar la política de privacidad" },
        { status: 400 },
      );
    }

    if (
      !body.fullName?.trim() ||
      !body.email?.trim() ||
      !body.message?.trim()
    ) {
      return NextResponse.json(
        { error: "Campos obligatorios incompletos" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!body.turnstileToken) {
        return NextResponse.json(
          { error: "Verificación anti-spam requerida" },
          { status: 400 },
        );
      }
      const valid = await verifyTurnstile(body.turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Verificación anti-spam fallida" },
          { status: 400 },
        );
      }
    }

    const hasSupabase =
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasResend = process.env.RESEND_API_KEY;

    if (!hasSupabase && !hasResend) {
      if (process.env.NODE_ENV === "development") {
        console.info("[contact] dev mode — no backend configured", body);
        return NextResponse.json({ ok: true, dev: true });
      }
      return NextResponse.json(
        { error: "Servicio de contacto no configurado" },
        { status: 503 },
      );
    }

    const results = await Promise.all([
      hasSupabase ? saveToSupabase(body) : Promise.resolve(true),
      hasResend ? sendEmail(body) : Promise.resolve(true),
    ]);

    if (!results.some(Boolean)) {
      return NextResponse.json(
        { error: "No se pudo procesar el contacto" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 },
    );
  }
}
