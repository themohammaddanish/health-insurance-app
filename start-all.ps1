# ============================================
# Health Insurance App - Start All Services
# ============================================
# Launches: ML Service (8000), Backend (5001), Frontend (3000)
# Prerequisites: Node.js, Python, MySQL running on localhost
# ============================================

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Health Insurance App - Starting Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# --- 1. ML Service (Python/FastAPI on port 8000) ---
Write-Host "`n[1/3] Starting ML Service (port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Set-Location '$ROOT\ml-service';
    Write-Host '=== ML Service (port 8000) ===' -ForegroundColor Green;
    pip install -r requirements.txt --quiet 2>`$null;
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
" -WindowStyle Normal

# --- 2. Backend Server (Node/Express on port 5001) ---
Write-Host "[2/3] Starting Backend Server (port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Set-Location '$ROOT\server';
    Write-Host '=== Backend Server (port 5001) ===' -ForegroundColor Green;
    if (-not (Test-Path 'node_modules')) { npm install };
    npm run dev
" -WindowStyle Normal

# --- 3. Frontend Client (Vite/React on port 3000) ---
Write-Host "[3/3] Starting Frontend Client (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Set-Location '$ROOT\client';
    Write-Host '=== Frontend Client (port 3000) ===' -ForegroundColor Green;
    if (-not (Test-Path 'node_modules')) { npm install };
    npm run dev
" -WindowStyle Normal

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  All services launched!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend :  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend  :  http://localhost:5001" -ForegroundColor White
Write-Host "  ML API   :  http://localhost:8000" -ForegroundColor White
Write-Host "  ML Docs  :  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Close the 3 spawned terminal windows to stop all services." -ForegroundColor DarkGray
