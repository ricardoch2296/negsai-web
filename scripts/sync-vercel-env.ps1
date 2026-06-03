# Sincroniza .env.prod / .env.dev → Vercel (API REST).
# Sube variables faltantes o cuando el archivo .env cambió (valores distintos).
#
# Uso:
#   .\scripts\sync-vercel-env.ps1 -Target prod -Sync
#   .\scripts\sync-vercel-env.ps1 -Target dev -Sync
#   .\scripts\sync-vercel-env.ps1 -Target prod          # solo informe

param(
    [ValidateSet("prod", "dev")]
    [string] $Target = "prod",
    [switch] $Sync,
    [switch] $Force
)

$ErrorActionPreference = "Stop"

$ALLOWED = @(
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "TURNSTILE_SECRET_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "CONTACT_NOTIFY_EMAIL"
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $root ".env.$Target"
$vercelTarget = if ($Target -eq "prod") { "production" } else { "preview" }

if (-not (Test-Path $envFile)) {
    Write-Error "No existe $envFile"
}

function Get-VercelToken {
    if ($env:VERCEL_TOKEN) { return $env:VERCEL_TOKEN }
    $authPath = Join-Path $env:APPDATA "com.vercel.cli\Data\auth.json"
    if (-not (Test-Path $authPath)) {
        throw "Sin token Vercel. Ejecuta: vercel login"
    }
    return (Get-Content $authPath -Raw | ConvertFrom-Json).token
}

function Read-EnvFile {
    param([string]$Path)
    $map = @{}
    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
        $eq = $_.IndexOf('=')
        $n = $_.Substring(0, $eq).Trim()
        $v = $_.Substring($eq + 1).Trim()
        if ($n -and $v) { $map[$n] = $v }
    }
    return $map
}

function Get-EnvFileFingerprint {
    param([hashtable]$Map)
    ($ALLOWED | ForEach-Object { if ($Map[$_]) { "${_}=$($Map[$_])" } } | Sort-Object) -join "`n"
}

function Get-ProjectConfig {
    $pj = Join-Path $root ".vercel\project.json"
    if (-not (Test-Path $pj)) { throw "No hay .vercel/project.json. Ejecuta: vercel link" }
    return Get-Content $pj -Raw | ConvertFrom-Json
}

function Get-RemoteEnvs {
    param([string]$Token, [string]$ProjectId, [string]$TeamId)
    $uri = "https://api.vercel.com/v10/projects/$ProjectId/env?teamId=$TeamId"
    $h = @{ Authorization = "Bearer $Token" }
    return (Invoke-RestMethod -Uri $uri -Headers $h).envs
}

function Find-RemoteForKey {
    param($Envs, [string]$Key, [string]$Target)
    $Envs | Where-Object {
        $_.key -eq $Key -and $_.target -contains $Target
    } | Select-Object -First 1
}

function Set-RemoteEnv {
    param(
        [string]$Token,
        [string]$ProjectId,
        [string]$TeamId,
        [string]$Key,
        [string]$Value,
        [string]$Target,
        $Existing
    )
    $h = @{
        Authorization  = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    $teamQ = "teamId=$TeamId"
    if ($Existing) {
        $body = @{ value = $Value; target = @($Target) } | ConvertTo-Json -Compress
        $uri = "https://api.vercel.com/v10/projects/$ProjectId/env/$($Existing.id)?$teamQ"
        Invoke-RestMethod -Method PATCH -Uri $uri -Headers $h -Body $body | Out-Null
        return "actualizada"
    }
    $body = @{
        key    = $Key
        value  = $Value
        type   = "sensitive"
        target = @($Target)
    } | ConvertTo-Json -Compress
    $uri = "https://api.vercel.com/v10/projects/$ProjectId/env?$teamQ"
    Invoke-RestMethod -Method POST -Uri $uri -Headers $h -Body $body | Out-Null
    return "añadida"
}

$local = Read-EnvFile $envFile
$fingerprint = Get-EnvFileFingerprint $local
$hashDir = Join-Path $root ".vercel"
$hashFile = Join-Path $hashDir "env-fingerprint.$Target.txt"
$prevFingerprint = ""
if (Test-Path $hashFile) { $prevFingerprint = Get-Content $hashFile -Raw }
$fileChanged = $Force -or ($fingerprint -ne $prevFingerprint)

$cfg = Get-ProjectConfig
$token = Get-VercelToken
$remoteAll = Get-RemoteEnvs -Token $token -ProjectId $cfg.projectId -TeamId $cfg.orgId

Write-Host ""
Write-Host "Entorno Vercel: $vercelTarget  |  Archivo: .env.$Target" -ForegroundColor Cyan
if ($fileChanged) {
    Write-Host "El .env cambió respecto al último sync → se revisan todas las claves." -ForegroundColor DarkYellow
}

$plan = @()
foreach ($key in $ALLOWED) {
    if (-not $local[$key]) { continue }
    $remote = Find-RemoteForKey -Envs $remoteAll -Key $key -Target $vercelTarget
    $action = "omitir"
    if (-not $remote) {
        $action = if ($Sync) { "añadir" } else { "falta" }
    } elseif ($fileChanged) {
        $action = if ($Sync) { "actualizar" } else { "cambió (archivo)" }
    }
    if ($action -ne "omitir") { $plan += [pscustomobject]@{ Key = $key; Action = $action } }
}

if (-not $plan) {
    Write-Host "Todo al día (mismas claves y mismo contenido del .env)." -ForegroundColor Green
} else {
    foreach ($p in $plan) {
        $label = switch ($p.Action) {
            "falta" { "FALTA en Vercel" }
            "cambió (archivo)" { "REVISAR (valor distinto en .env)" }
            default { $p.Action.ToUpper() }
        }
        Write-Host "  $($p.Key): $label"
    }
}

if (-not $Sync) {
    if ($plan) {
        Write-Host ""
        Write-Host "Ejecuta con -Sync para aplicar: .\scripts\sync-vercel-env.ps1 -Target $Target -Sync" -ForegroundColor Yellow
    }
    return
}

if (-not (Test-Path $hashDir)) { New-Item -ItemType Directory -Path $hashDir | Out-Null }

foreach ($key in $ALLOWED) {
    if (-not $local[$key]) { continue }
    $remote = Find-RemoteForKey -Envs $remoteAll -Key $key -Target $vercelTarget
    $needs = (-not $remote) -or $fileChanged
    if (-not $needs) { continue }
    $result = Set-RemoteEnv -Token $token -ProjectId $cfg.projectId -TeamId $cfg.orgId `
        -Key $key -Value $local[$key] -Target $vercelTarget -Existing $remote
    Write-Host "  OK $key ($result)" -ForegroundColor Green
}

Set-Content -Path $hashFile -Value $fingerprint -NoNewline
Write-Host ""
Write-Host "Variables sincronizadas. Redeploy en Vercel si ya hay un deployment activo." -ForegroundColor Green
