# Actualización de Instrucciones para Compilar el APK

He ajustado la aplicación nativa para que sea mucho más moderna: ahora el "Splash Screen" es dinámico. Mientras el loader da vueltas indicando la carga real de la web app de fondo, el logo `liga.png` tendrá una animación de destellos pulsantes (sparkles) detrás de él, y se seguirá reproduciendo tu archivo de audio susurrado. Una vez que termine el audio **y** la web app termine de cargar por completo, se hará una suave transición cruzada mostrando el diario digital.

## Pasos manuales requeridos

Debes colocar tus recursos gráficos y de audio en las carpetas correctas del proyecto Android:

### 1. El Logo (liga.png)
1. Toma tu archivo `liga.png` que está en `e:\volley\android\`.
2. Muévelo o cópialo a la carpeta: `e:\volley\android\app\src\main\res\drawable`
*(Nota: Si la carpeta `drawable` no existe, créala. El nombre del archivo debe ser exactamente `liga.png`).*

### 2. El Audio Susurrado (splash_audio.mp3)
1. Crea la carpeta de recursos en crudo (si no la creaste antes): `e:\volley\android\app\src\main\res\raw`
2. Graba tu archivo de sonido MP3 con el susurro y ubícalo ahí.
*(Nota: El nombre debe ser estrictamente `splash_audio.mp3`).*

### 3. Eliminar código viejo (Opcional pero recomendado)
Ya no vamos a usar el antiguo sistema. Puedes borrar el archivo `SplashActivity.kt` y `activity_splash.xml` si gustas, o dejarlos ahí; ya los desvinculé del Manifiesto, así que no afectarán.

## 4. Compilar
Abre tu terminal en `e:\volley\android` y ejecuta la compilación de Gradle:

```bash
./gradlew assembleDebug
```

Con esto tendrás el APK en: `e:\volley\android\app\build\outputs\apk\debug\app-debug.apk` con los efectos de luz listos.
