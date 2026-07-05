import { z } from 'zod'
import { RequiredString } from '@/common/schema/schemas'

/** Operator broadcast: a target barangay and message; title is optional. */
export const BroadcastSchema = z.object({
    barangay: RequiredString('Barangay'),
    message: RequiredString('Message'),
})

/** Quick alert from the map panel (barangay comes from context; title optional). */
export const QuickAlertSchema = z.object({
    message: RequiredString('Message'),
})
