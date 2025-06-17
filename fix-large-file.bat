@echo off
echo ============================================
echo 正在从Git历史中删除大视频文件...
echo ============================================

cd /d "D:\新建文件夹\网站项目\love-story"

echo 步骤1: 使用BFG清理工具删除大文件...
"D:\新建文件夹\网站项目\Git\bin\git.exe" filter-branch --force --index-filter "\"D:\新建文件夹\网站项目\Git\bin\git.exe\" rm --cached --ignore-unmatch \"videos/舟山出游小记.mp4\"" --prune-empty --tag-name-filter cat -- --all

echo 步骤2: 强制垃圾回收...
"D:\新建文件夹\网站项目\Git\bin\git.exe" for-each-ref --format="delete %(refname)" refs/original | "D:\新建文件夹\网站项目\Git\bin\git.exe" update-ref --stdin
"D:\新建文件夹\网站项目\Git\bin\git.exe" reflog expire --expire=now --all
"D:\新建文件夹\网站项目\Git\bin\git.exe" gc --prune=now --aggressive

echo 步骤3: 强制推送到远程仓库...
"D:\新建文件夹\网站项目\Git\bin\git.exe" push origin --force --all

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo ✅ 大文件删除成功！现在可以正常部署了
    echo ============================================
) else (
    echo ============================================
    echo ❌ 删除失败，请检查网络连接
    echo ============================================
)

pause 