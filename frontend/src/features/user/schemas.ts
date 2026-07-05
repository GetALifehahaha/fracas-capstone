import { z } from 'zod'
import { EmailProp, PhoneProp, RequiredString, ZipProp } from '@/common/schema/schemas'

/** Editable profile fields (flat view for validation; PSGC selects stay optional). */
export const ProfileSchema = z.object({
    first_name: RequiredString('First name'),
    last_name: RequiredString('Last name'),
    email: EmailProp,
    phone_number: PhoneProp,
    zip_code: ZipProp,
})

/** Change-password form; the refine replaces the old ad-hoc mismatch check. */
export const PasswordChangeSchema = z
    .object({
        current_password: RequiredString('Current password'),
        new_password: z.string().min(8, 'Use at least 8 characters'),
        confirm: RequiredString('Confirmation'),
    })
    .refine((d) => d.new_password === d.confirm, {
        message: 'Passwords do not match',
        path: ['confirm'],
    })
