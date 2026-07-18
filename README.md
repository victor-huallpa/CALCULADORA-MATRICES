# Cuaderno de Matrices — Calculadora paso a paso

Calculadora de matrices construida en **React + Vite + Tailwind CSS**. Resuelve
operaciones matriciales mostrando el procedimiento completo, paso a paso, y
guarda un historial de ejercicios en el navegador (localStorage) mediante una
capa que **simula una API** — no hay backend real, pero el resto de la
aplicación consume esa capa como si lo hubiera.

## Índice

- [Características](#características)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura y decisiones](#arquitectura-y-decisiones)
- [Operaciones soportadas](#operaciones-soportadas)
- [Sistema de diseño](#sistema-de-diseño)
- [Persistencia e "API simulada"](#persistencia-e-api-simulada)
- [Limitaciones conocidas](#limitaciones-conocidas)
- [Posibles mejoras futuras](#posibles-mejoras-futuras)

## Características

- ➕ Suma, resta, multiplicación de matrices y multiplicación por escalar.
- 🔁 Transpuesta, determinante, matriz inversa, forma escalonada reducida
  (RREF) y rango.
- 🪜 **Explicación paso a paso** de cada operación: cada paso indica qué
  operación de fila se aplicó (o qué elemento se calculó) y muestra un
  snapshot de la matriz en ese momento, con las celdas involucradas
  resaltadas.
- 💾 **Historial persistente** de ejercicios resueltos, guardado en
  `localStorage` del navegador, con opción de reabrir, eliminar o vaciar
  ejercicios.
- 📱 Diseño **responsivo**: el panel de historial se convierte en un cajón
  deslizable (drawer) en pantallas pequeñas y en una barra lateral fija en
  escritorio.
- 🎨 Identidad visual propia tipo "cuaderno técnico": fondo cuadriculado,
  matrices dibujadas con corchetes en SVG y resaltado tipo "nota al margen"
  durante la resolución.
- ♿ Accesibilidad básica: `aria-label` en inputs y botones, foco visible,
  y `prefers-reduced-motion` respetado.

## Cómo ejecutar el proyecto

Requiere [Node.js](https://nodejs.org/) 18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev

# 3. Abrir la URL que muestra la terminal (por defecto http://localhost:5173)
```

Para generar una build de producción:

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve esa build localmente para probarla
```

No se necesita ninguna variable de entorno ni backend: todo funciona en el
navegador.

## Estructura del proyecto

```
matrix-calculator/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx                 # punto de entrada de React
    ├── App.jsx                  # orquesta estado, layout y llamadas a la "API"
    ├── index.css                # Tailwind + estilos globales (fondo cuadriculado, etc.)
    ├── components/
    │   ├── Header.jsx           # encabezado + botón de historial (móvil)
    │   ├── MatrixBracket.jsx    # corchetes SVG de matriz (elemento de firma visual)
    │   ├── MatrixInput.jsx      # grilla editable de una matriz + control de tamaño
    │   ├── OperationSelector.jsx# selector de operación + input de escalar
    │   ├── StepsDisplay.jsx     # lista de pasos con matrices resaltadas
    │   ├── ResultDisplay.jsx    # resultado final destacado
    │   └── HistoryPanel.jsx     # barra lateral / drawer de historial
    ├── services/
    │   └── matrixApi.js         # capa que simula una API (persiste en localStorage)
    └── utils/
        └── matrixOperations.js  # toda la matemática pura, sin dependencias de React
```

## Arquitectura y decisiones

- **Lógica matemática separada de la UI.** Todo el cálculo vive en
  `src/utils/matrixOperations.js`, como funciones puras que no tocan el DOM
  ni React. Esto las hace fáciles de testear de forma aislada (con Node,
  sin levantar la app) y reutilizables si en el futuro se agrega, por
  ejemplo, un modo de línea de comandos.

- **Cada operación devuelve pasos, no solo el resultado.** Las funciones de
  `matrixOperations.js` devuelven `{ result, steps, error }`. Cada `step`
  trae un título corto (la operación de fila en notación estándar, p. ej.
  `F2 → F2 − 2·F1`), una descripción en español y, opcionalmente, un
  snapshot de la matriz con las celdas/filas a resaltar. La UI simplemente
  itera ese arreglo — no tiene que saber nada de álgebra lineal.

- **"API simulada" como capa de indirección.** `src/services/matrixApi.js`
  expone funciones `async` (`runOperation`, `fetchHistory`,
  `deleteHistoryEntry`, `clearHistory`) con la misma forma que tendría un
  cliente HTTP real: son asíncronas, tienen una pequeña latencia artificial
  y lanzan errores con forma de respuesta HTTP. Por dentro, sin embargo,
  todo se lee y escribe en `localStorage`. La ventaja de este diseño es que
  si algún día se agrega un backend real, **solo hay que reescribir el
  cuerpo de ese archivo** (cambiar `localStorage` por `fetch`); el resto de
  la aplicación no se entera del cambio porque ya la está consumiendo como
  si fuera remota.

## Operaciones soportadas

| Operación | Requiere B | Requiere escalar | Método |
|---|---|---|---|
| Suma (A + B) | ✅ | — | elemento a elemento |
| Resta (A − B) | ✅ | — | elemento a elemento |
| Multiplicación (A × B) | ✅ | — | fila × columna |
| Escalar (k × A) | — | ✅ | elemento a elemento |
| Transpuesta (Aᵀ) | — | — | intercambio de índices |
| Determinante \|A\| | — | — | eliminación gaussiana con pivoteo parcial (2×2 usa la fórmula directa) |
| Inversa (A⁻¹) | — | — | Gauss-Jordan sobre la matriz aumentada [A \| I] |
| Forma escalonada (RREF) | — | — | eliminación gaussiana + normalización de pivotes |
| Rango de A | — | — | se deriva de la RREF |

Todas las operaciones validan las dimensiones antes de calcular y muestran
un mensaje de error legible en español si no son compatibles (por ejemplo,
intentar sumar una matriz 2×3 con una 3×2, o invertir una matriz singular).

## Sistema de diseño

La identidad visual se pensó específicamente para el dominio (álgebra
lineal), no como una plantilla genérica:

- **Paleta:** fondo tipo papel cuadriculado (`#FAF9F4` con líneas
  `#DCE0D6`), tinta principal `#1C2333`, acento verde-petróleo `#0F6E66`
  para acciones y resultados, azul acero `#2B6CB0` para resaltar celdas
  durante los pasos (como una nota al margen) y rojo ladrillo `#B3261E`
  reservado para errores.
- **Tipografía:** `Space Grotesk` para títulos (personalidad técnica y
  geométrica), `Inter` para texto de cuerpo, `JetBrains Mono` para todos los
  números y la notación de operaciones de fila (`F2 → F2 − 2·F1`), de forma
  que las cifras siempre alineen como en una calculadora real.
- **Elemento de firma:** cada matriz se dibuja con **corchetes en SVG**
  (`MatrixBracket.jsx`) en vez de un simple `<div>` con borde, y durante la
  resolución paso a paso las celdas involucradas laten suavemente
  (`animate-pulseCell`) para simular el gesto de "señalar con el dedo" que
  alguien haría al explicar el procedimiento en un cuaderno.

## Persistencia e "API simulada"

- El historial se guarda bajo la clave `matrix-calculator:history:v1` en
  `localStorage`, como un arreglo de hasta 100 ejercicios (los más nuevos
  primero).
- Solo se guardan los ejercicios que se resuelven **sin error**.
- Cada entrada guarda la operación, las matrices/escalar usados, el
  resultado y la fecha, para poder reabrirla desde el panel de historial y
  recalcularla con un clic.
- Si el `localStorage` del navegador está corrupto o no disponible, la app
  no se rompe: simplemente empieza con un historial vacío.

## Limitaciones conocidas

- El historial es **local al navegador**: no se sincroniza entre
  dispositivos ni usuarios (no hay backend real, tal como se pidió).
  `localStorage` también tiene un límite de tamaño (unos 5 MB), suficiente
  para cientos de ejercicios.
- Las matrices están limitadas a un tamaño de 1×1 a 6×6 desde la interfaz,
  para que la explicación paso a paso siga siendo legible.
- Los cálculos usan `number` de JavaScript (punto flotante de 64 bits); los
  resultados se redondean a 6 decimales para absorber el ruido numérico
  típico de la eliminación gaussiana.

## Posibles mejoras futuras

- Exportar un ejercicio (o el historial completo) como PDF.
- Modo oscuro respetando la misma identidad visual.
- Reemplazar la capa `matrixApi.js` por llamadas a un backend real sin
  tocar el resto de la app (ver "Arquitectura y decisiones").
- Soporte para matrices con fracciones exactas en vez de solo decimales.
