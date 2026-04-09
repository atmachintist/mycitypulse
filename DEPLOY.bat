@echo off
echo.
echo  Deploying MyCityPulse...
echo  ========================
echo.

cd /d "%~dp0"

:: Clear any stuck git lock file
if exist ".git\index.lock" del /f ".git\index.lock"

git config user.email "joglekar.yash@gmail.com"
git config user.name "Yash"
git add src/App.jsx src/App.css src/index.css src/cityData.js
git commit -m "Fix city images: Special:FilePath URLs, unique images for all, add Mira Bhayandar"
git push

echo.
echo  ========================
echo  Done! Check mycitypulse.vercel.app in ~60 seconds.
echo.
pause
