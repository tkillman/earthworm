@rem this is node_version.bat

REM --add the following to the top of your bat file--


@echo off

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"=""
    echo UAC.ShellExecute "cmd.exe", "/c %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------


echo node_version.bat start

echo .nvmrc read start

if exist ".nvmrc" (
    echo .nvmrc is exist
    set /p NODE_VERSION=< .nvmrc
) else (
    echo .nvmrc is not exist
    set NODE_VERSION="14.15.4"
)

echo NODE_VERSION is %NODE_VERSION%

echo .nvmrc read end

echo nvm start

nvm install %NODE_VERSION%

nvm use %NODE_VERSION%

echo nvm end

echo node_version.bat end