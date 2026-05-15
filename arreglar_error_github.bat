@echo off
color 0C
echo ==========================================
echo    PURGANDO HISTORIAL DE SEGURIDAD
echo ==========================================
echo.

echo [1/4] Creando un historial completamente limpio...
git checkout --orphan rama_limpia

echo [2/4] Agregando solo los archivos seguros (ignorando la clave)...
git add .

echo [3/4] Empaquetando la version final segura...
git commit -m "Version limpia y segura"

echo [4/4] Sobrescribiendo la nube para eliminar todo rastro del error...
git branch -D main
git branch -m main
git push -f origin main

echo.
echo ==========================================
echo    ¡HISTORIAL LIMPIO Y SUBIDO!
echo ==========================================
pause
