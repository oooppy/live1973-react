#!/bin/bash

echo "🚀 开始部署 Live1973 React 前端..."

# 1. 构建React项目
echo "📦 构建React生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ React构建失败"
    exit 1
fi

echo "✅ React构建成功"

# 2. 复制构建文件到后端目录
echo "📁 复制构建文件到后端目录..."
rm -rf ../live1973-backend/react-build
cp -r build ../live1973-backend/react-build

if [ $? -ne 0 ]; then
    echo "❌ 复制文件失败"
    exit 1
fi

echo "✅ 文件复制成功"

# 3. 显示部署信息
echo ""
echo "🎉 部署完成！"
echo "📱 React前端已部署到后端服务器"
echo "🌐 访问地址: http://your-domain.com"
echo "🔧 API地址: http://your-domain.com/api"
echo "📱 Flutter备用: http://your-domain.com/flutter"
echo ""
echo "💡 下一步："
echo "   1. 将后端代码推送到服务器"
echo "   2. 重启后端服务"
echo "   3. 测试前端功能" 