import { formatNumber } from '../utils/matrixOperations.js'

function formatMatrixPreview(m) {
  if (!m) return ''
  return `${m.length}×${m[0]?.length ?? 0}`
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'hace un momento'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  return new Date(iso).toLocaleDateString()
}

export default function HistoryPanel({ entries, loading, onSelect, onDelete, onClear, isOpen, onClose }) {
  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar historial"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-[19rem] flex-col border-l border-paper-line bg-panel shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-paper-line px-4 py-4">
          <div>
            <h2 className="font-display text-sm font-semibold text-ink">Índice del cuaderno</h2>
            <p className="font-mono text-[11px] text-ink-soft">{entries.length} ejercicio(s) guardado(s)</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-paper lg:hidden"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-3">
          {loading && <p className="px-2 py-4 text-center font-mono text-xs text-ink-soft">Cargando historial…</p>}

          {!loading && entries.length === 0 && (
            <p className="px-2 py-6 text-center font-body text-sm text-ink-soft">
              Todavía no hay ejercicios resueltos. Cuando calcules algo, aparecerá aquí para que puedas volver a él.
            </p>
          )}

          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div className="group rounded-lg border border-paper-line bg-paper/60 p-3 transition hover:border-accent">
                  <button type="button" onClick={() => onSelect(entry)} className="block w-full text-left">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-accent-dark">{entry.operationLabel}</span>
                      <span className="font-mono text-[10px] text-ink-soft">{timeAgo(entry.createdAt)}</span>
                    </div>
                    <p className="font-mono text-[11px] text-ink-soft">
                      {(entry.matrices ?? [])
                        .map((m, i) => `${String.fromCharCode(65 + i)} (${formatMatrixPreview(m)})`)
                        .join(' · ')}
                      {entry.scalar !== null && entry.scalar !== undefined ? ` · k=${formatNumber(entry.scalar)}` : ''}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    className="mt-2 font-mono text-[10px] text-warn opacity-0 transition group-hover:opacity-100 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {entries.length > 0 && (
          <div className="border-t border-paper-line p-3">
            <button
              type="button"
              onClick={onClear}
              className="w-full rounded-md border border-warn/40 py-2 font-mono text-xs text-warn transition hover:bg-warn-light"
            >
              Vaciar historial
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
