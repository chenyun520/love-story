@echo off
echo 快速推送到网站...

set "GIT_EXE=D:\新建文件夹\网站项目\Git\bin\git.exe"

echo 提交更改...
"%GIT_EXE%" commit -m "Add Zhoushan video with LFS"

echo 推送到远程...
"%GIT_EXE%" push origin main

echo 完成！
pause 