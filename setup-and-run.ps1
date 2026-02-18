# ================================================================
#  Health Insurance App — Full Setup & Run Script
# ================================================================
#  This script installs ALL dependencies and starts everything.
#  Run once after cloning:
#
#    powershell -ExecutionPolicy Bypass -File .\setup-and-run.ps1
#
#  Prerequisites (must be installed on your machine):
#    1. Node.js  (v18+)   — https://nodejs.org
#    2. Python   (3.9+)   — https://python.org
#    3. Docker Desktop     — https://docker.com  (for MySQL)
#
#  Default Accounts (after setup):
#    Admin:  admin@healthinsure.com / admin123
#    User:   user@healthinsure.com  / user123
# ================================================================

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Write-Step($step, $msg) {
    Write-Host "`n[$step] $msg" -ForegroundColor Yellow
}
function Write-Ok($msg) {
    Write-Host "  ✓ $msg" -ForegroundColor Green
}
function Write-Err($msg) {
    Write-Host "  ✗ $msg" -ForegroundColor Red
}
function Write-Info($msg) {
    Write-Host "  → $msg" -ForegroundColor DarkGray
}

Clear-Host
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Health Insurance App — Setup & Run" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------------
# STEP 1 — Check prerequisites
# ---------------------------------------------------------------
Write-Step "1/6" "Checking prerequisites..."

$missing = @()

# Node.js
try {
    $nodeVer = (node --version 2>$null)
    Write-Ok "Node.js $nodeVer"
} catch { $missing += "Node.js (https://nodejs.org)" }
if (-not $nodeVer) { $missing += "Node.js (https://nodejs.org)" }

# npm
try {
    $npmVer = (npm --version 2>$null)
    Write-Ok "npm v$npmVer"
} catch { $missing += "npm" }

# Python
$pythonCmd = $null
try {
    $pyVer = (python --version 2>$null)
    if ($pyVer) { $pythonCmd = "python"; Write-Ok "$pyVer" }
} catch {}
if (-not $pythonCmd) {
    try {
        $pyVer = (python3 --version 2>$null)
        if ($pyVer) { $pythonCmd = "python3"; Write-Ok "$pyVer" }
    } catch {}
}
if (-not $pythonCmd) { $missing += "Python 3.9+ (https://python.org)" }

# pip
try {
    $pipVer = (pip --version 2>$null)
    Write-Ok "pip found"
} catch { $missing += "pip (comes with Python)" }

# Docker
$dockerAvailable = $false
try {
    $dockerVer = (docker --version 2>$null)
    if ($dockerVer) { $dockerAvailable = $true; Write-Ok "Docker — $dockerVer" }
} catch {}
if (-not $dockerAvailable) {
    Write-Info "Docker not found — MySQL must be running manually on localhost:3306"
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Err "Missing required tools:"
    foreach ($m in $missing) { Write-Host "    • $m" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Install the above and re-run this script." -ForegroundColor Yellow
    exit 1
}

# ---------------------------------------------------------------
# STEP 2 — Setup MySQL via Docker
# ---------------------------------------------------------------
Write-Step "2/6" "Setting up MySQL database..."

if ($dockerAvailable) {
    # Check if container already exists
    $existing = docker ps -a --filter "name=hi-mysql" --format "{{.Names}}" 2>$null
    if ($existing -eq "hi-mysql") {
        $running = docker ps --filter "name=hi-mysql" --format "{{.Names}}" 2>$null
        if ($running -eq "hi-mysql") {
            Write-Ok "MySQL container 'hi-mysql' is already running"
        } else {
            Write-Info "Starting existing MySQL container..."
            docker start hi-mysql | Out-Null
            Write-Ok "MySQL container started"
        }
    } else {
        Write-Info "Creating MySQL container (hi-mysql) on port 3306..."
        docker run -d `
            --name hi-mysql `
            -e MYSQL_ROOT_PASSWORD=rootpassword `
            -e MYSQL_DATABASE=health_insurance `
            -p 3306:3306 `
            -v "${ROOT}/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql" `
            mysql:8.0 | Out-Null
        Write-Ok "MySQL container created — database will initialize automatically"
    }

    # Wait for MySQL to be ready
    Write-Info "Waiting for MySQL to be ready (this may take 15-30s on first run)..."
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $result = docker exec hi-mysql mysqladmin ping -u root -prootpassword 2>$null
            if ($result -match "alive") { $ready = $true; break }
        } catch {}
        Start-Sleep -Seconds 2
    }
    if ($ready) {
        Write-Ok "MySQL is ready"
    } else {
        Write-Info "MySQL is still initializing — it will be ready shortly"
    }
} else {
    Write-Info "Skipping Docker MySQL — ensure MySQL is running on localhost:3306"
    Write-Info "Database: health_insurance | User: root | Password: rootpassword"
    Write-Info "Run database/schema.sql manually to initialize the database"
}

# ---------------------------------------------------------------
# STEP 3 — Setup server .env file
# ---------------------------------------------------------------
Write-Step "3/6" "Configuring environment..."

$envPath = Join-Path $ROOT "server\.env"
if (-not (Test-Path $envPath)) {
    $envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=health_insurance
JWT_SECRET=super_secret_jwt_key_2024
ML_SERVICE_URL=http://localhost:8000
PORT=5001
"@
    Set-Content -Path $envPath -Value $envContent
    Write-Ok "Created server/.env"
} else {
    Write-Ok "server/.env already exists"
}

# ---------------------------------------------------------------
# STEP 4 — Install Python dependencies (ML service)
# ---------------------------------------------------------------
Write-Step "4/6" "Installing ML service dependencies..."

Push-Location (Join-Path $ROOT "ml-service")
try {
    & $pythonCmd -m pip install -r requirements.txt --quiet 2>$null
    Write-Ok "Python packages installed"
} catch {
    Write-Err "Failed to install Python packages — check requirements.txt"
}
Pop-Location

# ---------------------------------------------------------------
# STEP 5 — Install Node.js dependencies (server + client)
# ---------------------------------------------------------------
Write-Step "5/6" "Installing Node.js dependencies..."

# Server
Write-Info "Installing server dependencies..."
Push-Location (Join-Path $ROOT "server")
if (-not (Test-Path "node_modules")) {
    npm install --silent 2>$null
}
Write-Ok "Server packages ready"
Pop-Location

# Client
Write-Info "Installing client dependencies..."
Push-Location (Join-Path $ROOT "client")
if (-not (Test-Path "node_modules")) {
    npm install --silent 2>$null
}
Write-Ok "Client packages ready"
Pop-Location

# ---------------------------------------------------------------
# STEP 6 — Launch all services
# ---------------------------------------------------------------
Write-Step "6/6" "Launching all services..."

# ML Service (Python/FastAPI on port 8000)
Write-Info "Starting ML Service on port 8000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$host.UI.RawUI.WindowTitle = 'ML Service (8000)';
    Set-Location '$ROOT\ml-service';
    Write-Host '=== ML Service (port 8000) ===' -ForegroundColor Green;
    Write-Host 'Docs: http://localhost:8000/docs' -ForegroundColor DarkGray;
    Write-Host '';
    $pythonCmd -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
" -WindowStyle Normal

# Backend Server (Node/Express on port 5001)
Write-Info "Starting Backend Server on port 5001..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$host.UI.RawUI.WindowTitle = 'Backend Server (5001)';
    Set-Location '$ROOT\server';
    Write-Host '=== Backend Server (port 5001) ===' -ForegroundColor Green;
    Write-Host '';
    npm run dev
" -WindowStyle Normal

# Frontend Client (Vite/React on port 3000)
Write-Info "Starting Frontend Client on port 3000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$host.UI.RawUI.WindowTitle = 'Frontend Client (3000)';
    Set-Location '$ROOT\client';
    Write-Host '=== Frontend Client (port 3000) ===' -ForegroundColor Green;
    Write-Host '';
    npm run dev
" -WindowStyle Normal

# Give services a moment to boot
Start-Sleep -Seconds 2

# ---------------------------------------------------------------
# Done!
# ---------------------------------------------------------------
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete — All Services Running!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend  →  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend   →  http://localhost:5001" -ForegroundColor White
Write-Host "  ML API    →  http://localhost:8000" -ForegroundColor White
Write-Host "  ML Docs   →  http://localhost:8000/docs" -ForegroundColor White
Write-Host "  MySQL     →  localhost:3306" -ForegroundColor White
Write-Host ""
Write-Host "  Default Accounts:" -ForegroundColor DarkGray
Write-Host "    Admin →  admin@healthinsure.com / admin123" -ForegroundColor DarkGray
Write-Host "    User  →  user@healthinsure.com  / user123" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Close the 3 spawned terminal windows to stop services." -ForegroundColor DarkGray
Write-Host "================================================================" -ForegroundColor Cyan
