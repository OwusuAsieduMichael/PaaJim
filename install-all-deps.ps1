# FoodHub - Install All Dependencies
# PowerShell script to install npm dependencies for all frontend apps

Write-Host "📦 Installing FoodHub Dependencies..." -ForegroundColor Green
Write-Host ""

$apps = @(
    @{Name="Customer"; Path="frontend\customer"},
    @{Name="Vendor"; Path="frontend\vendor"},
    @{Name="Rider"; Path="frontend\rider"}
)

foreach ($app in $apps) {
    Write-Host "Installing dependencies for $($app.Name) App..." -ForegroundColor Cyan
    Write-Host "Location: $($app.Path)" -ForegroundColor Gray
    Write-Host ""
    
    $fullPath = Join-Path $PSScriptRoot $app.Path
    
    if (Test-Path $fullPath) {
        Push-Location $fullPath
        
        # Check if node_modules exists
        if (Test-Path "node_modules") {
            Write-Host "⚠️  node_modules already exists. Skipping..." -ForegroundColor Yellow
        } else {
            Write-Host "Running npm install..." -ForegroundColor White
            npm install
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $($app.Name) dependencies installed successfully!" -ForegroundColor Green
            } else {
                Write-Host "❌ Failed to install $($app.Name) dependencies" -ForegroundColor Red
            }
        }
        
        Pop-Location
    } else {
        Write-Host "❌ Directory not found: $fullPath" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: .\start-all-apps.ps1" -ForegroundColor Gray
Write-Host "   OR" -ForegroundColor Gray
Write-Host "2. Manually start each app:" -ForegroundColor Gray
Write-Host "   cd frontend\customer && npm run dev" -ForegroundColor Gray
Write-Host "   cd frontend\vendor && npm run dev" -ForegroundColor Gray
Write-Host "   cd frontend\rider && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
