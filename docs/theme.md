# Tema visual — Negsai Web

Guía de diseño del sitio corporativo. La fuente de verdad en código es [`src/app/globals.css`](../src/app/globals.css).

## Identidad

- **Estilo:** tecnológico, oscuro, premium; acentos cyan/teal alineados al logo.
- **Modo:** solo dark (sin tema claro).
- **Público:** B2B, Ecuador y Latinoamérica.

---

## Paleta de color

### Base

| Nombre | CSS variable | Hex | Uso |
|--------|--------------|-----|-----|
| Background | `--background` | `#050a10` | Fondo de página |
| Foreground | `--foreground` | `#f0f9ff` | Texto principal |
| Surface | `--surface` | `#070f18` | Bloques de sección alternos |
| Muted | `--muted` | `#94a3b8` | Texto secundario, labels |

### Marca (cyan / teal)

| Nombre | CSS variable | Hex | Uso |
|--------|--------------|-----|-----|
| Navy | `--navy` | `#004b67` | Profundidad, gradientes de fondo |
| Teal | `--teal` | `#0084a3` | Botones primarios, CTAs |
| Teal light | `--teal-light` | `#0097b2` | Hover, enlaces activos, iconos |
| Accent | `--accent` | `#0097b2` | Selección de texto, acentos UI |
| Accent soft | `--accent-soft` | `#0084a3` | Alias de teal (reservado) |

### Superficies y bordes

| Nombre | CSS variable | Valor | Uso |
|--------|--------------|-------|-----|
| Card | `--card` | `#0a1520` @ 80% | Tarjetas `.glass` |
| Glass soft | — | `#0a1520` @ 60% | Formularios, paneles suaves |
| Border | `--border` | `#0084a3` @ 25% | Bordes de cards, inputs, header |
| Accent dim | `--accent-dim` | `#0097b2` @ 13% | Glows y sombras suaves |

### Footer

| Uso | Valor |
|-----|--------|
| Fondo | `#010408` |
| Borde superior | `teal-light` @ 30% |
| Sombra | `rgba(0, 151, 178, 0.08)` |

### Gradientes y efectos

| Clase / elemento | Colores |
|------------------|---------|
| `.organic-bg` | `#0084a3` @ 9%, `#004b67` @ 12% sobre background |
| `.text-gradient` | `#7dd3fc` → `#0097b2` → `#e2e8f0` |
| `.glow-accent` | `--accent-dim` + `#0084a3` @ 6% |
| Focus input | borde `#0097b2`, halo `#0097b218` |

### Resumen para diseño (Figma / logo)

```
Primario oscuro:  #050a10
Teal marca:       #0084a3
Teal claro:       #0097b2
Navy:             #004b67
Texto:            #f0f9ff
Texto muted:      #94a3b8
```

---

## Tipografía

| Rol | Familia | Variable | Pesos |
|-----|---------|----------|-------|
| Cuerpo | Inter | `--font-inter` | 400 (default) |
| Títulos / display | Rajdhani | `--font-rajdhani` | 500, 600, 700 |

**Clases Tailwind**

- Cuerpo: por defecto en `body`
- Display: `font-display` (títulos, nav, botones en mayúsculas)

**Convenciones**

- Títulos de sección: `uppercase`, `tracking-wide`
- Botones y nav: `uppercase`, `tracking-wider` / `tracking-wide`

---

## Radios y forma

| Token | Valor | Uso típico |
|-------|-------|------------|
| `--radius-sm` | `0.75rem` (12px) | Elementos pequeños |
| `--radius-md` | `1.25rem` (20px) | Inputs (`.input-field`) |
| `--radius-lg` | `1.75rem` (28px) | Cards `.glass` |
| `--radius-xl` | `2.25rem` (36px) | Tarjetas grandes, header flotante |
| `--radius-pill` | `9999px` | Botones (`rounded-full`) |

En Tailwind v4 también: `--radius-soft` → md, `--radius-curve` → lg.

---

## Componentes UI (patrones)

### Botón (`Button.tsx`)

| Variante | Fondo | Borde | Texto |
|----------|-------|-------|-------|
| `primary` | `teal` | `teal-light/30` | `foreground` |
| `secondary` | transparente | `border` | `foreground` → hover `teal-light` |
| `ghost` | — | — | `muted` → hover `teal-light` |

Forma: `rounded-full`, `px-7 py-3`, `text-sm uppercase`.

### Tarjetas

- **`.glass`:** fondo card, blur 14px, borde `--border`, radio lg.
- **`.glass-soft`:** fondo más translúcido, blur 12px, radio xl.

### Inputs (`.input-field`)

- Fondo: `background`
- Borde: `border`; focus: `teal-light` + ring `#0097b218`

### Navegación

- Enlace inactivo: `text-muted`
- Hover / activo: `text-teal-light`, activo `font-semibold`

---

## Espaciado de secciones

Patrón habitual en home:

- Secciones: `py-8 md:py-10`
- Contenedor: `max-w-6xl mx-auto px-4 md:px-6`
- Artículos legales / detalle: `max-w-4xl`, `pt-28` bajo header fijo

---

## Assets de marca

| Archivo | Ruta |
|---------|------|
| Logo oficial | `public/assets/logo-negsai.png` |
| Logo fallback | `public/assets/logo.svg` |
| Favicon | `src/app/icon.svg` |

Componente: `src/components/brand/Logo.tsx`.

---

## Tailwind — clases de color

Mapeo desde `@theme inline` en `globals.css`:

```
bg-background    text-foreground
bg-surface       bg-card
bg-teal          bg-teal-light (hover)
text-muted       text-teal-light
border-border
```

---

## Accesibilidad

- `prefers-reduced-motion`: animaciones y transiciones mínimas (`globals.css`).
- Scroll suave desactivado si el usuario lo prefiere.
- Contraste: texto claro sobre fondos oscuros; acentos en `teal-light` para enlaces.

---

## Mantenimiento

Al cambiar colores:

1. Editar variables en `:root` de `globals.css`.
2. Revisar gradientes y valores hex sueltos en el mismo archivo y en componentes (p. ej. `Footer.tsx`).
3. Actualizar este documento si la paleta cambia de forma relevante.
