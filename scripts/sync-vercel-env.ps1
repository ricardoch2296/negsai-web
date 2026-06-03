# Sincroniza .env.prod o .env.dev → Vercel (CLI).
# Uso:
#   .\scripts\sync-vercel-env.ps1 -Target prod
#   .\scripts\sync-vercel-env.ps1 -Target dev
# Requiere: vercel login, archivos con secretos rellenados (sin líneas vacías en claves obligatorias).

param(
    [ValidateSet("prod", "dev")]
    [string] $Target = "prod"
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.$Target"
if (-not (Test-Path $envFile)) {
    Write-Error "No existe $envFile"
}

$vercelEnv = if ($Target -eq "prod") { "production" } else { "preview" }

$lines = Get-Content $envFile | Where-Object {
    $_ -match '^\s*[^#]' -and $_ -match '='
}

Write-Host "Subiendo variables desde .env.$Target → Vercel ($vercelEnv)..." -ForegroundColor Cyan

foreach ($line in $lines) {
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { continue }
    $name = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host "  omitido (vacío): $name" -ForegroundColor DarkYellow
        continue
    }
    Write-Host "  + $name"
    vercel env add $name $vercelEnv --value $value --yes --force --non-interactive 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "  falló: $name (revisa vercel login)"
    }
}

Write-Host "Listo. Redeploy en Vercel para aplicar cambios." -ForegroundColor Green
