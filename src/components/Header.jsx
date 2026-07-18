import ThemeToggle from './ThemeToggle.jsx'

export default function Header({ onOpenHistory, historyCount }) {
  return (
    <header className="border-b border-paper-line bg-paper/90 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink font-display text-lg font-bold text-paper">
            A
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight text-ink sm:text-xl">
              Cuaderno de Matrices
            </h1>
            <p className="font-mono text-[11px] text-ink-soft">calculadora con resolución paso a paso</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 rounded-full border border-paper-line bg-panel px-4 py-2 font-body text-sm text-ink shadow-sm transition hover:border-accent hover:text-accent lg:hidden"
          >
            Historial
            {historyCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-white">
                {historyCount}
              </span>
            )}
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
