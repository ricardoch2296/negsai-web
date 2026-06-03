---
name: vercel-deploy
description: >-
  Deploy Negsai web to Vercel via Git branches (main=production, develop=preview).
  Use when the user says /vercel prod, /vercel dev, deploy to production, deploy
  to develop, preview deploy, or Vercel deployment for negsai-web.
---

# Vercel Deploy (Negsai)

## Comandos del usuario

| Comando | Rama | Entorno Vercel |
|---------|------|----------------|
| `/vercel prod` | `main` | **Production** (negsai.com) |
| `/vercel dev` | `develop` | **Preview** (URL `*.vercel.app`) |

Interpreta también frases equivalentes: "despliega a producción", "deploy preview", "sube a develop".

## Arquitectura esperada

```text
GitHub                         Vercel (negsai-web)
├── main      ───────────────► Production  → negsai.com
└── develop   ───────────────► Preview     → *-git-develop-*.vercel.app
```

**Regla:** no mezclar ramas. `prod` solo toca `main`; `dev` solo toca `develop`.

## Configuración única (Vercel Dashboard)

Si aún no está hecho, indicar al usuario:

1. Proyecto **negsai-web** → **Settings** → **Git**
2. Conectar repositorio GitHub
3. **Production Branch** = `main`
4. Activar **Preview Deployments** (rama `develop` y demás previews)

Variables de entorno: mismas en Production; en Preview copiar las necesarias (o subset sin secretos de prod si aplica).

## Configuración única (GitHub)

Ramas requeridas: `main`, `develop`.

Si el repo solo tiene `master`:

```powershell
git branch -m master main
git push -u origin main
git checkout -b develop
git push -u origin develop
```

## Autor de commits (obligatorio en este repo)

Vercel muestra el email del **commit de Git**, no el de la cuenta Vercel.

```powershell
git config user.email "ricardochaves40@gmail.com"
git config user.name "Ricardo Chaves"
```

No usar `rchaves@qhatu.org` en este proyecto. Comprobar con `git config user.email` antes de cada deploy.

## Flujo obligatorio al ejecutar la skill

1. **Directorio de trabajo:** raíz del proyecto Next.js (donde está `package.json` y `.vercel`).
2. **Leer el objetivo:** `prod` o `dev` según el comando del usuario.
3. **Ejecutar el script** (preferido en Windows):

```powershell
.\.cursor\skills\vercel-deploy\scripts\deploy.ps1 -Target prod
# o
.\.cursor\skills\vercel-deploy\scripts\deploy.ps1 -Target dev
```

4. Si el script falla, diagnosticar (git limpio, remote, login `vercel whoami`) y no forzar `--force`.
5. **Reportar al usuario:** rama pusheada, URL del último deploy (Vercel CLI o MCP `list_deployments` si está disponible).

### Qué hace el script

- Verifica que no haya cambios sin commitear (sale con error si los hay, salvo `-AllowDirty` no usado por defecto).
- Hace commit automático **solo si** el usuario pidió explícitamente incluir cambios en el mismo mensaje; si no, exige commit previo.
- `prod`: checkout `main` → pull → push `origin main`
- `dev`: checkout `develop` → pull → push `origin develop`
- Opcional tras push: `vercel --prod --yes` solo en `prod` si no hay Git deploy conectado (el script lo intenta si existe `.vercel`).

## Pasos manuales si el script no corre

### `/vercel prod`

```powershell
git status
git add -A && git commit -m "..."   # si hay cambios pendientes
git checkout main
git pull origin main
git push origin main
```

Vercel despliega Production al detectar push en `main`.

### `/vercel dev`

```powershell
git checkout develop
git pull origin develop
# merge main en develop si el usuario quiere sincronizar:
# git merge main
git push origin develop
```

Vercel crea/actualiza Preview para `develop`.

## Sincronizar código entre ramas

- Trabajo diario en `develop` → `/vercel dev` para probar en preview.
- Cuando esté listo para producción: merge `develop` → `main` (PR en GitHub recomendado), luego `/vercel prod` o push a `main`.

```powershell
git checkout main
git pull origin main
git merge develop
git push origin main
```

## Checklist post-deploy

- [ ] Build verde en Vercel (Deployments)
- [ ] `prod`: dominio `negsai.com` responde
- [ ] `dev`: abrir URL de preview del deployment
- [ ] Formulario/API: variables `SUPABASE_*`, `RESEND_*`, `TURNSTILE_*` en el entorno correcto

## Errores frecuentes

| Problema | Acción |
|----------|--------|
| Rama `main` no existe | Renombrar `master` → `main` o crear desde `develop` |
| Push rechazado | `git pull --rebase` antes de push |
| Deploy CLI vs Git duplicado | Preferir **solo Git** si el repo está conectado en Vercel |
| Cuenta Vercel incorrecta | `vercel logout` → `vercel login` |

## MCP Vercel (opcional)

Si `user-vercel-personal` está activo: `list_deployments` con `teamId` del equipo del usuario para confirmar URL y estado tras el push.
