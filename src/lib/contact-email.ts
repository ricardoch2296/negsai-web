type ContactEmailPayload = {
  fullName?: string;
  company?: string | null;
  email?: string;
  phone?: string | null;
  message?: string;
};

/** Colores Negsai (theme.md) — hex fijos para que Gmail/Outlook no los inviertan */
const C = {
  navy: "#004b67",
  teal: "#0084a3",
  tealLight: "#0097b2",
  bgPage: "#e8f4f8",
  bgCard: "#ffffff",
  bgMessage: "#f0f9ff",
  text: "#050a10",
  textSoft: "#334155",
  muted: "#64748b",
  border: "#0084a3",
  white: "#ffffff",
  logoUrl: "https://www.negsai.com/assets/logo-negsai.png",
  siteUrl: "https://www.negsai.com",
} as const;

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

/** Evita que clientes de correo recoloreen fondos y textos en modo oscuro */
function lockColor(style: string): string {
  return `${style} background-image:linear-gradient(${extractBg(style)},${extractBg(style)});`;
}

function extractBg(style: string): string {
  const m = style.match(/background-color:\s*(#[0-9a-fA-F]{3,8})/);
  return m?.[1] ?? "#ffffff";
}

function fieldRow(label: string, value: string, opts?: { isMessage?: boolean }) {
  const safe = escapeHtml(value || "—");
  const content = opts?.isMessage
    ? safe.replace(/\n/g, "<br />")
    : safe;

  const valueStyle = opts?.isMessage
    ? lockColor(
        `background-color:${C.bgMessage};border-left:4px solid ${C.teal};padding:14px 16px;color:${C.text};`,
      )
    : `color:${C.text};`;

  return `
    <tr>
      <td style="padding:0 0 14px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${C.teal};padding-bottom:4px;mso-line-height-rule:exactly;">
              ${escapeHtml(label)}
            </td>
          </tr>
          <tr>
            <td style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;${valueStyle}mso-line-height-rule:exactly;">
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
<html lang="es" xmlns="http://wwwwww.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Nuevo contacto — Negsai</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Segoe UI, Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Nuevo contacto web de ${escapeHtml(name || "un visitante")} — Negsai
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bgPage}" style="${lockColor(`background-color:${C.bgPage};`)}border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;border-collapse:collapse;">
          <!-- Barra marca -->
          <tr>
            <td height="4" bgcolor="${C.tealLight}" style="background-color:${C.tealLight};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <!-- Logo -->
          <tr>
            <td align="center" bgcolor="${C.bgCard}" style="${lockColor(`background-color:${C.bgCard};`)}padding:24px 24px 16px;border-left:1px solid ${C.border};border-right:1px solid ${C.border};">
              <a href="${C.siteUrl}" style="text-decoration:none;">
                <img src="${C.logoUrl}" alt="Negsai" width="112" style="display:block;border:0;height:auto;max-width:112px;" />
              </a>
            </td>
          </tr>
          <!-- Cabecera teal -->
          <tr>
            <td bgcolor="${C.teal}" style="${lockColor(`background-color:${C.teal};`)}padding:20px 24px;border-left:1px solid ${C.border};border-right:1px solid ${C.border};">
              <p style="margin:0 0 6px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:${C.white};line-height:1.3;">
                Nuevo mensaje de contacto
              </p>
              <p style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;color:${C.bgMessage};line-height:1.4;">
                Formulario web · ${escapeHtml(sentAt)}
              </p>
            </td>
          </tr>
          <!-- Cuerpo -->
          <tr>
            <td bgcolor="${C.bgCard}" style="${lockColor(`background-color:${C.bgCard};`)}padding:24px;border:1px solid ${C.border};border-top:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${fieldRow("Nombre", name)}
                ${fieldRow("Empresa", company)}
                ${fieldRow("Correo", email)}
                ${fieldRow("Teléfono", phone)}
                ${fieldRow("Mensaje", message, { isMessage: true })}
                <tr>
                  <td style="padding-top:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="${C.teal}" style="background-color:${C.teal};border-radius:6px;mso-padding-alt:12px 28px;">
                          <a href="${replyHref}" target="_blank" style="display:inline-block;padding:12px 28px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:${C.white};text-decoration:none;border-radius:6px;background-color:${C.teal};">
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
          <!-- Pie -->
          <tr>
            <td align="center" bgcolor="${C.navy}" style="${lockColor(`background-color:${C.navy};`)}padding:16px 24px;border-radius:0 0 8px 8px;border:1px solid ${C.border};border-top:0;">
              <p style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${C.bgMessage};">
                <a href="${C.siteUrl}" style="color:${C.tealLight};font-weight:600;text-decoration:none;">negsai.com</a>
                <span style="color:${C.muted};"> · Desarrollo de software e IA · Ecuador</span>
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
