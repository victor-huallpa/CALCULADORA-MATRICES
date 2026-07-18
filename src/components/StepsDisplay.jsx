import MatrixBracket from './MatrixBracket.jsx'
import { formatNumber } from '../utils/matrixOperations.js'

function isHighlighted(highlight, i, j) {
  if (!highlight) return false
  if (highlight.rows?.includes(i)) return true
  if (highlight.cols?.includes(j)) return true
  if (highlight.cells?.some(([r, c]) => r === i && c === j)) return true
  return false
}

function StaticMatrix({ matrix, highlight }) {
  const cols = matrix[0]?.length ?? 0
  return (
    <MatrixBracket>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.75rem, 3rem))` }}>
        {matrix.map((row, i) =>
          row.map((cell, j) => {
            const hl = isHighlighted(highlight, i, j)
            return (
              <div
                key={`${i}-${j}`}
                className={`grid h-10 place-items-center rounded-md font-mono text-sm transition-colors ${
                  hl ? 'bg-pivot-light text-pivot-dark font-semibold animate-pulseCell' : 'text-ink'
                }`}
              >
                {formatNumber(cell)}
              </div>
            )
          }),
        )}
      </div>
    </MatrixBracket>
  )
}

function AugmentedMatrix({ augmented, highlight }) {
  const { left, right } = augmented
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-paper-line bg-panel px-3 py-2">
      <StaticMatrix matrix={left} highlight={highlight} />
      <span className="text-ink-soft">|</span>
      <StaticMatrix matrix={right} highlight={highlight} />
    </div>
  )
}

export default function StepsDisplay({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <ol className="space-y-4">
      {steps.map((step, idx) => (
        <li
          key={idx}
          className="animate-fadeUp rounded-xl border border-paper-line bg-panel p-4 shadow-sm"
          style={{ animationDelay: `${Math.min(idx, 8) * 35}ms` }}
        >
          <div className="mb-1 flex items-baseline gap-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-light font-mono text-[11px] font-semibold text-accent-dark">
              {idx + 1}
            </span>
            <p className="font-mono text-sm font-semibold text-ink">{step.title}</p>
          </div>
          <p className="mb-3 pl-7 font-body text-sm text-ink-soft">{step.description}</p>
          {(step.matrix || step.augmented) && (
            <div className="overflow-x-auto pb-1 pl-7">
              {step.augmented ? (
                <AugmentedMatrix augmented={step.augmented} highlight={step.highlight} />
              ) : (
                <StaticMatrix matrix={step.matrix} highlight={step.highlight} />
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
