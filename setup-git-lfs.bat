@echo off
echo 正在配置Git LFS...
echo.

REM 初始化Git LFS
echo 步骤1: 初始化Git LFS
git lfs install
if %errorlevel% neq 0 (
    echo Git LFS安装失败，请确保已安装Git和Git LFS
    pause
    exit /b 1
)
echo Git LFS初始化成功！
echo.

REM 配置要跟踪的文件类型
echo 步骤2: 配置要跟踪的大文件类型
git lfs track "*.mp4"
git lfs track "*.avi"
git lfs track "*.mov"
git lfs track "*.mkv"
git lfs track "*.flv"
git lfs track "*.wmv"
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
git lfs track
echo.

REM 检查视频文件状态
echo 步骤5: 检查大视频文件
for %%f in (videos\*.mp4) do (
    echo 找到视频文件: %%f
    for %%A in ("%%f") do echo 文件大小: %%~zA 字节
)
echo.

echo 配置完成！现在你可以添加和提交文件了
echo.
echo 接下来执行以下命令:
echo   git add .gitattributes
echo   git add videos/舟山出游小记.mp4
echo   git commit -m "添加大视频文件使用Git LFS"
echo   git push
echo.
pause 