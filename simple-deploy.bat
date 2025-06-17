@echo off
echo ============================================
echo 简单部署方案：重新创建干净的仓库
echo ============================================

cd /d "D:\新建文件夹\网站项目\love-story"

echo 步骤1: 删除.git文件夹...
rmdir /s /q .git

echo 步骤2: 重新初始化Git仓库...
"D:\新建文件夹\网站项目\Git\bin\git.exe" init
"D:\新建文件夹\网站项目\Git\bin\git.exe" remote add origin https://github.com/chenyun520/love-story.git

echo 步骤3: 添加所有文件（排除大视频）...
"D:\新建文件夹\网站项目\Git\bin\git.exe" add .
"D:\新建文件夹\网站项目\Git\bin\git.exe" commit -m "重新部署：使用腾讯微云链接的舟山出游视频"

echo 步骤4: 强制推送到GitHub...
"D:\新建文件夹\网站项目\Git\bin\git.exe" push origin main --force

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo ✅ 部署成功！
    echo 网站地址: https://cherishbloom.top
    echo 视频已可在"旅行记录"分类中观看！
    echo ============================================
) else (
    echo ============================================
    echo ❌ 部署失败，请检查网络连接
    echo ============================================
)

pause 