import { useQuery } from '@tanstack/react-query'
import { getRiskSnapshot } from '../api/gisApi'
import { gisKeys } from './queryKeys'

const REFRESH_MS = 5 * 60_000 // poll a little under the hourly pipeline cadence

/** Live risk snapshot for all barangays. Auto-refreshes to stay current. */
export const useRiskSnapshot = () =>
    useQuery({
        queryKey: gisKeys.snapshot,
        queryFn: getRiskSnapshot,
        refetchInterval: REFRESH_MS,
    })
