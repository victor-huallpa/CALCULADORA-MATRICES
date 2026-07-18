import { useState } from 'react'
import MatrixBracket from './MatrixBracket.jsx'
import { formatNumber } from '../utils/matrixOperations.js'

/** Convierte el resultado (escalar o matriz) a texto plano, listo para pegar en Excel/Sheets. */
function resultToText(result) {
  if (typeof result === 'number') return formatNumber(result)
  return result.map((row) => row.map(formatNumber).join('\t')).join('\n')
}

export default function ResultDisplay({ result, operationLabel }) {
  const [copied, setCopied] = useState(false)

  if (result === null || result === undefined) return null

  const isScalar = typeof result === 'number'

  const handleCopy = async () => {
    const text = resultToText(result)
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      // Fallback para navegadores/entornos sin permiso de portapapeles
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      } catch (fallbackErr) {
        console.warn('[ResultDisplay] No se pudo copiar el resultado.', fallbackErr)
      }
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="animate-fadeUp rounded-xl border-2 border-accent bg-accent-light p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wide text-accent-dark">
          Resultado · {operationLabel}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/40 bg-panel px-3 py-1 font-mono text-[11px] font-semibold text-accent-dark shadow-sm transition hover:border-accent"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 animate-popIn" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l3.5 3.5L16 6" />
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="6.5" y="6.5" width="10" height="10" rx="1.5" />
                <path d="M4 13.5V5a1.5 1.5 0 0 1 1.5-1.5H13" strokeLinecap="round" />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>
      {isScalar ? (
        <p className="font-display text-3xl font-bold text-accent-dark">{formatNumber(result)}</p>
      ) : (
        <div className="overflow-x-auto">
          <MatrixBracket label="=">
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${result[0]?.length ?? 0}, minmax(2.75rem, 3.25rem))` }}
            >
              {result.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="grid h-11 place-items-center rounded-md bg-panel font-mono text-sm font-semibold text-accent-dark shadow-sm"
                  >
                    {formatNumber(cell)}
                  </div>
                )),
              )}
            </div>
          </MatrixBracket>
        </div>
      )}
    </div>
  )
}
