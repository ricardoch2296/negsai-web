import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}

function unavailablePage(host: string) {
  const safeHost = escapeHtml(host);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <title>This site can’t be reached</title>
    <style>
      html, body { margin: 0; min-height: 100%; background: #fff; color: #202124; }
      body { font-family: "Segoe UI", Roboto, Arial, sans-serif; }
      main { max-width: 34rem; margin: 12vh auto 0; padding: 0 2rem 3rem; }
      .icon { width: 3.25rem; height: 3.25rem; margin-bottom: 1.25rem; color: #9aa0a6; }
      h1 { margin: 0 0 1rem; font-size: 1.55rem; font-weight: 400; line-height: 1.3; }
      p, li { font-size: 0.95rem; line-height: 1.5; color: #3c4043; }
      p { margin: 0 0 1rem; }
      .try { margin: 0 0 0.35rem; font-weight: 500; }
      ul { margin: 0 0 1.5rem; padding-left: 1.25rem; }
      li { margin: 0.15rem 0; }
      code { display: block; margin-top: 1.75rem; font-family: Consolas, "Courier New", monospace; font-size: 0.8rem; color: #80868b; }
    </style>
  </head>
  <body>
    <main>
      <svg class="icon" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="2.5" />
        <path d="M24 13v14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="24" cy="33.5" r="1.8" fill="currentColor" />
      </svg>
      <h1>This site can’t be reached</h1>
      <p>The webpage at <strong>${safeHost}</strong> is no longer available. The owner of this website has removed it.</p>
      <p class="try">Try:</p>
      <ul>
        <li>Checking the web address</li>
        <li>Reloading the page</li>
        <li>Checking your internet connection</li>
      </ul>
      <code>ERR_CONNECTION_CLOSED</code>
    </main>
  </body>
</html>`;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "this site";
  return new NextResponse(unavailablePage(host), {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)",
  ],
};
