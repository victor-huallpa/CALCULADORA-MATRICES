import { useCallback } from 'react'
import MatrixBracket from './MatrixBracket.jsx'
import { randomMatrix } from '../utils/matrixOperations.js'

const MIN_SIZE = 1
const MAX_SIZE = 6

// Tailwind necesita ver las clases completas en el código fuente para
// incluirlas en el build (JIT no expande `focus:border-${accent}`), por eso
// se resuelven aquí como un mapa estático en vez de interpolar el string.
const ACCENT_FOCUS_CLASSES = {
  accent: 'focus:border-accent focus:ring-accent',
  pivot: 'focus:border-pivot focus:ring-pivot',
}

function buildMatrix(rows, cols, prev) {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => prev?.[i]?.[j] ?? 0),
  )
}

/**
 * MatrixInput
 * label: 'A' | 'B' | 'C'...
 * value: number[][]
 * onChange: (matrix) => void
 * accent: clase de color tailwind para el foco (por defecto accent)
 * onRemove: si se pasa, muestra un botón para quitar esta matriz (matrices extra en operaciones encadenadas)
 */
export default function MatrixInput({ label, value, onChange, accent = 'accent', onRemove }) {
  const rows = value.length
  const cols = value[0]?.length ?? 0

  const resize = useCallback(
    (nextRows, nextCols) => {
      const r = Math.min(MAX_SIZE, Math.max(MIN_SIZE, nextRows))
      const c = Math.min(MAX_SIZE, Math.max(MIN_SIZE, nextCols))
      onChange(buildMatrix(r, c, value))
    },
    [onChange, value],
  )

  const setCell = (i, j, raw) => {
    const next = value.map((row) => [...row])
    next[i][j] = raw
    onChange(next)
  }

  const handleRandomize = () => onChange(randomMatrix(rows, cols))

  return (
    <div className="animate-fadeUp">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">
          Matriz {label}
          <span className="ml-2 font-mono text-xs font-normal text-ink-soft">
            {rows}×{cols}
          </span>
        </h3>
        <div className="flex items-center gap-3 font-mono text-xs text-ink-soft">
          <SizeStepper
            label="filas"
            value={rows}
            onDecrease={() => resize(rows - 1, cols)}
            onIncrease={() => resize(rows + 1, cols)}
          />
          <SizeStepper
            label="cols"
            value={cols}
            onDecrease={() => resize(rows, cols - 1)}
            onIncrease={() => resize(rows, cols + 1)}
          />
          <button
            type="button"
            onClick={handleRandomize}
            title={`Rellenar la matriz ${label} con valores al azar`}
            aria-label={`Rellenar la matriz ${label} con valores al azar`}
            className="grid h-6 w-6 place-items-center rounded border border-paper-line bg-panel text-sm text-ink hover:bg-accent-light hover:border-accent transition"
          >
            🎲
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              title={`Quitar la matriz ${label}`}
              aria-label={`Quitar la matriz ${label}`}
              className="grid h-6 w-6 place-items-center rounded border border-paper-line bg-panel text-warn hover:bg-warn-light hover:border-warn transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <MatrixBracket label={label}>
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.75rem, 3.5rem))` }}
          >
            {value.map((row, i) =>
              row.map((cell, j) => (
                <input
                  key={`${i}-${j}`}
                  inputMode="decimal"
                  aria-label={`Matriz ${label}, fila ${i + 1}, columna ${j + 1}`}
                  value={cell}
                  onChange={(e) => setCell(i, j, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={`h-11 w-full rounded-md border border-paper-line bg-panel text-center font-mono text-sm text-ink shadow-sm transition focus:outline-none focus:ring-1 ${ACCENT_FOCUS_CLASSES[accent] ?? ACCENT_FOCUS_CLASSES.accent}`}
                />
              )),
            )}
          </div>
        </MatrixBracket>
      </div>
    </div>
  )
}

function SizeStepper({ label, value, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center gap-1">
      <span>{label}</span>
      <button
        type="button"
        onClick={onDecrease}
        className="grid h-6 w-6 place-items-center rounded border border-paper-line bg-panel text-ink hover:bg-accent-light hover:border-accent transition"
        aria-label={`Disminuir ${label}`}
      >
        −
      </button>
      <span className="w-4 text-center text-ink">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="grid h-6 w-6 place-items-center rounded border border-paper-line bg-panel text-ink hover:bg-accent-light hover:border-accent transition"
        aria-label={`Aumentar ${label}`}
      >
        +
      </button>
    </div>
  )
}
