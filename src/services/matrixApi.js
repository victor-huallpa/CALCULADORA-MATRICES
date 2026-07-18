/**
 * matrixApi.js
 * ---------------------------------------------------------------------------
 * "API" simulada. No existe ningún backend: este módulo expone funciones
 * async con la misma forma que tendría un cliente HTTP real (métodos que
 * devuelven promesas, con una pequeña latencia artificial y errores con
 * forma de respuesta HTTP), pero toda la persistencia ocurre en el
 * localStorage del navegador.
 *
 * La idea es que, si algún día se quisiera reemplazar esto por un backend
 * real (por ejemplo Express + una base de datos), solo habría que reescribir
 * el cuerpo de estas funciones para usar `fetch` — el resto de la app no
 * tendría que cambiar, porque ya consume esta interfaz como si fuera remota.
 */

import { OPERATIONS } from '../utils/matrixOperations.js'

const STORAGE_KEY = 'matrix-calculator:history:v1'
const SIMULATED_LATENCY_MS = 220

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const uuid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/** Simula una respuesta HTTP para mantener la interfaz "de API" */
class ApiError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

function readHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn('[matrixApi] Historial corrupto en localStorage, se reinicia.', err)
    return []
  }
}

function writeHistory(entries) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

/**
 * POST /operations
 * Ejecuta una operación matricial y guarda el ejercicio en el historial.
 */
export async function runOperation({ operationId, matrices, scalar }) {
  await delay(SIMULATED_LATENCY_MS)

  const op = OPERATIONS[operationId]
  if (!op) {
    throw new ApiError(`Operación desconocida: "${operationId}".`, 404)
  }

  const outcome = op.chainable
    ? op.run(matrices)
    : op.run(matrices[0], matrices[1] ?? null, scalar)

  const entry = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    operationId,
    operationLabel: op.label,
    matrices: op.chainable ? matrices : [matrices[0]],
    scalar: op.needsScalar ? scalar : null,
    result: outcome.result,
    error: outcome.error,
    stepCount: outcome.steps?.length ?? 0,
  }

  // Solo se guardan en el historial los ejercicios resueltos con éxito.
  if (!outcome.error) {
    const history = readHistory()
    history.unshift(entry)
    writeHistory(history.slice(0, 100)) // límite razonable de entradas
  }

  return { ...outcome, entry }
}

/**
 * GET /history
 */
export async function fetchHistory() {
  await delay(SIMULATED_LATENCY_MS / 2)
  return readHistory()
}

/**
 * DELETE /history/:id
 */
export async function deleteHistoryEntry(id) {
  await delay(SIMULATED_LATENCY_MS / 2)
  const history = readHistory().filter((entry) => entry.id !== id)
  writeHistory(history)
  return history
}

/**
 * DELETE /history
 */
export async function clearHistory() {
  await delay(SIMULATED_LATENCY_MS / 2)
  writeHistory([])
  return []
}
