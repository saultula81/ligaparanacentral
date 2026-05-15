# Instrucciones para la App Admin

El proyecto Android nativo para el portal de Administradores ya está creado y configurado en esta carpeta (`e:\volley\android\admin`).

Cuenta con el mismo sistema de "Splash Screen asíncrono" (logo, loader giratorio, efecto de destellos pulsantes detrás y el sonido) que la app principal, pero cargando la URL `https://ligaparanacentral.vercel.app/admin` y bajo el nombre "Liga Paraná Central - Admin".

## Siguientes Pasos (A tu cargo):

1. **Logo (`liga.png`):**
   Copia el archivo del logo original y ponlo dentro de:
   `e:\volley\android\admin\app\src\main\res\drawable`
   *(Si no existe la carpeta `drawable`, créala).*

2. **Sonido (`splash_audio.mp3`):**
   Copia tu archivo de sonido de susurro y ponlo dentro de:
   `e:\volley\android\admin\app\src\main\res\raw`
   *(Si no existe la carpeta `raw`, créala).*

3. **Compilación:**
   Abre una nueva terminal apuntando a `e:\volley\android\admin` y ejecuta:
   ```bash
   ./gradlew assembleDebug
   ```

Una vez que termine, tu nuevo APK `app-debug.apk` de administradores estará listo en `e:\volley\android\admin\app\build\outputs\apk\debug\`.
