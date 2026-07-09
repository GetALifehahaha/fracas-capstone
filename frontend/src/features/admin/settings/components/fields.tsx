import type { ReactNode } from 'react'
import { Button } from '@/common/ui/button'
import { Checkbox } from '@/common/ui/checkbox'
import { Input } from '@/common/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/common/ui/field'

/** Save row for a settings panel: disabled until dirty; shows an unsaved hint. */
export const SaveBar = ({
    dirty,
    saving,
    onSave,
}: {
    dirty: boolean
    saving: boolean
    onSave: () => void
}) => (
    <div className='mt-6 flex items-center justify-end gap-3 border-t pt-4'>
        {dirty && <span className='text-xs text-muted-foreground'>Unsaved changes</span>}
        <Button size='sm' onClick={onSave} disabled={!dirty || saving}>
            {saving ? 'Saving…' : 'Save changes'}
        </Button>
    </div>
)

/** A labelled row: label + optional help on the left, the control on the right. */
export const SettingRow = ({
    label,
    description,
    htmlFor,
    control,
}: {
    label: string
    description?: string
    htmlFor?: string
    control: ReactNode
}) => (
    <Field orientation='horizontal' className='justify-between gap-6'>
        <FieldContent>
            <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
        <div className='shrink-0'>{control}</div>
    </Field>
)

export const ToggleField = ({
    id,
    label,
    description,
    checked,
    onChange,
}: {
    id: string
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
}) => (
    <SettingRow
        label={label}
        description={description}
        htmlFor={id}
        control={<Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />}
    />
)

export const NumberField = ({
    id,
    label,
    description,
    value,
    min = 1,
    suffix,
    onChange,
}: {
    id: string
    label: string
    description?: string
    value: number
    min?: number
    suffix?: string
    onChange: (value: number) => void
}) => (
    <SettingRow
        label={label}
        description={description}
        htmlFor={id}
        control={
            <div className='flex items-center gap-2'>
                <Input
                    id={id}
                    type='number'
                    min={min}
                    value={Number.isNaN(value) ? '' : value}
                    onChange={(e) => onChange(e.target.valueAsNumber)}
                    className='w-24'
                />
                {suffix && <span className='text-xs text-muted-foreground'>{suffix}</span>}
            </div>
        }
    />
)

export const TextField = ({
    id,
    label,
    description,
    value,
    placeholder,
    onChange,
}: {
    id: string
    label: string
    description?: string
    value: string
    placeholder?: string
    onChange: (value: string) => void
}) => (
    <SettingRow
        label={label}
        description={description}
        htmlFor={id}
        control={
            <Input
                id={id}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className='w-64'
            />
        }
    />
)
