import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/ui/select'
import { useSettingsForm } from '../../hooks/useSettingsForm'
import type { AlertingPolicy } from '../../types/settings'
import { SettingsSection } from '../components/SettingsSection'
import { NumberField, SaveBar, SettingRow, ToggleField } from '../components/fields'

const AlertingForm = ({ initial }: { initial: AlertingPolicy }) => {
    const { form, setField, dirty, saving, save } = useSettingsForm('alerting', initial)

    return (
        <div className='flex flex-col gap-5'>
            <SettingRow
                label='Trigger category'
                description='Minimum risk level that alerts subscribed residents. Applies on the next pipeline run.'
                htmlFor='trigger_category'
                control={
                    <Select
                        value={form.trigger_category}
                        onValueChange={(v) => setField('trigger_category', v as AlertingPolicy['trigger_category'])}
                    >
                        <SelectTrigger id='trigger_category' className='w-44'>
                            <SelectValue>{(v) => (v === 'high' ? 'High and above' : 'Critical only')}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='critical'>Critical only</SelectItem>
                            <SelectItem value='high'>High and above</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />
            <NumberField
                id='renotify_interval_minutes'
                label='Re-notify interval'
                description='Cooldown before re-alerting a barangay that stays in the trigger band.'
                value={form.renotify_interval_minutes}
                suffix='minutes'
                onChange={(v) => setField('renotify_interval_minutes', v)}
            />
            <ToggleField
                id='send_all_clear'
                label='Send all-clear notices'
                description='Notify residents when a barangay drops out of the trigger band.'
                checked={form.send_all_clear}
                onChange={(v) => setField('send_all_clear', v)}
            />
            <SaveBar dirty={dirty} saving={saving} onSave={save} />
        </div>
    )
}

const AlertingPanel = () => (
    <SettingsSection
        group='alerting'
        title='Alerting policy'
        description='When and how residents are alerted. Changes take effect on the next 15-minute cycle.'
    >
        {(initial) => <AlertingForm initial={initial} />}
    </SettingsSection>
)

export default AlertingPanel
