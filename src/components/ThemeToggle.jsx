import { useEffect, useState } from 'react'

const STORAGE_KEY = 'matrix-calculator:theme'

function getInitialIsDark() {
  if (typeof document === 'undefined') return false
  // El script inline en index.html ya aplicó la clase antes del primer
  // render, así que solo hace falta leerla para sincronizar el estado.
  return document.documentElement.classList.contains('dark')
}

/** Botón de sol/luna para alternar entre modo claro y oscuro, persistido en localStorage. */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialIsDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      window.localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
    } catch (err) {
      // localStorage no disponible (p.ej. modo privado); el tema simplemente no persiste
    }
  }, [isDark])

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-paper-line bg-panel text-ink shadow-sm transition hover:border-accent hover:text-accent"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5 animate-popIn" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4.5" />
          <path
            strokeLinecap="round"
            d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5 animate-popIn" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.5 14.2a8.5 8.5 0 1 1-10.7-10.7 7 7 0 0 0 10.7 10.7Z"
          />
        </svg>
      )}
    </button>
  )
}
