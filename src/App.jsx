import { useEffect, useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import QuickGuide from './components/QuickGuide.jsx'
import MatrixInput from './components/MatrixInput.jsx'
import ScalarInput from './components/ScalarInput.jsx'
import OperationSelector from './components/OperationSelector.jsx'
import StepsDisplay from './components/StepsDisplay.jsx'
import ResultDisplay from './components/ResultDisplay.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import { OPERATIONS, randomMatrix } from './utils/matrixOperations.js'
import { runOperation, fetchHistory, deleteHistoryEntry, clearHistory } from './services/matrixApi.js'

const LETTERS = 'ABCDEFGH'.split('')

const DEFAULT_MATRIX_A = [
  [2, 1],
  [0, 3],
]
const DEFAULT_MATRIX_B = [
  [1, 4],
  [2, 1],
]

const SHOW_STEPS_KEY = 'matrix-calculator:showSteps'

// El procedimiento arranca oculto: el usuario lo activa solo si quiere verlo.
function getInitialShowSteps() {
  try {
    const stored = window.localStorage.getItem(SHOW_STEPS_KEY)
    return stored === null ? false : stored === 'true'
  } catch (err) {
    return false
  }
}

/** Convierte la matriz de strings (tal como vive en los inputs) a números para calcular. */
function toNumericMatrix(matrix) {
  return matrix.map((row) =>
    row.map((v) => {
      const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'))
      return Number.isFinite(n) ? n : 0
    }),
  )
}

export default function App() {
  // `matrices` guarda TODAS las matrices que el usuario haya llegado a usar
  // (A, B, C, ...). Para operaciones encadenables (suma/resta/multiplicación)
  // se usan todas; para el resto, solo la primera (A).
  const [matrices, setMatrices] = useState([DEFAULT_MATRIX_A, DEFAULT_MATRIX_B])
  const [operationId, setOperationId] = useState('add')
  const [scalar, setScalar] = useState('2')

  const [outcome, setOutcome] = useState(null) // { result, steps, error, entry }
  const [isCalculating, setIsCalculating] = useState(false)

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const [showSteps, setShowSteps] = useState(getInitialShowSteps)

  const op = OPERATIONS[operationId]
  const minMatrices = op.chainable ? op.minMatrices ?? 2 : 1
  const maxMatrices = op.chainable ? op.maxMatrices ?? 6 : 1
  const visibleMatrices = op.chainable ? matrices : matrices.slice(0, 1)

  useEffect(() => {
    try {
      window.localStorage.setItem(SHOW_STEPS_KEY, String(showSteps))
    } catch (err) {
      // localStorage no disponible; la preferencia simplemente no persiste
    }
  }, [showSteps])

  // Al cambiar de operación, aseguramos que haya al menos `minMatrices`
  // disponibles (por ejemplo, al pasar de "Transpuesta" a "Suma" hace falta
  // una segunda matriz B, que se agrega automáticamente si no existía).
  useEffect(() => {
    setMatrices((prev) => {
      if (prev.length >= minMatrices) return prev
      const last = prev[prev.length - 1] ?? DEFAULT_MATRIX_A
      const extra = Array.from({ length: minMatrices - prev.length }, () =>
        last.map((row) => row.map(() => 0)),
      )
      return [...prev, ...extra]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationId])

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    const entries = await fetchHistory()
    setHistory(entries)
    setHistoryLoading(false)
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const updateMatrixAt = (index, value) => {
    setMatrices((prev) => prev.map((m, i) => (i === index ? value : m)))
  }

  const addMatrix = () => {
    setMatrices((prev) => {
      if (prev.length >= maxMatrices) return prev
      const last = prev[prev.length - 1]
      const blank = last.map((row) => row.map(() => 0))
      return [...prev, blank]
    })
  }

  const removeMatrix = (index) => {
    setMatrices((prev) => {
      if (prev.length <= minMatrices) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleRandomizeAll = () => {
    setMatrices((prev) =>
      prev.map((m, i) => (op.chainable || i === 0 ? randomMatrix(m.length, m[0]?.length ?? 0) : m)),
    )
    if (op.needsScalar) {
      const max = operationId === 'power' ? 4 : 5
      const min = operationId === 'power' ? 0 : -5
      setScalar(String(Math.floor(Math.random() * (max - min + 1)) + min))
    }
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    try {
      const numericMatrices = visibleMatrices.map(toNumericMatrix)
      const result = await runOperation({
        operationId,
        matrices: numericMatrices,
        scalar: op.needsScalar ? parseFloat(String(scalar).replace(',', '.')) || 0 : null,
      })
      setOutcome(result)
      if (!result.error) {
        loadHistory()
      }
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSelectHistoryEntry = (entry) => {
    setOperationId(entry.operationId)
    if (entry.matrices?.length) setMatrices(entry.matrices)
    if (entry.scalar !== null && entry.scalar !== undefined) setScalar(String(entry.scalar))
    setOutcome(null)
    setIsHistoryOpen(false)
  }

  const handleDeleteEntry = async (id) => {
    const next = await deleteHistoryEntry(id)
    setHistory(next)
  }

  const handleClearHistory = async () => {
    const next = await clearHistory()
    setHistory(next)
  }

  return (
    <div className="min-h-screen bg-notebook">
      <div className="lg:flex">
        <div className="flex-1">
          <Header onOpenHistory={() => setIsHistoryOpen(true)} historyCount={history.length} />

          <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6">
            <QuickGuide />

            <section className="mb-8 rounded-2xl border border-paper-line bg-panel/70 p-5 shadow-sm transition-colors duration-300 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-ink">Área de trabajo</h3>
                <button
                  type="button"
                  onClick={handleRandomizeAll}
                  className="flex items-center gap-1.5 rounded-full border border-paper-line bg-panel px-3 py-1.5 font-mono text-xs text-ink transition hover:border-accent hover:text-accent"
                >
                  🎲 Rellenar al azar
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {visibleMatrices.map((matrix, i) => (
                  <MatrixInput
                    key={i}
                    label={LETTERS[i] ?? `M${i + 1}`}
                    value={matrix}
                    onChange={(value) => updateMatrixAt(i, value)}
                    accent={i === 0 ? 'accent' : 'pivot'}
                    onRemove={op.chainable && visibleMatrices.length > minMatrices ? () => removeMatrix(i) : undefined}
                  />
                ))}

                {op.needsScalar && (
                  <ScalarInput
                    label={op.scalarLabel ?? 'k'}
                    value={scalar}
                    onChange={setScalar}
                    description={op.scalarLabel === 'n' ? 'Exponente entero ≥ 0.' : undefined}
                  />
                )}
              </div>

              {op.chainable && visibleMatrices.length < maxMatrices && (
                <button
                  type="button"
                  onClick={addMatrix}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-paper-line px-4 py-2.5 font-mono text-sm text-ink-soft transition hover:border-accent hover:text-accent"
                >
                  + Agregar matriz {LETTERS[visibleMatrices.length] ?? ''}
                </button>
              )}

              {op.chainable && (
                <p className="mt-3 font-mono text-[11px] text-ink-soft">
                  {visibleMatrices.length} de {maxMatrices} matrices · mínimo {minMatrices}
                </p>
              )}

              <div className="my-6 border-t border-dashed border-paper-line" />

              <OperationSelector
                value={operationId}
                onChange={(id) => {
                  setOperationId(id)
                  setOutcome(null)
                }}
              />

              <button
                type="button"
                onClick={handleCalculate}
                disabled={isCalculating}
                className="mt-6 w-full rounded-xl bg-ink py-3.5 font-display text-sm font-semibold text-paper shadow-sm transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {isCalculating ? 'Calculando…' : `Resolver ${op.label}`}
              </button>
            </section>

            {outcome?.error && (
              <div className="mb-8 animate-fadeUp rounded-xl border border-warn/40 bg-warn-light px-4 py-3 font-body text-sm text-warn">
                {outcome.error}
              </div>
            )}

            {outcome && !outcome.error && (
              <section className="mb-10 space-y-6">
                <ResultDisplay result={outcome.result} operationLabel={op.label} />

                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-base font-semibold text-ink">Procedimiento</h2>
                    <label className="flex cursor-pointer select-none items-center gap-2 font-mono text-xs text-ink-soft">
                      <span>Ver procedimiento</span>
                      <span
                        role="switch"
                        aria-checked={showSteps}
                        tabIndex={0}
                        onClick={() => setShowSteps((v) => !v)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setShowSteps((v) => !v)
                          }
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          showSteps ? 'bg-accent' : 'bg-paper-line'
                        }`}
                      >
                        <span
                          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                          style={{ transform: showSteps ? 'translateX(1.125rem)' : 'translateX(0.2rem)' }}
                        />
                      </span>
                    </label>
                  </div>

                  {showSteps ? (
                    <StepsDisplay steps={outcome.steps} />
                  ) : (
                    <p className="rounded-xl border border-dashed border-paper-line bg-panel/50 px-4 py-3 font-body text-sm text-ink-soft">
                      El procedimiento está oculto. Activa "Ver procedimiento" para revisar cada paso del cálculo.
                    </p>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>

        <HistoryPanel
          entries={history}
          loading={historyLoading}
          onSelect={handleSelectHistoryEntry}
          onDelete={handleDeleteEntry}
          onClear={handleClearHistory}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      </div>
    </div>
  )
}
