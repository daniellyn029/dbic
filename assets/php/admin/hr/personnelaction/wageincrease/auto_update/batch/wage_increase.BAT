@echo OFF
SETLOCAL ENABLEDELAYEDEXPANSION
title AUTO UPDATE 201 WAGE INCREASE
echo DELSAN BUSINESS INNOVATIONS CORP. Copyright(C) 2019
echo Date: %DATE:/=-% and Time:%TIME::=-% 
echo.
echo  .`````````````````````````````````````````````````````````````````````````.
echo `             ```````    ```````  `        ```````      ``      `      `  `
echo `        `-o/ shhhhhy+` /dhhhhhh`+h      `ohhhhhhh-    `yh.    :d+`    d/ `
echo `      ``/hd+ ys````-yy /d`````` oh      :d:``````     syyy`   :dyy-   d/ `
echo `   `.-hyo-y+ ys     -d-/d /+++/ oh      `ys+++++:`   oh.`hy`  :d`+h+` d/ `
echo ` ./ys:ddds-+ ys     :d./d ----- oh       `-----:ho  +d-//ods  :d  -yy-d/ `
echo ` /yds:dddy.+ yy----/ho /d------ oh-----.`-------yo /d:`:::/d+ :d   `ohd/ `
echo `  `-/:ddh:++ oyyysss:  :ysssssy`/ysssss+.ysssssso..s/      :y--y     :y- `
echo `     `--/sd+ ``````     ```````  ``````  ``````    `        `` `      `  `
echo `        .oh+ /--.`:-. /:.:`:-`/` - /:.:---`--`+ :`-`---:.-:  :-`---/`::  `
echo `          `. -.`- ..` ..`- ..`-  ` `.````. .````. ` ..```..  .. ..```` ` `
echo .`````````````````````````````````````````````````````````````````````````.
echo.
echo.
echo AUTO UPDATE 201 WAGE INCREASE
echo.
echo Do not close the command because the file is being executed...
echo.
CALL :BACKSPACE $BS
SET /A FULL_COUNT=75
SET /A MAX_COUNT=160
SET /A Spin_Delay=60
SET "_MSG=Importing Data..."
SET /A CTR=0
IF NOT [%1]==[] SET "_MSG=%~1"
IF NOT [%2]==[] SET /A FULL_COUNT=%2
IF NOT [%3]==[] SET /A SPIN_DELAY=%3
IF %FULL_COUNT% GTR %MAX_COUNT% SET /A FULL_COUNT=%MAX_COUNT%
<nul SET/P="%_MSG%*"
SET "SPINNER=³/Ä\"
FOR /L %%A IN (1,1,%FULL_COUNT%) DO (
  CALL :DELAY %SPIN_DELAY%
  <nul CALL SET/P="%$BS%%%SPINNER:~!CTR!,1%%"
  SET /A CTR=%%A %% 4
)
<nul SET/P="%$BS%*"
"C:\wamp64\bin\php\php7.2.10\php.exe"  C:\wamp64\www\hris\assets\php\admin\hr\personnelaction\wageincrease\auto_update\file\auto_update.php %* >>C:\wamp64\www\hris\assets\php\admin\hr\personnelaction\wageincrease\auto_update\logs\wage_increase_logs.txt

REM /p - specify the path name
REM /m - specify a pattern
REM /c - specify the command to be executed
REM /d - specify the date, /d -30 for 30 days before now!


ENDLOCAL & EXIT /B %CTR%

:BackSpace
setlocal
for /f %%a in ('"prompt $H&for %%b in (1) do rem"') do set "BS=%%a"
endlocal&call set %~1=%BS%&exit /b 0

:Delay msec
setlocal
set/a correct=0
set/a msecs=%1+5
if /i %msecs% leq 20 set /a correct-=2
set time1=%time: =%
set/a tsecs=%1/1000 2>nul
set/a msecs=(%msecs% %% 1000)/10
for /f "tokens=1-4 delims=:." %%a in ("%time1%") do (
  set hour1=%%a&set min1=%%b&set sec1=%%c&set "mil1=%%d"
)
if /i %hour1:~0,1% equ 0 if /i "%hour1:~1%" neq "" set hour1=%hour1:~1%
if /i %min1:~0,1% equ 0 set min1=%min1:~1% 
if /i %sec1:~0,1% equ 0 set sec1=%sec1:~1%
if /i %mil1:~0,1% equ 0 set mil1=%mil1:~1% 
set/a sec1+=(%hour1%*3600)+(%min1%*60)
set/a msecs+=%mil1%
set/a tsecs+=(%sec1%+%msecs%/100)
set/a msecs=%msecs% %% 100
::    check for midnight crossing
if /i %tsecs% geq 86400 set /a tsecs-=86400
set/a hour2=%tsecs% / 3600
set/a min2=(%tsecs%-(%hour2%*3600)) / 60
set/a sec2=(%tsecs%-(%hour2%*3600)) %% 60
set/a err=%msecs%
if /i %msecs% neq 0 set /a msecs+=%correct%
if /i 1%msecs% lss 20 set "msecs=0%msecs%"
if /i 1%min2% lss 20 set "min2=0%min2%"
if /i 1%sec2% lss 20 set "sec2=0%sec2%"
set "time2=%hour2%:%min2%:%sec2%.%msecs%"
:wait
  set timen=%time: =%
  if /i %timen% geq %time2% goto :end
goto :wait
:end
for /f "tokens=2 delims=." %%a in ("%timen%") do set num=%%a
if /i %num:~0,1% equ 0 set num=%num:~1%
set/a err=(%num%-%err%)*10
endlocal&exit /b %err%