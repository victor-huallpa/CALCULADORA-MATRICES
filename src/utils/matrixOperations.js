/**
 * matrixOperations.js
 * ---------------------------------------------------------------------------
 * Módulo puro (sin dependencias de React) con toda la lógica matemática de la
 * calculadora. Cada operación devuelve un objeto con la forma:
 *
 *   {
 *     result: number[][] | number | null,  // resultado final
 *     steps:  Step[],                      // narrativa paso a paso
 *     error:  string | null,               // mensaje de error legible
 *   }
 *
 * Un `Step` tiene la forma:
 *   {
 *     title: string,            // p.ej. "R2 → R2 − 2·R1"
 *     description: string,      // explicación en lenguaje natural
 *     matrix: number[][] | null // snapshot de la matriz en ese momento
 *     highlight: {              // qué resaltar en el snapshot (opcional)
 *       rows?: number[],
 *       cols?: number[],
 *       cells?: [number, number][]
 *     }
 *   }
 *
 * Todas las funciones son deterministas y no mutan las matrices originales.
 */

// ---------------------------------------------------------------------------
// Helpers genéricos
// ---------------------------------------------------------------------------

const clone = (m) => m.map((row) => [...row])

const dims = (m) => ({ rows: m.length, cols: m[0]?.length ?? 0 })

/** Redondea números casi-enteros para evitar ruido de punto flotante (-0, 1.9999999997...) */
export const cleanNumber = (n) => {
  if (Object.is(n, -0)) return 0
  // Se redondea a 6 decimales: suficiente precisión para el uso de la
  // calculadora y con margen de sobra para absorber el ruido de punto
  // flotante que se acumula en la eliminación gaussiana (típicamente ~1e-10).
  const rounded = Math.round(n * 1e6) / 1e6
  return Object.is(rounded, -0) ? 0 : rounded
}

const cleanMatrix = (m) => m.map((row) => row.map(cleanNumber))

/** Formatea un número para mostrarlo en la interfaz (fracción de máx. 4 decimales, sin ceros colgantes) */
export const formatNumber = (n) => {
  const c = cleanNumber(n)
  if (Number.isInteger(c)) return String(c)
  return c.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
}

/** Genera una matriz rows×cols con enteros al azar en [min, max] (para el botón "Rellenar al azar"). */
export function randomMatrix(rows, cols, min = -9, max = 9) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * (max - min + 1)) + min),
  )
}

export const isSquare = (m) => m.length > 0 && m.length === m[0].length

export const sameDimensions = (a, b) =>
  a.length === b.length && a.every((row, i) => row.length === b[i].length)

export const canMultiply = (a, b) => a[0].length === b.length

// ---------------------------------------------------------------------------
// Suma y resta
// ---------------------------------------------------------------------------

export function addMatrices(a, b) {
  if (!sameDimensions(a, b)) {
    return {
      result: null,
      steps: [],
      error: 'Las matrices deben tener las mismas dimensiones para sumarlas.',
    }
  }

  const { rows, cols } = dims(a)
  const result = a.map((row, i) => row.map((v, j) => cleanNumber(v + b[i][j])))

  const steps = [
    {
      title: 'Suma elemento a elemento',
      description: `Cada elemento resultante c[i][j] = a[i][j] + b[i][j]. Se recorren las ${rows}×${cols} posiciones.`,
      matrix: null,
      highlight: {},
    },
  ]

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      steps.push({
        title: `c[${i + 1}][${j + 1}] = ${formatNumber(a[i][j])} + ${formatNumber(b[i][j])}`,
        description: `Se suman los elementos en la posición fila ${i + 1}, columna ${j + 1}.`,
        matrix: null,
        highlight: {},
      })
    }
  }

  steps.push({
    title: 'Resultado final',
    description: 'Matriz resultante tras sumar todas las posiciones.',
    matrix: result,
    highlight: {},
  })

  return { result, steps, error: null }
}

export function subtractMatrices(a, b) {
  if (!sameDimensions(a, b)) {
    return {
      result: null,
      steps: [],
      error: 'Las matrices deben tener las mismas dimensiones para restarlas.',
    }
  }

  const { rows, cols } = dims(a)
  const result = a.map((row, i) => row.map((v, j) => cleanNumber(v - b[i][j])))

  const steps = [
    {
      title: 'Resta elemento a elemento',
      description: `Cada elemento resultante c[i][j] = a[i][j] − b[i][j]. Se recorren las ${rows}×${cols} posiciones.`,
      matrix: null,
      highlight: {},
    },
  ]

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      steps.push({
        title: `c[${i + 1}][${j + 1}] = ${formatNumber(a[i][j])} − ${formatNumber(b[i][j])}`,
        description: `Se restan los elementos en la posición fila ${i + 1}, columna ${j + 1}.`,
        matrix: null,
        highlight: {},
      })
    }
  }

  steps.push({
    title: 'Resultado final',
    description: 'Matriz resultante tras restar todas las posiciones.',
    matrix: result,
    highlight: {},
  })

  return { result, steps, error: null }
}

// ---------------------------------------------------------------------------
// Multiplicación
// ---------------------------------------------------------------------------

export function multiplyMatrices(a, b) {
  if (!canMultiply(a, b)) {
    return {
      result: null,
      steps: [],
      error: `No se puede multiplicar: A es ${a.length}×${a[0].length} y B es ${b.length}×${b[0].length}. El número de columnas de A debe igualar el número de filas de B.`,
    }
  }

  const rows = a.length
  const cols = b[0].length
  const inner = b.length
  const result = Array.from({ length: rows }, () => Array(cols).fill(0))

  const steps = [
    {
      title: 'Regla fila × columna',
      description: `El resultado tendrá ${rows}×${cols} elementos. Cada c[i][j] es el producto punto de la fila i de A con la columna j de B.`,
      matrix: null,
      highlight: {},
    },
  ]

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0
      const terms = []
      for (let k = 0; k < inner; k++) {
        sum += a[i][k] * b[k][j]
        terms.push(`${formatNumber(a[i][k])}·${formatNumber(b[k][j])}`)
      }
      sum = cleanNumber(sum)
      result[i][j] = sum
      steps.push({
        title: `c[${i + 1}][${j + 1}] = ${terms.join(' + ')} = ${formatNumber(sum)}`,
        description: `Producto punto de la fila ${i + 1} de A con la columna ${j + 1} de B.`,
        matrix: null,
        highlight: { rows: [i], cols: [j] },
      })
    }
  }

  steps.push({
    title: 'Resultado final',
    description: 'Matriz producto A×B.',
    matrix: result,
    highlight: {},
  })

  return { result, steps, error: null }
}

// ---------------------------------------------------------------------------
// Encadenado de N matrices (suma, resta, multiplicación con 2 o más matrices)
// ---------------------------------------------------------------------------

const CHAIN_FNS = { add: addMatrices, subtract: subtractMatrices, multiply: multiplyMatrices }
const CHAIN_SYMBOLS = { add: '+', subtract: '−', multiply: '×' }
const CHAIN_NAMES = { add: 'suma', subtract: 'resta', multiply: 'multiplicación' }
const CHAIN_VERBS = { add: 'suma', subtract: 'resta', multiply: 'multiplica' }

/**
 * Aplica una operación binaria (suma, resta o multiplicación) a una lista de
 * 2 o más matrices, encadenando de izquierda a derecha:
 *   ((A op B) op C) op D ...
 * Reutiliza los pasos de cada operación par a par para narrar el procedimiento
 * completo.
 */
export function chainMatrices(matrices, opId) {
  const fn = CHAIN_FNS[opId]
  const symbol = CHAIN_SYMBOLS[opId]

  if (!fn) {
    return { result: null, steps: [], error: 'Operación no válida para encadenar matrices.' }
  }
  if (!Array.isArray(matrices) || matrices.length < 2) {
    return { result: null, steps: [], error: 'Se necesitan al menos 2 matrices para esta operación.' }
  }

  const letters = 'ABCDEFGHIJ'
  const steps = []

  if (matrices.length > 2) {
    const chainLabel = letters.slice(0, matrices.length).split('').join(` ${symbol} `)
    steps.push({
      title: `Encadenando ${matrices.length} matrices`,
      description: `Se resuelve de izquierda a derecha: ${chainLabel}. Cada resultado parcial se usa como entrada del siguiente paso.`,
      matrix: null,
      highlight: {},
    })
  }

  let acc = matrices[0]
  let accLabel = letters[0]

  for (let idx = 1; idx < matrices.length; idx++) {
    const next = matrices[idx]
    const nextLabel = letters[idx] ?? `M${idx + 1}`
    const outcome = fn(acc, next)

    if (outcome.error) {
      return {
        result: null,
        steps,
        error: `Al calcular ${accLabel} ${symbol} ${nextLabel}: ${outcome.error}`,
      }
    }

    if (matrices.length > 2) {
      steps.push({
        title: `Paso ${idx} de ${matrices.length - 1}: ${accLabel} ${symbol} ${nextLabel}`,
        description: `Se ${CHAIN_VERBS[opId]} el resultado acumulado (${accLabel}) con la matriz ${nextLabel}.`,
        matrix: null,
        highlight: {},
      })
    }

    steps.push(...outcome.steps)

    acc = outcome.result
    accLabel = idx === matrices.length - 1 ? 'Resultado' : `R${idx}`
  }

  if (matrices.length > 2) {
    steps.push({
      title: 'Resultado final de la cadena',
      description: `${CHAIN_NAMES[opId]} de las ${matrices.length} matrices, resuelta en orden.`,
      matrix: acc,
      highlight: {},
    })
  }

  return { result: acc, steps, error: null }
}

export function scalarMultiply(a, k) {
  const result = a.map((row) => row.map((v) => cleanNumber(v * k)))
  const steps = [
    {
      title: `Multiplicación por escalar k = ${formatNumber(k)}`,
      description: 'Cada elemento de la matriz se multiplica por el escalar k.',
      matrix: null,
      highlight: {},
    },
    {
      title: 'Resultado final',
      description: `Matriz resultante tras multiplicar todos los elementos por ${formatNumber(k)}.`,
      matrix: result,
      highlight: {},
    },
  ]
  return { result, steps, error: null }
}

// ---------------------------------------------------------------------------
// Transposición
// ---------------------------------------------------------------------------

export function transposeMatrix(a) {
  const { rows, cols } = dims(a)
  const result = Array.from({ length: cols }, (_, j) => Array.from({ length: rows }, (_, i) => a[i][j]))

  const steps = [
    {
      title: 'Intercambio de filas por columnas',
      description: `La fila i se convierte en la columna i. La matriz pasa de ${rows}×${cols} a ${cols}×${rows}.`,
      matrix: null,
      highlight: {},
    },
    {
      title: 'Resultado final',
      description: 'Matriz transpuesta Aᵀ.',
      matrix: result,
      highlight: {},
    },
  ]

  return { result, steps, error: null }
}

// ---------------------------------------------------------------------------
// Eliminación gaussiana (usada por determinante, rango y RREF)
// ---------------------------------------------------------------------------

/**
 * Lleva una matriz a forma escalonada (no necesariamente reducida), registrando
 * cada paso. Devuelve también el número de intercambios de fila (para el signo
 * del determinante) y el factor acumulado por pivotes usados en la eliminación.
 */
function forwardEliminate(matrix, steps, { trackDeterminant = false } = {}) {
  const m = clone(matrix)
  const rows = m.length
  const cols = m[0].length
  let swaps = 0
  let pivotRow = 0

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    // Pivoteo parcial: busca la fila con mayor valor absoluto en esta columna
    let maxRow = pivotRow
    for (let r = pivotRow + 1; r < rows; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[maxRow][col])) maxRow = r
    }

    if (Math.abs(m[maxRow][col]) < 1e-10) continue // columna nula en esta sub-matriz

    if (maxRow !== pivotRow) {
      ;[m[pivotRow], m[maxRow]] = [m[maxRow], m[pivotRow]]
      swaps++
      steps.push({
        title: `F${pivotRow + 1} ↔ F${maxRow + 1}`,
        description: `Se intercambian las filas ${pivotRow + 1} y ${maxRow + 1} para colocar el mayor pivote posible en la columna ${col + 1}.`,
        matrix: cleanMatrix(m),
        highlight: { rows: [pivotRow, maxRow] },
      })
    }

    for (let r = pivotRow + 1; r < rows; r++) {
      const factor = m[r][col] / m[pivotRow][col]
      if (Math.abs(factor) < 1e-12) continue
      for (let c = 0; c < cols; c++) {
        m[r][c] = cleanNumber(m[r][c] - factor * m[pivotRow][c])
      }
      steps.push({
        title: `F${r + 1} → F${r + 1} − (${formatNumber(factor)})·F${pivotRow + 1}`,
        description: `Se elimina el elemento en la columna ${col + 1} de la fila ${r + 1} usando el pivote de la fila ${pivotRow + 1}.`,
        matrix: cleanMatrix(m),
        highlight: { rows: [pivotRow, r], cells: [[r, col]] },
      })
    }

    pivotRow++
  }

  return { matrix: m, swaps, rank: pivotRow }
}

// ---------------------------------------------------------------------------
// Determinante
// ---------------------------------------------------------------------------

export function determinant(a) {
  if (!isSquare(a)) {
    return { result: null, steps: [], error: 'El determinante solo está definido para matrices cuadradas.' }
  }

  const n = a.length

  if (n === 1) {
    return {
      result: a[0][0],
      steps: [
        { title: 'Caso base 1×1', description: 'El determinante de una matriz 1×1 es su único elemento.', matrix: a, highlight: {} },
      ],
      error: null,
    }
  }

  if (n === 2) {
    const det = cleanNumber(a[0][0] * a[1][1] - a[0][1] * a[1][0])
    return {
      result: det,
      steps: [
        {
          title: `det(A) = a·d − b·c`,
          description: `det(A) = (${formatNumber(a[0][0])})(${formatNumber(a[1][1])}) − (${formatNumber(a[0][1])})(${formatNumber(a[1][0])}) = ${formatNumber(det)}`,
          matrix: a,
          highlight: { cells: [[0, 0], [1, 1], [0, 1], [1, 0]] },
        },
      ],
      error: null,
    }
  }

  const steps = [
    {
      title: 'Estrategia: eliminación gaussiana',
      description: 'Para matrices de 3×3 en adelante, se lleva la matriz a forma triangular superior. El determinante es el producto de la diagonal, ajustado por el signo de los intercambios de fila.',
      matrix: a,
      highlight: {},
    },
  ]

  const { matrix: triangular, swaps } = forwardEliminate(a, steps, { trackDeterminant: true })

  let det = swaps % 2 === 0 ? 1 : -1
  const diagTerms = []
  for (let i = 0; i < n; i++) {
    det *= triangular[i][i]
    diagTerms.push(formatNumber(triangular[i][i]))
  }
  det = cleanNumber(det)

  steps.push({
    title: 'Producto de la diagonal',
    description: `det(A) = ${swaps % 2 === 0 ? '' : '(−1) · '}(${diagTerms.join(' · ')}) = ${formatNumber(det)}${swaps > 0 ? ` (se aplicó (−1)^${swaps} por los intercambios de fila)` : ''}`,
    matrix: triangular,
    highlight: { cells: Array.from({ length: n }, (_, i) => [i, i]) },
  })

  return { result: det, steps, error: null }
}

// ---------------------------------------------------------------------------
// Eliminación de Gauss (forma escalonada, sin normalizar ni reducir)
// ---------------------------------------------------------------------------

export function gaussianElimination(a) {
  const steps = [
    {
      title: 'Objetivo: forma escalonada (Gauss)',
      description:
        'Se aplican operaciones de fila para obtener ceros debajo de cada pivote, de arriba hacia abajo. A diferencia de Gauss-Jordan, no se normalizan los pivotes ni se limpia por encima de ellos.',
      matrix: a,
      highlight: {},
    },
  ]

  const { matrix, rank } = forwardEliminate(a, steps)
  const result = cleanMatrix(matrix)

  steps.push({
    title: 'Resultado final',
    description: `Forma escalonada de A (triangular superior si A es cuadrada y de rango completo). Rango = ${rank}.`,
    matrix: result,
    highlight: {},
  })

  return { result, steps, error: null, rank }
}

// ---------------------------------------------------------------------------
// Traza
// ---------------------------------------------------------------------------

export function traceMatrix(a) {
  if (!isSquare(a)) {
    return { result: null, steps: [], error: 'La traza solo está definida para matrices cuadradas.' }
  }

  const n = a.length
  const terms = []
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += a[i][i]
    terms.push(formatNumber(a[i][i]))
  }
  sum = cleanNumber(sum)

  const steps = [
    {
      title: 'Suma de la diagonal principal',
      description: `tr(A) = ${terms.join(' + ')} = ${formatNumber(sum)}`,
      matrix: a,
      highlight: { cells: Array.from({ length: n }, (_, i) => [i, i]) },
    },
  ]

  return { result: sum, steps, error: null }
}

// ---------------------------------------------------------------------------
// Potencia de matriz (A^n, n entero ≥ 0)
// ---------------------------------------------------------------------------

export function powerMatrix(a, k) {
  if (!isSquare(a)) {
    return { result: null, steps: [], error: 'La potencia solo está definida para matrices cuadradas.' }
  }

  const n = Math.round(k)
  if (!Number.isFinite(n) || n < 0) {
    return { result: null, steps: [], error: 'El exponente n debe ser un entero mayor o igual a 0.' }
  }

  if (n === 0) {
    const identity = a.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)))
    return {
      result: identity,
      steps: [
        {
          title: 'A⁰ = I',
          description: 'Cualquier matriz cuadrada elevada a la potencia 0 es la matriz identidad.',
          matrix: identity,
          highlight: {},
        },
      ],
      error: null,
    }
  }

  const steps = [
    {
      title: `Cálculo de A^${n}`,
      description:
        n === 1
          ? 'A¹ es la matriz A sin cambios.'
          : `Se multiplica A por sí misma ${n - 1} vez${n - 1 === 1 ? '' : 'es'} adicional${n - 1 === 1 ? '' : 'es'}, acumulando el resultado.`,
      matrix: a,
      highlight: {},
    },
  ]

  let result = clone(a)
  for (let p = 2; p <= n; p++) {
    const step = multiplyMatrices(result, a)
    result = step.result
    steps.push({
      title: `A^${p} = A^${p - 1} × A`,
      description: `Se multiplica el resultado anterior (A^${p - 1}) por A nuevamente.`,
      matrix: result,
      highlight: {},
    })
  }

  steps.push({
    title: 'Resultado final',
    description: `Matriz resultante A^${n}.`,
    matrix: result,
    highlight: {},
  })

  return { result, steps, error: null }
}

// ---------------------------------------------------------------------------
// Inversa (Gauss-Jordan sobre la matriz aumentada [A | I])
// ---------------------------------------------------------------------------

export function inverseMatrix(a) {
  if (!isSquare(a)) {
    return { result: null, steps: [], error: 'La inversa solo está definida para matrices cuadradas.' }
  }

  const n = a.length
  let m = a.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))])

  const snapshot = (mat) => ({
    left: mat.map((row) => row.slice(0, n)),
    right: mat.map((row) => row.slice(n)),
  })

  const steps = [
    {
      title: 'Matriz aumentada [A | I]',
      description: 'Se adjunta la matriz identidad a la derecha de A. El objetivo es convertir el lado izquierdo en la identidad mediante operaciones de fila; lo que ocurra en la derecha será A⁻¹.',
      augmented: snapshot(m),
      matrix: null,
      highlight: {},
    },
  ]

  // Eliminación hacia adelante con pivoteo parcial, aplicada a toda la fila aumentada
  for (let col = 0; col < n; col++) {
    let maxRow = col
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[maxRow][col])) maxRow = r
    }

    if (Math.abs(m[maxRow][col]) < 1e-10) {
      return {
        result: null,
        steps,
        error: 'La matriz es singular (determinante = 0) y no tiene inversa.',
      }
    }

    if (maxRow !== col) {
      ;[m[col], m[maxRow]] = [m[maxRow], m[col]]
      steps.push({
        title: `F${col + 1} ↔ F${maxRow + 1}`,
        description: `Se intercambian filas para obtener un pivote no nulo en la columna ${col + 1}.`,
        augmented: snapshot(m),
        matrix: null,
        highlight: { rows: [col, maxRow] },
      })
    }

    const pivot = m[col][col]
    if (Math.abs(pivot - 1) > 1e-10) {
      m[col] = m[col].map((v) => cleanNumber(v / pivot))
      steps.push({
        title: `F${col + 1} → F${col + 1} ÷ ${formatNumber(pivot)}`,
        description: `Se normaliza la fila ${col + 1} para que el pivote valga 1.`,
        augmented: snapshot(m),
        matrix: null,
        highlight: { rows: [col] },
      })
    }

    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const factor = m[r][col]
      if (Math.abs(factor) < 1e-12) continue
      m[r] = m[r].map((v, c) => cleanNumber(v - factor * m[col][c]))
      steps.push({
        title: `F${r + 1} → F${r + 1} − (${formatNumber(factor)})·F${col + 1}`,
        description: `Se elimina el elemento de la columna ${col + 1} en la fila ${r + 1}.`,
        augmented: snapshot(m),
        matrix: null,
        highlight: { rows: [col, r] },
      })
    }
  }

  const result = m.map((row) => row.slice(n).map(cleanNumber))

  steps.push({
    title: 'Resultado final',
    description: 'El lado izquierdo es ahora la identidad; el lado derecho es A⁻¹.',
    matrix: result,
    highlight: {},
  })

  return { result, steps, error: null }
}

// ---------------------------------------------------------------------------
// Forma escalonada reducida (RREF) y rango
// ---------------------------------------------------------------------------

export function rref(a) {
  const steps = [
    {
      title: 'Objetivo: forma escalonada reducida',
      description: 'Se aplican operaciones de fila para obtener 1s en los pivotes y 0s por encima y por debajo de cada uno.',
      matrix: a,
      highlight: {},
    },
  ]

  let m = clone(a)
  const rows = m.length
  const cols = m[0].length
  let pivotRow = 0

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let maxRow = pivotRow
    for (let r = pivotRow + 1; r < rows; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[maxRow][col])) maxRow = r
    }
    if (Math.abs(m[maxRow][col]) < 1e-10) continue

    if (maxRow !== pivotRow) {
      ;[m[pivotRow], m[maxRow]] = [m[maxRow], m[pivotRow]]
      steps.push({
        title: `F${pivotRow + 1} ↔ F${maxRow + 1}`,
        description: `Se coloca el mayor pivote disponible en la columna ${col + 1}.`,
        matrix: cleanMatrix(m),
        highlight: { rows: [pivotRow, maxRow] },
      })
    }

    const pivot = m[pivotRow][col]
    if (Math.abs(pivot - 1) > 1e-10) {
      m[pivotRow] = m[pivotRow].map((v) => cleanNumber(v / pivot))
      steps.push({
        title: `F${pivotRow + 1} → F${pivotRow + 1} ÷ ${formatNumber(pivot)}`,
        description: `Se normaliza el pivote de la fila ${pivotRow + 1} a 1.`,
        matrix: cleanMatrix(m),
        highlight: { rows: [pivotRow] },
      })
    }

    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue
      const factor = m[r][col]
      if (Math.abs(factor) < 1e-12) continue
      m[r] = m[r].map((v, c) => cleanNumber(v - factor * m[pivotRow][c]))
      steps.push({
        title: `F${r + 1} → F${r + 1} − (${formatNumber(factor)})·F${pivotRow + 1}`,
        description: `Se anula el elemento de la columna ${col + 1} en la fila ${r + 1}.`,
        matrix: cleanMatrix(m),
        highlight: { rows: [pivotRow, r] },
      })
    }

    pivotRow++
  }

  m = cleanMatrix(m)

  steps.push({
    title: 'Resultado final',
    description: `Forma escalonada reducida. Rango = ${pivotRow}.`,
    matrix: m,
    highlight: {},
  })

  return { result: m, steps, error: null, rank: pivotRow }
}

export function matrixRank(a) {
  const { result, steps, rank } = rref(a)
  return { result: rank, steps, error: null, rref: result }
}

// ---------------------------------------------------------------------------
// Registro central de operaciones (usado por la UI y por el servicio simulado)
// ---------------------------------------------------------------------------

export const OPERATIONS = {
  add: {
    label: 'Suma (A + B + …)',
    needsB: true,
    chainable: true,
    minMatrices: 2,
    maxMatrices: 6,
    needsScalar: false,
    hint: 'Suma dos o más matrices elemento a elemento. Todas deben tener la misma dimensión. Puedes agregar más matrices con "+ Agregar matriz".',
    run: (matrices) => chainMatrices(matrices, 'add'),
  },
  subtract: {
    label: 'Resta (A − B − …)',
    needsB: true,
    chainable: true,
    minMatrices: 2,
    maxMatrices: 6,
    needsScalar: false,
    hint: 'Resta las matrices en orden: A − B − C … Todas deben tener la misma dimensión.',
    run: (matrices) => chainMatrices(matrices, 'subtract'),
  },
  multiply: {
    label: 'Multiplicación (A × B × …)',
    needsB: true,
    chainable: true,
    minMatrices: 2,
    maxMatrices: 6,
    needsScalar: false,
    hint: 'Multiplica las matrices en orden: A × B × C … Las dimensiones deben encadenar (columnas de una = filas de la siguiente).',
    run: (matrices) => chainMatrices(matrices, 'multiply'),
  },
  scalar: {
    label: 'Escalar (k × A)',
    needsB: false,
    needsScalar: true,
    scalarLabel: 'k',
    hint: 'Multiplica cada elemento de A por el número k que definas abajo.',
    run: (a, _b, k) => scalarMultiply(a, k),
  },
  power: {
    label: 'Potencia (Aⁿ)',
    needsB: false,
    needsScalar: true,
    scalarLabel: 'n',
    hint: 'Multiplica A por sí misma n veces (n entero ≥ 0). A debe ser cuadrada.',
    run: (a, _b, n) => powerMatrix(a, n),
  },
  transpose: {
    label: 'Transpuesta (Aᵀ)',
    needsB: false,
    needsScalar: false,
    hint: 'Intercambia filas por columnas de A.',
    run: (a) => transposeMatrix(a),
  },
  determinant: {
    label: 'Determinante |A|',
    needsB: false,
    needsScalar: false,
    hint: 'Calcula el determinante de A mediante eliminación gaussiana. A debe ser cuadrada.',
    run: (a) => determinant(a),
  },
  trace: {
    label: 'Traza tr(A)',
    needsB: false,
    needsScalar: false,
    hint: 'Suma los elementos de la diagonal principal de A. A debe ser cuadrada.',
    run: (a) => traceMatrix(a),
  },
  inverse: {
    label: 'Inversa (A⁻¹)',
    needsB: false,
    needsScalar: false,
    hint: 'Calcula A⁻¹ llevando la matriz aumentada [A | I] a [I | A⁻¹] con Gauss-Jordan. A debe ser cuadrada y con determinante distinto de 0.',
    run: (a) => inverseMatrix(a),
  },
  gauss: {
    label: 'Eliminación de Gauss',
    needsB: false,
    needsScalar: false,
    hint: 'Lleva A a su forma escalonada (triangular superior), dejando ceros debajo de cada pivote.',
    run: (a) => gaussianElimination(a),
  },
  gaussJordan: {
    label: 'Gauss-Jordan (RREF)',
    needsB: false,
    needsScalar: false,
    hint: 'Lleva A a su forma escalonada reducida: pivotes en 1 y ceros arriba y abajo de cada pivote.',
    run: (a) => rref(a),
  },
  rank: {
    label: 'Rango de A',
    needsB: false,
    needsScalar: false,
    hint: 'Calcula el número de filas (o columnas) linealmente independientes de A, usando Gauss-Jordan.',
    run: (a) => matrixRank(a),
  },
}
