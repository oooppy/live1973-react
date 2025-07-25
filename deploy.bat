@echo off
echo 🚀 开始部署 Live1973 React 前端...

REM 1. 构建React项目
echo 📦 构建React生产版本...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ React构建失败
    pause
    exit /b 1
)

echo ✅ React构建成功

REM 2. 复制构建文件到后端目录
echo 📁 复制构建文件到后端目录...
if exist "..\live1973-backend\react-build" (
    rmdir /s /q "..\live1973-backend\react-build"
)
xcopy "build" "..\live1973-backend\react-build" /e /i /y

if %errorlevel% neq 0 (
    echo ❌ 复制文件失败
    pause
    exit /b 1
)

echo ✅ 文件复制成功

REM 3. 显示部署信息
echo.
echo 🎉 部署完成！
echo 📱 React前端已部署到后端服务器
echo 🌐 访问地址: http://your-domain.com
echo 🔧 API地址: http://your-domain.com/api
echo 📱 Flutter备用: http://your-domain.com/flutter
echo.
echo 💡 下一步：
echo    1. 将后端代码推送到服务器
echo    2. 重启后端服务
echo    3. 测试前端功能
echo.
pause 