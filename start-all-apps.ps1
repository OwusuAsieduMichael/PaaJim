# FoodHub - Start All Applications
# PowerShell script to start all frontend apps in separate windows

Write-Host "🚀 Starting FoodHub Applications..." -ForegroundColor Green
Write-Host ""

# Check if backend is running
$backendRunning = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "✅ Backend is already running on port 8080" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend is not running. Start it manually:" -ForegroundColor Yellow
    Write-Host "   cd backend && mvn spring-boot:run" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Starting frontend applications..." -ForegroundColor Cyan
Write-Host ""

# Start Customer App
Write-Host "📱 Starting Customer App (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend\customer'; Write-Host '🍽️  Customer App' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 2

# Start Vendor App
Write-Host "👨‍🍳 Starting Vendor App (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend\vendor'; Write-Host '🏪 Vendor App' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 2

# Start Rider App
Write-Host "🚴 Starting Rider App (port 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend\rider'; Write-Host '📦 Rider App' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ All applications are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Application URLs:" -ForegroundColor Yellow
Write-Host "   Customer: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Vendor:   http://localhost:3001" -ForegroundColor Gray
Write-Host "   Rider:    http://localhost:3002" -ForegroundColor Gray
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Please wait for all apps to compile..." -ForegroundColor Yellow
Write-Host "   Each app will open in a new PowerShell window" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tip: Keep all PowerShell windows open while developing" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
