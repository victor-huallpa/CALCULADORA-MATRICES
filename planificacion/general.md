# 🗺️ Master Plan: Sistema Web de Resolución de Matrices (Vanilla & Wasm)

Este documento contiene la estructura general de las fases de desarrollo del proyecto. Este plan sirve como mapa de ruta inicial y **será modificado, corregido y adaptado** de acuerdo a tus propios criterios y a las futuras revisiones que realices con expertos.

---

## 📅 Fase 1: Diseño Conceptual y Requerimientos de UX (¡Completada!)
*Esta es la etapa que acabamos de cerrar y documentar en el primer README.*
* Definición estricta del flujo de la interfaz (Operación ➔ Restricción de dimensiones ➔ Generación de celdas).
* Establecimiento del catálogo completo de operaciones (Básicas, Escalares, Avanzadas y Diagnóstico).
* Diseño del sistema de historial acumulador para encadenar operaciones con la matriz resultante.
* Separación del alcance inmediato frente a la "Caja de Escalabilidad" (Modo didáctico paso a paso y datos aleatorios).

---

## 💻 Fase 2: Estructura de Datos y Algoritmos Base en C++
*El objetivo aquí es crear el "cerebro" matemático en su nivel más puro antes de tocar la web.*
* Debate y elección del almacenamiento en memoria (¿Lista de filas o Lista plana continua?).
* Programación de la estructura de la Matriz y sus validadores de dimensiones.
* Desarrollo de los algoritmos de nivel base:
    * Suma y resta de matrices (en cadena para 2 y hasta 5 matrices).
    * Operaciones con escalares (Suma, resta y producto mediante casilla flotante).
    * Transposición de matrices.
* Pruebas de estrés de estos algoritmos mediante la consola de comandos.

---

## 🧮 Fase 3: Álgebra Lineal Avanzada y Módulo de Diagnóstico
*Evolución del motor de C++ para resolver los problemas complejos del catálogo.*
* Implementación del algoritmo para el cálculo del **Determinante** ($N \times N$).
* Desarrollo del método de **Eliminación de Gauss-Jordan** para la reducción de matrices.
* Programación del cálculo de la **Matriz Inversa** y resolución de **Ecuaciones Matriciales** ($AX = B$).
* Creación del **Módulo de Diagnóstico Automático**: Algoritmos matemáticos que analizan las propiedades de la matriz para clasificar su tipo (Identidad, Diagonal, Triangular, Singular, etc.).

---

## 🎨 Fase 4: Interfaz Web Dinámica (Frontend Vanilla)
*Construcción de la capa visual que usará el cliente, hecha exclusivamente con tecnologías web puras.*
* Maquetación del diseño con **HTML5 y CSS3 puro** (estilo limpio, scannable y responsivo).
* Desarrollo con **Vanilla JavaScript** del generador dinámico de cuadrículas de celdas según el número de matrices (2 a 5) y sus dimensiones.
* Programación de los filtros y bloqueos automáticos en los inputs de dimensiones para impedir combinaciones matemáticamente inválidas.

---

## 🌁 Fase 5: Integración, Puente WebAssembly e Historial
*El punto de unión donde el Frontend interactúa con el Backend que corre en el navegador.*
* Compilación del código C++ a formato `.wasm` utilizando la herramienta **Emscripten**.
* Creación del "puente" en JavaScript para aplanar los datos de la interfaz web y enviarlos a la memoria nativa de WebAssembly.
* Conexión del **Sistema de Historial (Acumulador)**: Programar el comportamiento del botón para transferir la matriz resultante de vuelta al inicio de la interfaz como "Matriz A", automatizando la sugerencia de continuar la operación.
* Despliegue definitivo (ej: GitHub Pages) para verificar que el sistema funciona al 100% sin necesidad de servidores externos.