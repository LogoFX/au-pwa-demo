rem @echo off

cd ..\client
IF EXIST dist (
	..\devops\CleanRepo .\dist
)

IF %ERRORLEVEL% NEQ 0 GOTO EXIT

call au build --env prod
IF %ERRORLEVEL% NEQ 0 GOTO EXIT

cd dist
ftp -i -s:..\..\devops\publish-ftp.txt ftp.logismika.com
IF %ERRORLEVEL% NEQ 0 GOTO EXIT

cd ..\..\devops

:EXIT
exit /b %ERRORLEVEL%