# Comprueba .env.prod / .env.dev y muestra qué falta en Vercel.
# La CLI `vercel env add` suele colgar en terminales automatizados; usa el panel web.
#
# Uso:
#   .\scripts\sync-vercel-env.ps1 -Target prod
#   .\scripts\sync-vercel-env.ps1 -Target dev
#   .\scripts\sync-vercel-env.ps1 -Target prod -Apply   # un solo var (prueba manual)

param(
    [ValidateSet("prod", "dev")]
    [string] $Target = "prod",
    [switch] $Apply
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.$Target"
$vercelEnv = if ($Target -eq "prod") { "production" } else { "preview" }
$panel = "https://vercel.com/ricardos-projects-dcafb79e/negsai-web/settings/environment-variables"

if (-not (Test-Path $envFile)) {
    Write-Error "No existe $envFile"
}

$fromFile = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $eq = $_.IndexOf('=')
    $n = $_.Substring(0, $eq).Trim()
    $v = $_.Substring($eq + 1).Trim()
    if ($v) { $fromFile[$n] = $v }
}

Write-Host ""
Write-Host "Variables en .env.$Target → entorno Vercel: $vercelEnv" -ForegroundColor Cyan
Write-Host "Panel (añadir a mano, ~2 min): $panel" -ForegroundColor Gray
Write-Host ""

foreach ($name in $fromFile.Keys) {
    $masked = if ($name -match 'KEY|SECRET|TOKEN') { '(secreto — copiar del .env)' } else { $fromFile[$name] }
    Write-Host "  $name = $masked"
}

Write-Host ""
Write-Host "En Vercel, marca el entorno: $(if ($Target -eq 'prod') { 'Production' } else { 'Preview' })." -ForegroundColor Yellow
Write-Host "Después: Redeploy del último deployment." -ForegroundColor Yellow

if ($Apply) {
    $first = ($fromFile.Keys | Select-Object -First 1)
    if (-not $first) { return }
    Write-Host ""
    Write-Host "Probando UN solo env add ($first)..." -ForegroundColor DarkCyan
    $val = $fromFile[$first]
    & vercel env add $first $vercelEnv --value $val --yes --force --non-interactive
}
