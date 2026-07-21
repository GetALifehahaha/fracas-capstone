/** Branch ui-build runs with no backend — served from static fixtures / mock db. */
import type { EvacuationCollection, Paginated, PoiKind, PoiLog } from './types'
import evacuationCentersFixture from '@/mocks/fixtures/evacuationCenters'
import { listPoiLogs } from '@/mocks/db'
import { delay, paginate } from '@/mocks/utils'

export const getEvacuationCenters = async (): Promise<EvacuationCollection> => {
    await delay()
    return evacuationCentersFixture
}

export const getPoiLogs = async (poiType?: PoiKind): Promise<Paginated<PoiLog>> => {
    await delay()
    return paginate(listPoiLogs(poiType))
}
