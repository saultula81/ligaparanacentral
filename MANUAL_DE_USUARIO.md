# Manual de Usuario - Liga Paraná Central

Este documento detalla el funcionamiento de la plataforma digital para la Liga Paraná Central de Vóley. Está dividido en dos secciones: el **Diario Digital** (para jugadores y espectadores) y el **Panel de Administración** (para organizadores).

---

## 📘 1. Manual del Diario Digital (Público)

El Diario Digital es el portal de acceso público donde cualquier persona puede informarse sobre los encuentros, ver los fixtures y leer las crónicas de los encuentros.

### 1.1. Crónicas y Resultados
- En la pestaña **Crónicas**, podrás visualizar el "feed" de noticias con los últimos partidos jugados.
- Cada tarjeta muestra la foto del encuentro, la categoría, el resultado por sets y una crónica escrita del partido.
- Puedes usar el botón de **Compartir en WhatsApp** (💬) para generar y enviar un resumen automático del resultado a tus contactos o grupos.

### 1.2. Calendario y Fixture
- En la sección **Calendario**, encontrarás la programación oficial de todos los partidos futuros que la organización ha publicado.
- **🖨️ Imprimir Fixture:** En esta misma pantalla, tienes a tu disposición un botón azul que dice "Imprimir Fixture". Al pulsarlo, el sistema limpiará la pantalla (ocultando menús y barras) y adaptará el formato a "blanco y negro" inteligente. Esto permite guardar el cronograma en PDF o imprimirlo en papel sin gastar tinta negra excesiva, garantizando que los textos oscuros de la web sean perfectamente legibles en papel blanco.

### 1.3. Buscador de Jugadores
- Selecciona la pestaña **Buscar Jugador** e ingresa un nombre o número de DNI.
- El sistema te mostrará instantáneamente la credencial del jugador, los equipos en los que está habilitado y un detalle cruzado de **todos sus próximos partidos**. Es ideal para que cada atleta o familiar sepa exactamente qué días, en qué cancha y a qué horas le toca jugar sin tener que leer todo el fixture de la liga.

### 1.4. Instalar la Aplicación (PWA)
- Para la mejor experiencia móvil, puedes instalar el Diario como una aplicación nativa. Solo busca el botón interno de **"Descargar e Instalar"** o utiliza el ícono de "Instalar" (🖵) directamente desde la barra de direcciones de navegadores como Chrome o Edge.

---

## 🛠️ 2. Manual del Administrador

El panel de control es exclusivo para la organización de la liga. Permite gestionar equipos, automatizar cruces y centralizar los reportes fotográficos.

### 2.1. Gestión de Equipos y Jugadores
- **Crear o Editar Clubes:** Entra a "Equipos y Categorías" para crear los clubes, asignarles su categoría correspondiente y subir el Escudo Oficial.
- **Carga Masiva (Inteligente) de Jugadores:** 
  1. Haz clic en el ícono azul de "Usuarios" (👤) al lado del equipo que quieres gestionar.
  2. En lugar de cargar DNI por DNI, pulsa en la opción **Carga Inteligente (.TXT / CSV)**.
  3. Sube un archivo de texto simple donde cada renglón contenga el nombre del atleta y su DNI. El motor inteligente extraerá el número de documento sin importar el formato (separado por comas, espacios o guiones) y matriculará a todo el plantel en 1 segundo.

### 2.2. Generación Automática del Fixture
- Entra a la sección **Generar Fixture**.
- Selecciona la categoría, la fecha a disputarse, la sede y la cantidad de canchas disponibles.
- Ve cruzando a los equipos según la programación.
- **Detección de Conflictos:** El sistema te alertará automáticamente (en color naranja/rojo) si por error intentas hacer jugar a un mismo equipo en dos canchas distintas al mismo tiempo.
- Una vez guardado, el fixture se publica instantáneamente en la nube para todo el público.

### 2.3. Carga de Resultados
- Ve a **Carga de Resultados**. Allí solo aparecerán los partidos que aún figuran como pendientes de jugar.
- Selecciona el cruce que acaba de finalizar.
- Ingresa los puntos de cada set separados por comas (ejemplo: `25, 25` para un equipo y `20, 15` para el otro).
- Sube la **Foto del Encuentro**.
- Redacta la **Crónica del Partido** destacando los puntos más importantes del juego y presiona Publicar. En ese momento, el cruce se marca como finalizado y aparece inmediatamente como noticia en el Diario Digital.

### 2.4. Impresión del Fixture (Mesa de Control)
- El administrador es el principal encargado de imprimir el cronograma para la mesa de control del evento.
- Para hacerlo, debes ir al menú lateral del panel y hacer clic en el botón superior **"📰 Ver Diario y Actualizaciones"**. Esto te llevará a la vista pública.
- Una vez allí, ve a la pestaña de **Calendario** y utiliza el botón **🖨️ Imprimir Fixture**. El diseño está especialmente maquetado para que cada tarjeta no se corte a la mitad de la hoja y quede prolijo para pegar en las paredes de los clubes.
