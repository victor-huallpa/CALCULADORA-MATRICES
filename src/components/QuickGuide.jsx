const STEPS = [
  { n: 1, text: 'Elige la operación que quieres resolver.' },
  { n: 2, text: 'Completa los valores de la(s) matriz(ces).' },
  { n: 3, text: 'Presiona "Resolver" y revisa el resultado y el procedimiento.' },
]

/** Franja compacta de bienvenida: le dice al usuario, en 3 pasos, cómo usar la calculadora. */
export default function QuickGuide() {
  return (
    <section
      aria-label="Cómo usar la calculadora"
      className="mb-6 animate-fadeUp rounded-2xl border border-dashed border-paper-line bg-panel/50 px-4 py-3 transition-colors duration-300 sm:px-5"
    >
      <ol className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
        {STEPS.map((step, idx) => (
          <li key={step.n} className="flex items-center gap-2.5">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-light font-mono text-xs font-semibold text-accent-dark">
              {step.n}
            </span>
            <span className="font-body text-sm text-ink-soft">{step.text}</span>
            {idx < STEPS.length - 1 && (
              <span className="hidden text-paper-line sm:inline" aria-hidden="true">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
