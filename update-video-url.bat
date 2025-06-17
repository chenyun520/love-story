@echo off
echo 更新视频URL并推送到网站...
echo.

set "GIT_EXE=D:\新建文件夹\网站项目\Git\bin\git.exe"

echo 请注意：运行此脚本前，请确保已在 js/videos.js 中更新了云存储URL
echo.
pause

echo 添加更改到Git...
"%GIT_EXE%" add .

echo 提交更改...
"%GIT_EXE%" commit -m "更新舟山出游视频为云存储链接"

echo 推送到远程仓库...
"%GIT_EXE%" push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 成功！视频URL已更新到网站
    echo.
    echo 请访问 https://cherishbloom.top/#videos 查看效果
    echo 点击"旅行记录"标签即可看到舟山出游视频
) else (
    echo.
    echo ❌ 推送失败，请检查网络连接和Git配置
)

echo.
pause 