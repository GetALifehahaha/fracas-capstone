/** Compact "how long ago" label for a timestamp, or "never" when absent. */
export const lastRunLabel = (iso: string | null): string => {
    if (!iso) return 'never'
    const then = new Date(iso).getTime()
    const seconds = Math.max(0, Math.round((Date.now() - then) / 1000))
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.round(hours / 24)}d ago`
}
