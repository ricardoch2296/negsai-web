# Referencia: Vercel + GitHub (Negsai)

## Renombrar master → main (una vez)

```powershell
git branch -m master main
git push -u origin main
git push origin --delete master   # solo si master existía en remoto
```

## Crear develop desde main

```powershell
git checkout main
git checkout -b develop
git push -u origin develop
```

## Vercel — ramas

| Setting | Valor |
|---------|--------|
| Production Branch | `main` |
| Preview | Enabled (automático en push a `develop`) |

## URLs típicas

- Production: `https://negsai-web.vercel.app` o `https://negsai.com`
- Preview develop: `https://negsai-web-git-develop-<team>.vercel.app`

## Invocar la skill en Cursor

Escribe en el chat:

- `/vercel prod`
- `/vercel dev`

El agente debe leer esta skill y ejecutar `scripts/deploy.ps1`.
