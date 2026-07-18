/**
 * MatrixBracket
 * ---------------------------------------------------------------------------
 * Envuelve cualquier contenido (una grilla de inputs, una grilla de números)
 * con corchetes de matriz dibujados a mano en SVG. Es el elemento de firma
 * visual de la aplicación: en vez de un <div> con bordes, cada matriz se ve
 * como una matriz de verdad, escrita en un cuaderno técnico.
 */
export default function MatrixBracket({ children, label, className = '' }) {
  return (
    <div className={`inline-flex items-stretch gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-end pb-1 pr-0.5 font-display text-sm font-semibold text-ink-soft select-none">
          {label}
        </div>
      )}
      <BracketEdge side="left" />
      <div className="py-2">{children}</div>
      <BracketEdge side="right" />
    </div>
  )
}

function BracketEdge({ side }) {
  const flip = side === 'right'
  return (
    <svg
      viewBox="0 0 14 100"
      preserveAspectRatio="none"
      className="w-2.5 shrink-0 text-ink-soft"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <path
        d="M 12 2 C 4 2, 4 8, 4 20 L 4 44 C 4 50, 2 50, 0 50 C 2 50, 4 50, 4 56 L 4 80 C 4 92, 4 98, 12 98"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
