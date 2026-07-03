import { useState } from 'react'
import { AxiosError } from 'axios'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/ui/dialog'
import { Field, FieldLabel, FieldDescription } from '@/common/ui/field'
import { Input } from '@/common/ui/input'
import { Button } from '@/common/ui/button'
import { useChangePassword } from '../hooks/useCurrentUser'

const EMPTY = { current_password: '', new_password: '', confirm: '' }

/** Flatten djoser's `{field: [msg]}` 400 body into a single readable line. */
const errorMessage = (error: unknown): string => {
    if (error instanceof AxiosError && error.response?.status === 400) {
        const data = error.response.data as Record<string, string[] | string>
        const first = Object.values(data)[0]
        if (Array.isArray(first)) return first[0]
        if (typeof first === 'string') return first
    }
    return 'Couldn’t change your password. Please try again.'
}

/** Change the account password via djoser `set_password`. */
const ChangePasswordDialog = () => {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [mismatch, setMismatch] = useState(false)
    const change = useChangePassword()

    const onOpenChange = (next: boolean) => {
        if (next) {
            setForm(EMPTY)
            setMismatch(false)
            change.reset()
        }
        setOpen(next)
    }

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }))

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (form.new_password !== form.confirm) {
            setMismatch(true)
            return
        }
        setMismatch(false)
        change.mutate(
            { current_password: form.current_password, new_password: form.new_password },
            { onSuccess: () => setOpen(false) },
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger render={<Button size="lg" variant="outline" />}>
                Change Password
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Change password</DialogTitle>
                        <DialogDescription>
                            Enter your current password, then choose a new one.
                        </DialogDescription>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="current_password">Current password</FieldLabel>
                        <Input
                            id="current_password"
                            type="password"
                            autoComplete="current-password"
                            value={form.current_password}
                            onChange={set('current_password')}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="new_password">New password</FieldLabel>
                        <Input
                            id="new_password"
                            type="password"
                            autoComplete="new-password"
                            value={form.new_password}
                            onChange={set('new_password')}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirm">Confirm new password</FieldLabel>
                        <Input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            value={form.confirm}
                            onChange={set('confirm')}
                        />
                        {mismatch && (
                            <FieldDescription className="text-red-500">
                                The new passwords don’t match.
                            </FieldDescription>
                        )}
                    </Field>

                    {change.isError && (
                        <FieldDescription className="text-red-500">
                            {errorMessage(change.error)}
                        </FieldDescription>
                    )}

                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline" />}>
                            Cancel
                        </DialogClose>
                        <Button type="submit" disabled={change.isPending}>
                            {change.isPending ? 'Updating…' : 'Update password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePasswordDialog
