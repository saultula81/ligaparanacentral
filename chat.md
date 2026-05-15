# Liga de Volley Parana Central - Gestión de Proyecto

## 🚀 Despliegue en Vercel
1. Conectar Repositorio de GitHub.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Variables de Entorno (En Vercel Dashboard):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🗄️ Configuración de Supabase
### Tabla `resultados`
Asegúrate de tener estas columnas para que funcionen las crónicas y fotos:
- `cronica`: text
- `foto_url`: text

### Storage (Almacenamiento)
1. Crear Bucket: **`voley-images`**
2. Nivel de acceso: **PÚBLICO** (Public)
3. Estructura de carpetas (se crean solas al subir):
   - `/logos/` (para equipos)
   - `/partidos/` (para las fotos del diario)

## ✅ Funcionalidades Implementadas
- PWA con Instalación nativa (Windows/Android).
- Redirección automática al Diario tras instalar.
- Dashboard Administrativo con guía paso a paso.
- Generador de Fixture con detección de conflictos.
- Exportación de Lista de Buena Fe en PDF con escudos.
- Diario Digital estilo revista deportiva con compartición por WhatsApp.

## ⏭️ Próximos Pasos
- Cargar los primeros resultados reales para ver el Diario en acción.
- Generar el primer fixture oficial de la temporada.
- Validar las Listas de Buena Fe con los delegados.
ksmservicios#*$


