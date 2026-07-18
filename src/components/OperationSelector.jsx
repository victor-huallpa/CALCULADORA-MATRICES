import { OPERATIONS } from '../utils/matrixOperations.js'

const GROUPS = [
  { title: 'Entre dos matrices', ids: ['add', 'subtract', 'multiply'] },
  { title: 'Con un escalar', ids: ['scalar', 'power'] },
  { title: 'Propiedades de A', ids: ['transpose', 'determinant', 'trace', 'inverse'] },
  { title: 'Eliminación por filas', ids: ['gauss', 'gaussJordan', 'rank'] },
]

export default function OperationSelector({ value, onChange }) {
  const activeOp = OPERATIONS[value]

  return (
    <div className="animate-fadeUp">
      <h3 className="mb-3 font-display text-base font-semibold text-ink">Operación</h3>
      <div className="space-y-4">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.ids.map((id) => {
                const op = OPERATIONS[id]
                const active = value === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onChange(id)}
                    className={`rounded-full border px-3.5 py-1.5 font-body text-sm transition ${
                      active
                        ? 'border-accent bg-accent text-white shadow-sm'
                        : 'border-paper-line bg-panel text-ink hover:border-accent hover:text-accent'
                    }`}
                    aria-pressed={active}
                  >
                    {op.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {activeOp?.hint && (
        <p className="mt-4 animate-fadeUp rounded-lg bg-accent-light px-3 py-2 font-body text-xs leading-relaxed text-accent-dark sm:text-sm">
          💡 {activeOp.hint}
        </p>
      )}
    </div>
  )
}
