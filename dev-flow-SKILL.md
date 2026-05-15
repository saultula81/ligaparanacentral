---
name: dev-flow
description: >
  Activa un flujo guiado de desarrollo de software en 7 fases: Arquitecto, Constructor, Detective,
  Crítico, Optimizador, Escudo y Narrador. SIEMPRE usar esta skill cuando el usuario escriba un
  asterisco (*) seguido de una descripción de lo que quiere construir (ej: "* quiero una app de
  tareas en React"). También activar cuando el usuario mencione querer construir un proyecto,
  feature o funcionalidad nueva y pida ayuda estructurada. Esta skill convierte cualquier idea
  en un plan técnico ejecutable, guiando al agente a solicitar exactamente lo que necesita en
  cada fase antes de generar output.
---

# Dev Flow — Flujo de Desarrollo Guiado en 7 Fases

## Activación

Esta skill se activa cuando el usuario escribe:

```
* [descripción de lo que quiere construir]
```

Ejemplo: `* quiero construir una API REST para gestionar pedidos con Node.js`

---

## Comportamiento del agente al activarse

Al detectar el patrón de activación, el agente debe:

1. **Nunca asumir** información que no fue provista.
2. **Trabajar fase por fase**, completando cada una antes de pasar a la siguiente.
3. **Solicitar lo necesario** al inicio de cada fase con preguntas concretas y mínimas.
4. **Confirmar con el usuario** antes de avanzar a la siguiente fase.
5. Permitir que el usuario **salte fases** si lo solicita explícitamente.

---

## Las 7 Fases

### FASE 01 — El Arquitecto | Planificación y Diseño

**Objetivo:** Convertir la idea en un plan técnico completo antes de escribir código.

**El agente solicita:**
- Descripción del proyecto (si no está en el trigger): qué problema resuelve, para quién.
- Usuarios esperados (número estimado).
- Tipo de aplicación: web / móvil / API / CLI / otro.
- Restricciones técnicas: lenguaje o framework obligatorio, o "libre elección".

**El agente entrega:**
1. Stack tecnológico recomendado (frontend, backend, base de datos, infra) con justificación por línea.
2. Estructura de carpetas del proyecto (árbol de archivos inicial).
3. Modelo de datos: entidades principales, campos clave y relaciones.
4. Diagrama de flujo: flujo principal del usuario paso a paso (Paso 1 → Paso 2 → ...).
5. Decisiones de diseño: las 3-5 más importantes y por qué.
6. Riesgos técnicos: 2-3 problemas posibles y cómo mitigarlos.

---

### FASE 02 — El Constructor | Generación de Código

**Objetivo:** Generar código limpio, modular y listo para producción.

**El agente solicita:**
- Qué funcionalidad específica construir ahora (puede ser incremental).
- Stack confirmado (o hereda de Fase 01).
- Convenciones del proyecto: nombrado de archivos, estilo de código, o "estándar".
- Si existe schema de base de datos: sí/no, y pegarlo si existe.

**El agente entrega:**
- Código en bloques separados por archivo, con ruta como encabezado.
- Validación de inputs y manejo de errores completo.
- Tipos/interfaces cuando el lenguaje lo permita.
- Comentarios solo donde la lógica no sea obvia.
- Dependencias externas indicadas con comando de instalación.
- Sección final: "Cómo probarlo" con pasos exactos.

---

### FASE 03 — El Detective | Debugging

**Objetivo:** Analizar bugs de forma metódica con razonamiento paso a paso.

**El agente solicita:**
- Comportamiento esperado.
- Comportamiento actual.
- Mensaje de error exacto (o "no hay error visible").
- Cuándo ocurre: siempre / a veces / solo en producción.
- Código relevante (pegado directamente).
- Lenguaje/framework y versión.
- Qué ya intentó el usuario (para no repetir).

**El agente entrega:**
1. Hipótesis inicial: 3 causas posibles ordenadas por probabilidad.
2. Análisis línea por línea: dónde podría estar el fallo.
3. Causa raíz: la más probable y por qué genera ese comportamiento.
4. Solución: código corregido con cambios resaltados.
5. Prevención: práctica o patrón para evitar este error en el futuro.

---

### FASE 04 — El Crítico | Code Review

**Objetivo:** Revisar código como un Pull Request en equipo profesional.

**El agente solicita:**
- Código a revisar (pegado).
- Lenguaje/framework.
- Qué hace ese código (descripción breve).
- Tipo: API / frontend / servicio / script / otro.

**El agente entrega por dimensión** (estado: Bien / Mejorable / Problema):
1. Seguridad: vulnerabilidades (SQL injection, XSS, secrets hardcodeados, etc.).
2. Rendimiento: cuellos de botella (queries N+1, O(n²), cargas innecesarias).
3. Código limpio: responsabilidad única, nombres descriptivos, duplicación.
4. Patrones y estructura: coherencia con el framework.
5. Manejo de errores: edge cases, errores silenciosos.

**Cierre:** Puntuación global 1-10 + resumen en una línea + los 3 cambios de mayor impacto.

---

### FASE 05 — El Optimizador | Refactoring

**Objetivo:** Transformar código funcional en código más rápido, legible y mantenible.

**El agente solicita:**
- Código actual (pegado).
- Qué hace ese código.
- Qué preocupa al usuario: lento / difícil de leer / difícil de extender / no escala / duplicación.

**El agente entrega:**
- Código refactorizado completo.
- Tabla de cambios: Qué cambié | Por qué | Impacto esperado.
- Estimación de complejidad antes/después si hay mejora de rendimiento (ej: O(n²) → O(n log n)).
- Justificación si se introduce dependencia nueva o patrón diferente.

**Reglas inamovibles del refactor:**
1. No cambiar el comportamiento externo. Misma entrada → misma salida.
2. Explicar cada cambio. No entregar código sin justificación.
3. Mostrar antes y después de cada bloque modificado.

---

### FASE 06 — El Escudo | Testing

**Objetivo:** Generar suite de tests completa lista para ejecutar.

**El agente solicita:**
- Código a testear (pegado).
- Qué hace ese código.
- Framework de tests a usar (Jest / Pytest / JUnit / Vitest / otro).
- Dependencias externas que necesitan mocking (APIs, base de datos, servicios).

**El agente entrega tests en 4 categorías obligatorias:**
1. Happy path: flujo normal funciona (mínimo 2 tests).
2. Edge cases: inputs vacíos, nulos, valores extremos, tipos incorrectos, caracteres especiales (mínimo 3 tests).
3. Gestión de errores: el código falla de forma controlada (mínimo 2 tests).
4. Integraciones: mocks de dependencias externas verificando parámetros correctos.

**Formato:** Nombres descriptivos, agrupados en describe/context blocks, mocks/fixtures incluidos, lista resumen de escenarios al final.

---

### FASE 07 — El Narrador | Documentación

**Objetivo:** Generar documentación técnica clara y lista para usar.

**El agente solicita:**
- Código o descripción del proyecto (si es muy largo, describir módulos principales).
- Nombre del proyecto.
- Stack (o hereda de Fase 01).
- Quién va a leer esto: equipo / open source / yo mismo en 6 meses.

**El agente entrega:**

**README.md:**
- Descripción del proyecto (qué problema resuelve, 2-3 frases).
- Requisitos previos y versiones.
- Instalación paso a paso (que funcione copiando y pegando).
- Ejemplo de uso rápido.
- Estructura del proyecto (árbol con descripción de cada carpeta clave).
- Variables de entorno (tabla: nombre, descripción, ejemplo, si es obligatoria).
- Cómo ejecutar los tests.
- Cómo contribuir (si aplica).

**Documentación inline:**
- Docstrings/JSDoc para cada función pública: qué hace, parámetros (nombre, tipo, descripción), retorno, excepciones posibles, ejemplo de uso.

**Guía de API (si aplica):**
- Por endpoint: método, ruta, descripción, parámetros, body de ejemplo, respuesta exitosa, posibles errores.

---

## Reglas generales del agente

- **Una fase a la vez.** No saltar adelante sin confirmación del usuario.
- **Preguntas mínimas.** Solo pedir lo estrictamente necesario para esa fase.
- **Herencia de contexto.** La información recogida en fases anteriores no se vuelve a pedir.
- **El usuario manda.** Si pide saltar una fase o cambiar el orden, el agente lo hace sin fricción.
- **Sin relleno.** Cada entrega va directo al grano. Tono técnico y directo.
- **Siempre confirmar** al final de cada fase: "¿Pasamos a la Fase N — [Nombre]?"

---

## Mensaje de inicio (al detectar el trigger `*`)

Cuando el usuario activa la skill, el agente responde con:

```
🚀 Dev Flow activado.

Voy a guiarte por el ciclo completo de desarrollo en 7 fases:
01 Arquitecto → 02 Constructor → 03 Detective → 04 Crítico → 05 Optimizador → 06 Escudo → 07 Narrador

Empezamos por **Fase 01 — El Arquitecto**.

[Solicitar aquí lo que falte según el contexto dado en el trigger]
```

Si el trigger ya contiene suficiente información del proyecto, el agente puede arrancar directamente con las preguntas de la Fase 01 sin pedir lo que ya está claro.
