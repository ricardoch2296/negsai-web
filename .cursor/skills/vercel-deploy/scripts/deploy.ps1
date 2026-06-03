# Negsai — deploy vía Git (main=prod, develop=preview)
# Uso: .\deploy.ps1 -Target prod | dev [-Message "commit msg"]

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("prod", "dev")]
    [string]$Target,

    [string]$Message = "",

    [switch]$AllowDirty,

    [switch]$SkipVercelCli,

    [switch]$NoMerge
)

$ErrorActionPreference = "Stop"

$branchProd = "main"
$branchDev = "develop"

function Find-ProjectRoot {
    $dir = Get-Location
    while ($dir) {
        if (Test-Path (Join-Path $dir.Path "package.json")) {
            return $dir.Path
        }
        $parent = Split-Path $dir.Path -Parent
        if (-not $parent -or $parent -eq $dir.Path) { break }
        $dir = Get-Item $parent
    }
    throw "No se encontró package.json. Ejecuta desde la raíz del proyecto Next.js."
}

function Maybe-Commit {
    param([string]$Msg, [switch]$Allow)
    $status = git status --porcelain
    if (-not $status) { return }
    if (-not $Msg -and -not $Allow) {
        Write-Error "Hay cambios sin commitear. Usa -Message 'descripción' o commitea antes."
    }
    if ($Msg) {
        git add -A
        git commit -m $Msg
        Write-Host "Commit: $Msg"
    }
}

function Ensure-BranchExists {
    param([string]$Branch, [string]$From)
    $exists = git rev-parse --verify $Branch 2>$null
    if (-not $exists) {
        Write-Host "Creando rama '$Branch' desde $From..."
        git branch $Branch $From
    }
}

function Merge-IfNeeded {
    param([string]$Source, [string]$Into)
    if ($NoMerge -or $Source -eq $Into) { return }
    Write-Host "Merge $Source -> $Into"
    git merge $Source --no-edit
}

function Push-Branch {
    param([string]$Branch)
    try {
        git pull origin $Branch --ff-only
    } catch {
        Write-Host "Nota: pull ff-only no aplicable (rama nueva o divergente)."
    }
    git push -u origin $Branch
    Write-Host "Push OK: origin/$Branch"
}

function Invoke-VercelProdIfLinked {
    if ($SkipVercelCli) { return }
    if (-not (Test-Path ".vercel/project.json")) { return }
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) { return }
    Write-Host "vercel --prod --yes..."
    vercel --prod --yes
}

Set-Location (Find-ProjectRoot)

$expectedEmail = "ricardochaves40@gmail.com"
$gitEmail = git config user.email
if ($gitEmail -ne $expectedEmail) {
    Write-Host "Configurando git user.email -> $expectedEmail (era: $gitEmail)"
    git config user.email $expectedEmail
    git config user.name "Ricardo Chaves"
}

Write-Host "=== Negsai deploy ($Target) ==="
Write-Host "Dir: $(Get-Location)"
Write-Host "Autor commits: $(git config user.name) <$(git config user.email)>"

$source = git branch --show-current
if (-not $source) { throw "No estás en una rama git." }

Maybe-Commit -Msg $Message -Allow:$AllowDirty

$targetBranch = if ($Target -eq "prod") { $branchProd } else { $branchDev }
Ensure-BranchExists -Branch $targetBranch -From $source

git checkout $targetBranch
Merge-IfNeeded -Source $source -Into $targetBranch

# En prod, integrar develop si existe y no es no-merge
if ($Target -eq "prod" -and -not $NoMerge) {
    $hasDevelop = git rev-parse --verify $branchDev 2>$null
    if ($hasDevelop -and $source -ne $branchDev) {
        Merge-IfNeeded -Source $branchDev -Into $branchProd
    }
}

Push-Branch -Branch $targetBranch

if ($Target -eq "prod") {
    Invoke-VercelProdIfLinked
    Write-Host "`n[PROD] Rama main → Vercel Production (negsai.com)"
} else {
    Write-Host "`n[PREVIEW] Rama develop → Vercel Preview"
}

Write-Host "Listo."
