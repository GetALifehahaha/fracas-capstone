import { useQuery } from '@tanstack/react-query'
import { getDamStatus } from '../api/gisApi'
import { gisKeys } from './queryKeys'

const REFRESH_MS = 5 * 60_000

/** Live Pasonanca dam status for the dashboard widget. */
export const useDamStatus = () =>
    useQuery({
        queryKey: gisKeys.damStatus,
        queryFn: getDamStatus,
        refetchInterval: REFRESH_MS,
    })
