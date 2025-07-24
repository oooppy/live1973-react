# Live1973 Development Environment Firewall Rules Setup
# Must run as Administrator

Write-Host "Setting up Live1973 development firewall rules..." -ForegroundColor Green

try {
    # Add Node.js backend port rule
    New-NetFirewallRule -DisplayName "Live1973 Backend (3000)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
    Write-Host "[OK] Added backend port 3000 rule" -ForegroundColor Green

    # Add React frontend port rule
    New-NetFirewallRule -DisplayName "Live1973 Frontend (3001)" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
    Write-Host "[OK] Added frontend port 3001 rule" -ForegroundColor Green

    # Add Node.js program rule
    $nodePath = Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
    if ($nodePath) {
        New-NetFirewallRule -DisplayName "Node.js Live1973" -Direction Inbound -Program $nodePath -Action Allow
        Write-Host "[OK] Added Node.js program rule" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Node.js program path not found" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "[SUCCESS] Firewall rules setup completed!" -ForegroundColor Green
    Write-Host "[INFO] Mobile can now access: http://192.168.1.3:3001" -ForegroundColor Cyan
    Write-Host "[INFO] Backend API: http://192.168.1.3:3000" -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host "[ERROR] Failed to setup firewall rules: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "[INFO] Please run this script as Administrator" -ForegroundColor Yellow
}

Read-Host "Press any key to continue..." 