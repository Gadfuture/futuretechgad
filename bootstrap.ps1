$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host ""
  Write-Host "== $message ==" -ForegroundColor Cyan
}

function Test-Command($name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Step "FUTURETECHGAD bootstrap starting"

if (-not (Test-Command "node")) {
  throw "Node.js is not installed. Install Node.js first, then run this script again."
}

if (-not (Test-Command "npm")) {
  throw "npm is not available. Install Node.js first, then run this script again."
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Project root: $projectRoot"

if (-not (Test-Path ".env.local")) {
  if (Test-Path ".env.example") {
    Write-Step "Creating .env.local from .env.example"
    Copy-Item ".env.example" ".env.local"
  } else {
    throw ".env.example was not found, so .env.local could not be created."
  }
}

$envContent = Get-Content ".env.local" -Raw
$missingKeys = @()

if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=\s*$") {
  $missingKeys += "NEXT_PUBLIC_SUPABASE_URL"
}

if ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=\s*$") {
  $missingKeys += "NEXT_PUBLIC_SUPABASE_ANON_KEY"
}

if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=\s*$") {
  $missingKeys += "SUPABASE_SERVICE_ROLE_KEY"
}

if ($missingKeys.Count -gt 0) {
  Write-Step "Environment setup needed"
  Write-Host ".env.local exists, but these keys are still empty:" -ForegroundColor Yellow
  $missingKeys | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
  Write-Host ""
  Write-Host "Fill them in from Supabase Project Settings > API, then run this script again."
  exit 1
}

Write-Step "Installing dependencies"
npm install

Write-Step "Build verification"
npm run build

Write-Step "Starting local development server"
Write-Host "Open http://localhost:3000 after the server starts." -ForegroundColor Green
npm run dev
