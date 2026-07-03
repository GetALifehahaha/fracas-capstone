import { useState } from 'react'
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
import { useUpdateProfile } from '../hooks/useCurrentUser'
import type { CurrentUser } from '../types'

/** Edit the signed-in user's name and email (djoser `/users/me/`). */
const EditProfileDialog = ({ user }: { user: CurrentUser }) => {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    })
    const update = useUpdateProfile()

    // Reset the fields to the latest profile whenever the dialog opens.
    const onOpenChange = (next: boolean) => {
        if (next) {
            setForm({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            })
            update.reset()
        }
        setOpen(next)
    }

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }))

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        update.mutate(form, { onSuccess: () => setOpen(false) })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger render={<Button size="lg" />}>Edit Profile Information</DialogTrigger>
            <DialogContent>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Update your display name and contact email.
                        </DialogDescription>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="first_name">First name</FieldLabel>
                        <Input id="first_name" value={form.first_name} onChange={set('first_name')} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="last_name">Last name</FieldLabel>
                        <Input id="last_name" value={form.last_name} onChange={set('last_name')} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input id="email" type="email" value={form.email} onChange={set('email')} />
                    </Field>

                    {update.isError && (
                        <FieldDescription className="text-red-500">
                            Couldn't save your changes. Please try again.
                        </FieldDescription>
                    )}

                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline" />}>
                            Cancel
                        </DialogClose>
                        <Button type="submit" disabled={update.isPending}>
                            {update.isPending ? 'Saving…' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog
