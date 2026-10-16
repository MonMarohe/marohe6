@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Para abrir MAROHE instala Node.js 24 o posterior y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 24 ? 0 : 1)"
if errorlevel 1 (
  echo MAROHE necesita Node.js 24 o posterior. Actualiza Node.js y vuelve a intentarlo.
  pause
  exit /b 1
)
if not defined PORT set "PORT=4173"
echo Abre http://127.0.0.1:%PORT% en tu navegador.
echo Deja esta ventana abierta mientras usas MAROHE.
node server.cjs
pause
