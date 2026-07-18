/** @type {import('tailwindcss').Config} */

// Todos los colores del tema se resuelven a partir de variables CSS (definidas
// en src/index.css para :root y para .dark). Así, la app puede cambiar entre
// modo claro/oscuro con una sola clase en <html>, sin duplicar clases de
// Tailwind por componente.
function themeColor(variable) {
  return `rgb(var(${variable}) / <alpha-value>)`
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: themeColor('--color-paper'),
        'paper-line': themeColor('--color-paper-line'),
        ink: themeColor('--color-ink'),
        'ink-soft': themeColor('--color-ink-soft'),
        accent: {
          DEFAULT: themeColor('--color-accent'),
          light: themeColor('--color-accent-light'),
          dark: themeColor('--color-accent-dark'),
        },
        pivot: {
          DEFAULT: themeColor('--color-pivot'),
          light: themeColor('--color-pivot-light'),
          dark: themeColor('--color-pivot-dark'),
        },
        warn: {
          DEFAULT: themeColor('--color-warn'),
          light: themeColor('--color-warn-light'),
        },
        panel: themeColor('--color-panel'),
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgb(var(--color-paper-line) / 0.7) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-paper-line) / 0.7) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      keyframes: {
        pulseCell: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(var(--color-pivot) / 0.35)' },
          '50%': { boxShadow: '0 0 0 6px rgb(var(--color-pivot) / 0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        pulseCell: 'pulseCell 1.4s ease-in-out infinite',
        fadeUp: 'fadeUp 0.35s ease-out',
        popIn: 'popIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
