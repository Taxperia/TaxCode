@echo off
setlocal

title Code - OSS VDS

pushd %~dp0\..

if "%VSCODE_SKIP_PRELAUNCH%"=="" (
	node build/lib/preLaunch.ts
)

set "VDS_ROOT=%CD%\.vds-profile"
set "VDS_HOME=%VDS_ROOT%\home"
set "VDS_USER_DATA=%VDS_ROOT%\data"
set "VDS_EXTENSIONS=%VDS_ROOT%\extensions"
set "VDS_BUILTIN=%VDS_ROOT%\builtin-empty"
set "VDS_CONTROL=%VDS_HOME%\.vscode-oss-dev\extensions"

if not exist "%VDS_HOME%" mkdir "%VDS_HOME%"
if not exist "%VDS_USER_DATA%" mkdir "%VDS_USER_DATA%"
if not exist "%VDS_EXTENSIONS%" mkdir "%VDS_EXTENSIONS%"
if not exist "%VDS_BUILTIN%" mkdir "%VDS_BUILTIN%"
if not exist "%VDS_CONTROL%" mkdir "%VDS_CONTROL%"

set "USERPROFILE=%VDS_HOME%"
set "HOME=%VDS_HOME%"

set "NAMESHORT="
for /f "tokens=2 delims=:," %%a in ('findstr /R /C:"\"nameShort\":.*" product.json') do if not defined NAMESHORT set "NAMESHORT=%%~a"
set NAMESHORT=%NAMESHORT: "=%
set NAMESHORT=%NAMESHORT:"=%.exe
set CODE=".build\electron\%NAMESHORT%"

set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set VSCODE_DEV_DISABLE_DEBUG_PORTS=1
set ELECTRON_RUN_AS_NODE=
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1

if "%~1"=="" (
	%CODE% . --user-data-dir="%VDS_USER_DATA%" --extensions-dir="%VDS_EXTENSIONS%" --builtin-extensions-dir="%VDS_BUILTIN%" --disable-telemetry --disable-updates --disable-crash-reporter --disable-workspace-trust --disable-experiments --skip-welcome --skip-release-notes --disable-gpu --skip-add-to-recently-opened --new-window
) else (
	%CODE% . --user-data-dir="%VDS_USER_DATA%" --extensions-dir="%VDS_EXTENSIONS%" --builtin-extensions-dir="%VDS_BUILTIN%" --disable-telemetry --disable-updates --disable-crash-reporter --disable-workspace-trust --disable-experiments --skip-welcome --skip-release-notes --disable-gpu --skip-add-to-recently-opened %*
)

popd
endlocal
