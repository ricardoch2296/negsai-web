type ContactEmailPayload = {
  fullName?: string;
  company?: string | null;
  email?: string;
  phone?: string | null;
  message?: string;
};

const BRAND = {
  bg: "#050a10",
  card: "#0a1520",
  border: "#0084a3",
  teal: "#0084a3",
  tealLight: "#0097b2",
  text: "#f0f9ff",
  muted: "#94a3b8",
  logoUrl: "https://www.negsai.com/assets/logo-negsai.png",
  siteUrl: "https://www.negsai.com",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSentAt(): string {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Guayaquil",
  }).format(new Date());
}

function fieldRow(label: string, value: string, opts?: { isMessage?: boolean }) {
  const safe = escapeHtml(value || "—");
  const content = opts?.isMessage
    ? safe.replace(/\n/g, "<br />")
    : safe;

  return `
    <tr>
      <td style="padding:0 0 16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.tealLight};padding-bottom:6px;">
              ${escapeHtml(label)}
            </td>
          </tr>
          <tr>
            <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:${BRAND.text};${opts?.isMessage ? `background-color:rgba(0,132,163,0.08);border-left:3px solid ${BRAND.teal};padding:14px 16px;border-radius:0 8px 8px 0;` : ""}">
              ${content}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

export function buildContactEmailSubject(payload: ContactEmailPayload): string {
  const name = payload.fullName?.trim() || "Sin nombre";
  return `Nuevo contacto: ${name} — Negsai`;
}

export function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const name = payload.fullName?.trim() ?? "";
  const company = payload.company?.trim() || "—";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() || "—";
  const message = payload.message?.trim() ?? "";
  const sentAt = formatSentAt();
  const replyHref = email ? `mailto:${encodeURIComponent(email)}` : "#";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>Nuevo contacto — Negsai</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-collapse:collapse;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <a href="${BRAND.siteUrl}" style="text-decoration:none;">
                <img src="${BRAND.logoUrl}" alt="Negsai" width="120" height="auto" style="display:block;border:0;border-radius:12px;" />
              </a>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:${BRAND.card};border:1px solid rgba(0,132,163,0.35);border-radius:16px;padding:28px 24px;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding-bottom:20px;border-bottom:1px solid rgba(0,151,178,0.25);">
                    <p style="margin:0 0 8px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:${BRAND.text};">
                      Nuevo mensaje de contacto
                    </p>
                    <p style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;color:${BRAND.muted};">
                      Formulario web · ${escapeHtml(sentAt)}
                    </p>
                  </td>
                </tr>
                ${fieldRow("Nombre", name)}
                ${fieldRow("Empresa", company)}
                ${fieldRow("Correo", email)}
                ${fieldRow("Teléfono", phone)}
                ${fieldRow("Mensaje", message, { isMessage: true })}
                <tr>
                  <td style="padding-top:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="border-radius:999px;background:linear-gradient(135deg,${BRAND.teal},${BRAND.tealLight});">
                          <a href="${replyHref}" style="display:inline-block;padding:12px 24px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                            Responder a ${escapeHtml(name || "contacto")}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.muted};">
                <a href="${BRAND.siteUrl}" style="color:${BRAND.tealLight};text-decoration:none;">negsai.com</a>
                · Desarrollo de software e IA · Ecuador
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildContactEmailText(payload: ContactEmailPayload): string {
  const lines = [
    "NUEVO CONTACTO — NEGSAI",
    "========================",
    "",
    `Fecha: ${formatSentAt()}`,
    `Nombre: ${payload.fullName ?? "—"}`,
    `Empresa: ${payload.company?.trim() || "—"}`,
    `Email: ${payload.email ?? "—"}`,
    `Teléfono: ${payload.phone?.trim() || "—"}`,
    "",
    "Mensaje:",
    "-------",
    payload.message?.trim() ?? "—",
    "",
    `Responder: ${payload.email ?? ""}`,
    "",
    "— negsai.com",
  ];
  return lines.join("\n");
}
