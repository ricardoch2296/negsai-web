import { siteConfig } from "@/lib/site";
import { newUuidV7 } from "@/lib/uuid";
import { NextResponse } from "next/server";

type ContactBody = {
  fullName?: string;
  company?: string | null;
  email?: string;
  phone?: string | null;
  message?: string;
  privacyAccepted?: boolean;
};

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
      id: newUuidV7(),
      full_name: payload.fullName,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      source: "web",
      turnstile_verified: false,
    }),
  });

  return res.ok;
}

async function sendEmail(
  payload: ContactBody,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.CONTACT_NOTIFY_EMAIL ?? siteConfig.email;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Negsai Web <onboarding@resend.dev>";

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY no configurada" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: "Nuevo contacto web — Negsai",
      html: `
        <h2>Nuevo mensaje desde negsai.com</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(payload.fullName ?? "")}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(payload.company ?? "—")}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email ?? "")}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(payload.phone ?? "—")}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(String(payload.message ?? "")).replace(/\n/g, "<br>")}</p>
      `,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    name?: string;
  };

  if (!res.ok) {
    const detail = data.message ?? `HTTP ${res.status}`;
    console.error("[contact] Resend:", detail);
    return { ok: false, error: detail };
  }

  return { ok: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

    const [saved, emailResult] = await Promise.all([
      hasSupabase ? saveToSupabase(body) : Promise.resolve(true),
      hasResend
        ? sendEmail(body)
        : Promise.resolve({ ok: true as const }),
    ]);

    if (!saved && !emailResult.ok) {
      return NextResponse.json(
        { error: "No se pudo procesar el contacto" },
        { status: 500 },
      );
    }

    if (saved && hasResend && !emailResult.ok) {
      console.error(
        "[contact] Guardado en Supabase pero el correo falló:",
        emailResult.error,
      );
    }

    return NextResponse.json({
      ok: true,
      emailSent: emailResult.ok,
    });
  } catch {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 },
    );
  }
}
