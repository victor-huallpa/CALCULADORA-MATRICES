/**
 * ScalarInput
 * ---------------------------------------------------------------------------
 * Tarjeta con la misma jerarquía visual que MatrixInput, pensada para vivir
 * dentro del área de trabajo (junto a la matriz A) en vez de quedar suelta al
 * final del selector de operación. Así, cuando la operación necesita un
 * escalar/constante (k × A, Aⁿ), el usuario lo ve y lo completa en el mismo
 * lugar donde completa las matrices.
 */
export default function ScalarInput({ label = 'k', value, onChange, description }) {
  const randomize = () => onChange(String(Math.floor(Math.random() * 9) - 4))

  return (
    <div className="animate-fadeUp">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink">
          Escalar
          <span className="ml-2 font-mono text-xs font-normal text-ink-soft">{label}</span>
        </h3>
        <button
          type="button"
          onClick={randomize}
          title={`Elegir un valor al azar para ${label}`}
          aria-label={`Elegir un valor al azar para ${label}`}
          className="grid h-6 w-6 place-items-center rounded border border-paper-line bg-panel text-sm text-ink hover:bg-accent-light hover:border-accent transition"
        >
          🎲
        </button>
      </div>

      <div className="flex h-[calc(100%-2.75rem)] min-h-[5.5rem] items-center justify-center rounded-xl border-2 border-dashed border-paper-line bg-panel/50 px-6 py-6">
        <label htmlFor="scalar-input" className="flex items-center gap-2.5">
          <span className="font-mono text-lg text-ink-soft">{label} =</span>
          <input
            id="scalar-input"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="h-12 w-24 rounded-md border border-paper-line bg-panel text-center font-mono text-lg text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>
      </div>

      {description && <p className="mt-2 font-body text-xs text-ink-soft">{description}</p>}
    </div>
  )
}
