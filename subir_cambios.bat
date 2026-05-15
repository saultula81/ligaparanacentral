@echo off
color 0A
echo ==========================================
echo    SUBIDA AUTOMATICA A GITHUB
echo ==========================================
echo.

:: Agregar todos los cambios
git add .
echo [OK] Archivos preparados para subir.

:: Pedir el mensaje para el commit
set "mensaje="
set /p mensaje="Escribe un mensaje corto sobre lo que cambiaste: "

:: Si no escribe nada, le ponemos un mensaje por defecto
if not defined mensaje set "mensaje=Actualizacion rapida"

:: Hacer el commit
git commit -m "%mensaje%"

:: Descargar cambios de la nube para evitar conflictos (forzando historiales desconectados)
echo.
echo [1/2] Sincronizando con la nube para evitar conflictos...
git pull origin main --no-edit --allow-unrelated-histories

:: Empujar los cambios a la rama principal (usando origin main fuerza la subida sin pedir upstream)
echo.
echo [2/2] Subiendo tus archivos a GitHub...
git push origin main

echo.
echo ==========================================
echo    PROCESO TERMINADO
echo ==========================================
pause
