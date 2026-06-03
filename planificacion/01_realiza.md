# 🧮 Matrix Solver Web Application (Vanilla & Wasm)

Un entorno interactivo inteligente de álgebra lineal desarrollado con **tecnologías puras (Vanilla)**. El sistema utiliza un motor matemático de alto rendimiento escrito en **C++** que se ejecuta directamente en el navegador del usuario mediante **WebAssembly (Wasm)**, eliminando la necesidad de servidores backend complejos y garantizando una velocidad de cómputo nativa.

---

## 🧭 Flujo de Usuario e Interfaz Inteligente

Para garantizar una experiencia de usuario (UX) fluida y evitar errores matemáticos, la interfaz actúa como un filtro estricto siguiendo este flujo dinámico:

1. Selección de Operación.
2. Configuración Dinámica de Dimensiones:
   * Operación con Escalar: Pide 1 Matriz + Libera casilla flotante única.
   * Operación de 1 Matriz: Pide 1 Matriz (Filtra si debe ser cuadrada N x N).
   * Operación entre Matrices: Pide Nº de Matrices (2 a 5) y encadena restricciones de tamaño.
3. Generación Dinámica de Celdas (Solo se dibujan los campos necesarios).
4. Cálculo, Diagnóstico e Historial.

---

## 🛠️ Alcance de la Fase 1 (Arquitectura del Sistema)

El proyecto se divide en tres bloques independientes y modulares:

### 1. El Motor Matemático (C++ Puro)
Encargado exclusivo de la lógica algebraica. Recibe datos planos, ejecuta los algoritmos y procesa el catálogo de operaciones:
* **Operaciones entre Matrices (De 2 a 5 matrices):** Suma, Resta y Multiplicación matricial.
* **Operaciones Matriz-Escalar:** Suma, Resta y Producto de un número real por cada celda de la matriz.
* **Operaciones Unilaterales & Álgebra Lineal:** Transposición, Cálculo de Determinante (N x N), Matriz Inversa y Eliminación de Gauss-Jordan (Resolución de sistemas Ax = B y Ecuaciones Matriciales).
* **Filtro de Diagnóstico Automático:** Módulo que analiza tanto las matrices de entrada como la matriz resultante para identificar si es: Cuadrada, Rectangular, Identidad, Diagonal, Escalar, Triangular (Sup/Inf), Simétrica, Antisimétrica o Singular (Det = 0).

### 2. La Interfaz de Usuario (HTML5 / CSS3 / JavaScript Vanilla)
* **Generador Dinámico:** Dibuja las celdas en pantalla según las dimensiones y cantidad de matrices seleccionadas.
* **Filtro Estricto:** Bloquea inputs de dimensiones inválidas (ej: si la Matriz A es de 3 x 2, bloquea las filas de la Matriz B en 2 para permitir el producto).
* **Visualizador:** Muestra la matriz resultante junto a su etiqueta de diagnóstico automático.

### 3. El Puente Wasm & Sistema de Historial (Acumulador)
* Gestiona el paso de datos de bajo nivel entre JavaScript y la memoria de C++.
* **Botón Acumulador:** Al obtener un resultado, permite al usuario reutilizar la Matriz Resultante como la "Matriz A" para una nueva operación, sugiriendo la misma operación por defecto pero permitiendo cambiarla libremente.

---

## 💾 Caja de Escalabilidad (Futuras Implementaciones)
*Estas características están planificadas en el diseño pero NO se construirán en la primera versión:*

1. **Módulo Didáctico:** Botón "Generar Datos Aleatorios" (enteros pequeños) para autollenar celdas y el motor de generación de Procedimiento paso a paso detallado en texto.
2. **Operaciones Avanzadas:** Cálculo de Autovalores y Autovectores (Eigenvalues / Eigenvectors) y descomposiciones matriciales (LU, QR, Cholesky).