/** Shared helpers for the mock API layer (branch `ui-build` runs with no backend). */

/** Simulated network latency so loading states are visible in the UI. */
export const delay = (ms = 250): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export interface Paginated<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

const PAGE_SIZE = 25

/** Slice an in-memory array into a DRF-shaped page envelope. */
export const paginate = <T>(items: T[], page = 1, pageSize = PAGE_SIZE): Paginated<T> => {
    const start = (page - 1) * pageSize
    const results = items.slice(start, start + pageSize)
    const hasNext = start + pageSize < items.length
    const hasPrev = page > 1
    return {
        count: items.length,
        next: hasNext ? `?page=${page + 1}` : null,
        previous: hasPrev ? `?page=${page - 1}` : null,
        results,
    }
}

let counter = 10_000
/** Monotonically increasing id for records created during a mock session. */
export const nextId = (): number => ++counter

/** Deterministic 0..1 pseudo-random value seeded by an integer — stable across
 * renders/refetches so procedurally-derived detail doesn't flicker. */
export const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

/** Shift an ISO timestamp relative to "now" so time-sensitive fixtures (system
 * status, risk snapshot) don't look frozen in the past as a session goes on. */
export const minutesAgo = (minutes: number): string =>
    new Date(Date.now() - minutes * 60_000).toISOString()
