/** Branch ui-build runs with no backend — served from a static fixture. */
import type { AccountChange, Paginated } from '../types'
import accountChangesFixture from '@/mocks/fixtures/accountChanges'
import { delay, paginate } from '@/mocks/utils'

export const getAccountChanges = async (): Promise<Paginated<AccountChange>> => {
    await delay()
    return paginate(accountChangesFixture)
}
