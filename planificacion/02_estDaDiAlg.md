# 🗺️ Planificación - Fase 2: Estructura de Datos y Diseño Algorítmico (C++)

En esta fase nos enfocamos exclusivamente en el diseño interno del **Motor Matemático**. El objetivo es definir cómo el programa gestionará la memoria y cómo se estructurarán los algoritmos antes de conectarlos a la web.

---

## 🧠 1. Definición de la Estructura de la Matriz
Debemos elegir cómo se representarán los números y las dimensiones en la memoria de C++. Existen dos opciones principales para el diseño:

* **Opción A: Lista de Filas (Vector de Vectores)**
    * *Concepto:* Una lista principal que contiene sub-listas (filas), y cada fila contiene los números.
    * *Sintaxis mental:* `matriz[fila][columna]`
    * *Ventaja:* Muy intuitiva y fácil de visualizar al diseñar algoritmos.
* **Opción B: Lista Plana (Vector Único Continuo)**
    * *Concepto:* Todos los números se guardan en una sola tira continua en memoria.
    * *Sintaxis mental:* `Posición = (fila * columnas_totales) + columna`
    * *Ventaja:* Estándar industrial de alto rendimiento. Facilita drásticamente el envío de datos entre JavaScript y WebAssembly.

---

## 📐 2. Diseño de los Primeros Algoritmos (Nivel Base)
Una vez elegida la estructura, se diseñará la lógica de control y las operaciones iniciales:

### A. Módulo de Inicialización y Dimensiones
* Creación de la entidad "Matriz" que guarde el número de filas, el número de columnas y los datos numéricos.
* Algoritmos de validación previa (ej: asegurar que para sumar, las dimensiones de las matrices involucradas sean idénticas).

### B. Lógica de Operaciones Base
Diseño en pseudocódigo o lógica pura de:
1.  **Suma/Resta de un Escalar:** Cómo recorrer la estructura para aplicar el número de la casilla flotante a cada celda.
2.  **Producto por un Escalar:** Multiplicación distributiva en la estructura de memoria.
3.  **Transposición:** Intercambio de índices para transformar una matriz de $F \times C$ en una de $C \times F$.

---

## 🛠️ Próximo Paso (Al regresar)
* Analizar las ventajas de cada estructura de memoria.
* Tomar la decisión de diseño (¿Lista de filas o Lista plana?).
* Comenzar con la lógica del primer validador de dimensiones.