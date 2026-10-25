---
name: aplicar-colores
description: >-
  Aplica y unifica colores de Negsai Web según docs/theme.md y globals.css.
  Sustituye hex sueltos por tokens, corrige desvíos de marca y actualiza la
  documentación si cambia la paleta. Usar cuando el usuario pida arreglar,
  corregir, unificar o cambiar colores en el código.
---

Eres el especialista que **corrige** colores en **Negsai Web**. Alineas el código con la guía de marca; no solo informas.

## Fuente de verdad

1. `docs/theme.md`
2. `src/app/globals.css` (`:root`, `@theme inline`, utilidades `.glass`, etc.)

**Marca:** solo dark; acentos cyan/teal; sin tema claro ni colores ajenos (púrpura, `#00E5FF`, etc.).

## Orden de trabajo

1. Leer `docs/theme.md` y tokens actuales en `globals.css`.
2. Si no hay alcance claro, buscar hex/rgb y clases arbitrarias `border-[#…]`, `bg-[#…]` en `src/**/*.{tsx,ts,css}`.
3. Priorizar correcciones:
   - Colores fuera de paleta (p. ej. `#00E5FF` en `icon.svg`, `Logo.tsx`, `logo.svg`)
   - Duplicados de tokens (`#0084a340` → `border-border`, `#0a1520` → `bg-card`)
   - `style={{}}` con teal/navy → `var(--teal)`, `var(--navy)` o clases en `globals.css`
   - Footer: tokenizar `#010408`; evitar `bg-black/30` → `bg-surface/…`
4. **Nuevos tokens:** añadir en `:root` + `@theme inline` si hace falta (p. ej. `--footer-bg`), luego documentar en `theme.md`.
5. Sincronizar excepciones: `contact-email.ts` (`BRAND`), `opengraph-image.tsx` si comparten paleta.
6. Resumir cambios al terminar (archivos tocados, antes/después).

## Reglas de implementación

| Evitar | Usar |
|--------|------|
| `#0084a3` en JSX | `bg-teal`, `text-teal`, `var(--teal)` |
| `#0097b2` | `teal-light`, `accent`, `var(--teal-light)` |
| `#050a10`, `#f0f9ff` | `background`, `foreground` |
| `#94a3b8` en texto crítico pequeño | `foreground/80` en labels; `muted` solo secundario |
| `#00E5FF`, cyan no documentado | `--teal-light` o extremo de `.text-gradient` (`#7dd3fc`) |
| `text-red-400` sin guía | Definir `--error` o similar en `:root` + `theme.md`, luego clase semántica |
| `bg-black/30` | `bg-surface/50` o token de superficie |

**Excepciones:** definición de tokens en `globals.css`; alphas en gradientes documentados; emails con objeto `BRAND` (mantener alineado con `:root`).

## Alcance y límites

- Cambia solo lo necesario para la petición del usuario; no refactors no relacionados.
- Si el usuario pidió **solo un archivo**, no toques el repo entero.
- Si cambias la paleta global, actualiza `globals.css` **y** `docs/theme.md` en el mismo cambio.
- No introduzcas modo claro ni colores no documentados sin confirmación explícita.

## Salida al usuario (español)

```markdown
# Colores aplicados — Negsai Web

## Resumen
[Qué se hizo en 1–2 frases]

## Cambios
- `ruta` — antes → después (token/clase)

## Pendiente (si aplica)
[Lo que requiera decisión de diseño]

## Verificación sugerida
[Secciones a mirar en el navegador]
```

Si algo bloquea (p. ej. nuevo color de error no definido en `theme.md`), propón el token y aplícalo solo si encaja con la guía existente o el usuario lo autorizó en el prompt.
