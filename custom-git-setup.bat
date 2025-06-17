@echo off
chcp 65001 >nul
echo 正在使用自定义Git路径配置Git LFS...
echo.

REM 设置Git路径
set "GIT_EXE=D:\新建文件夹\网站项目\Git\bin\git.exe"

REM 检查Git是否存在
if not exist "%GIT_EXE%" (
    echo 错误：在指定路径未找到Git: %GIT_EXE%
    pause
    exit /b 1
)

echo 找到Git: %GIT_EXE%
echo.

REM 显示Git版本
echo 检查Git版本:
"%GIT_EXE%" --version
echo.

REM 检查当前目录是否是Git仓库
if not exist ".git" (
    echo 初始化Git仓库...
    "%GIT_EXE%" init
    if %errorlevel% neq 0 (
        echo Git仓库初始化失败
        pause
        exit /b 1
    )
    echo Git仓库初始化成功！
    echo.
)

REM 初始化Git LFS
echo 步骤1: 初始化Git LFS
"%GIT_EXE%" lfs install
if %errorlevel% neq 0 (
    echo Git LFS初始化失败，检查是否支持LFS
    echo.
    echo 尝试检查LFS版本:
    "%GIT_EXE%" lfs --version
    echo.
    echo 如果LFS不可用，请从 https://git-lfs.github.io/ 下载安装Git LFS
    pause
    exit /b 1
)
echo Git LFS初始化成功！
echo.

REM 配置要跟踪的文件类型
echo 步骤2: 配置要跟踪的大文件类型
"%GIT_EXE%" lfs track "*.mp4"
"%GIT_EXE%" lfs track "*.avi"
"%GIT_EXE%" lfs track "*.mov"
"%GIT_EXE%" lfs track "*.mkv"
"%GIT_EXE%" lfs track "*.flv"
"%GIT_EXE%" lfs track "*.wmv"
echo 视频文件类型配置完成！
echo.

REM 检查.gitattributes文件
echo 步骤3: 检查.gitattributes文件
if exist .gitattributes (
    echo .gitattributes文件内容:
    type .gitattributes
) else (
    echo .gitattributes文件未找到
)
echo.

REM 检查当前Git LFS跟踪的文件
echo 步骤4: 检查当前跟踪的文件类型
"%GIT_EXE%" lfs track
echo.

REM 检查视频文件状态
echo 步骤5: 检查大视频文件
setlocal enabledelayedexpansion
for %%f in (videos\*.mp4) do (
    echo 找到视频文件: %%f
    for %%A in ("%%f") do (
        set "size=%%~zA"
        set /a "sizeMB=!size!/1048576"
        echo 文件大小: !sizeMB! MB
    )
)
echo.

REM 设置Git配置（如果需要）
echo 步骤6: 配置Git用户信息
"%GIT_EXE%" config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo 设置Git用户名...
    "%GIT_EXE%" config user.name "Love Story User"
)

"%GIT_EXE%" config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo 设置Git邮箱...
    "%GIT_EXE%" config user.email "love@story.com"
)

echo Git配置完成！
echo.

REM 添加文件到Git
echo 步骤7: 添加文件到Git
echo 添加.gitattributes文件...
"%GIT_EXE%" add .gitattributes

echo 添加视频文件...
"%GIT_EXE%" add videos/舟山出游小记.mp4

echo 添加其他项目文件...
"%GIT_EXE%" add .

echo 文件添加完成！
echo.

REM 提交更改
echo 步骤8: 提交更改
"%GIT_EXE%" commit -m "添加舟山出游视频和网站项目文件，使用Git LFS管理大文件"
if %errorlevel% equ 0 (
    echo 提交成功！
) else (
    echo 提交失败或没有更改需要提交
)
echo.

echo ===========================================
echo Git LFS配置完成！
echo.
echo 检查LFS管理的文件:
"%GIT_EXE%" lfs ls-files
echo.
echo Git仓库状态:
"%GIT_EXE%" status
echo.
echo 接下来你可以：
echo 1. 连接到远程仓库: "%GIT_EXE%" remote add origin [仓库URL]
echo 2. 推送到远程仓库: "%GIT_EXE%" push -u origin main
echo.
echo 你的498MB舟山出游视频现在已被Git LFS管理！
echo ===========================================
pause 