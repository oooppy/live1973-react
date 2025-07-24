@echo off
echo Setting up Live1973 development firewall rules...

REM Add Node.js backend port rule
netsh advfirewall firewall add rule name="Live1973 Backend (3000)" dir=in action=allow protocol=TCP localport=3000
echo [OK] Added backend port 3000 rule

REM Add React frontend port rule
netsh advfirewall firewall add rule name="Live1973 Frontend (3001)" dir=in action=allow protocol=TCP localport=3001
echo [OK] Added frontend port 3001 rule

REM Add Node.js program rule
netsh advfirewall firewall add rule name="Node.js Live1973" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe"
echo [OK] Added Node.js program rule

echo.
echo [SUCCESS] Firewall rules setup completed!
echo [INFO] Mobile can now access: http://192.168.1.3:3001
echo [INFO] Backend API: http://192.168.1.3:3000
echo.
pause 