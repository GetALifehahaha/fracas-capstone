/** Branch ui-build runs with no backend — served from an in-memory mock db. */
import type { FloodActivity, Paginated } from '../types'
import { listMyActivity } from '@/mocks/db'
import { delay, paginate } from '@/mocks/utils'

export const getMyFloodActivity = async (): Promise<Paginated<FloodActivity>> => {
    await delay()
    return paginate(listMyActivity())
}
