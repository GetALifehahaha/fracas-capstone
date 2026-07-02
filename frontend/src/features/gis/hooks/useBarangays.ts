import { useQuery } from '@tanstack/react-query'
import { getBarangays } from '../api/gisApi'
import { gisKeys } from './queryKeys'

/** Barangay geometries. Effectively static, so cache them for the session. */
export const useBarangays = () =>
    useQuery({
        queryKey: gisKeys.barangays,
        queryFn: getBarangays,
        staleTime: Infinity,
        gcTime: Infinity,
    })
