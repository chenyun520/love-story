@echo off
echo Testing Git...

REM 尝试常见的Git路径
if exist "C:\Program Files\Git\bin\git.exe" (
    echo Found Git at: C:\Program Files\Git\bin\git.exe
    "C:\Program Files\Git\bin\git.exe" --version
    goto :end
)

if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    echo Found Git at: C:\Program Files (x86)\Git\bin\git.exe
    "C:\Program Files (x86)\Git\bin\git.exe" --version
    goto :end
)

echo Git not found in common locations
echo Please ensure Git is installed

:end
pause 