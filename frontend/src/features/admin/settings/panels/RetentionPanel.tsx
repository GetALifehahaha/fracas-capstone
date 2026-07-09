import { useSettingsForm } from '../../hooks/useSettingsForm'
import type { RetentionPolicy } from '../../types/settings'
import { SettingsSection } from '../components/SettingsSection'
import { NumberField, SaveBar } from '../components/fields'

const RetentionForm = ({ initial }: { initial: RetentionPolicy }) => {
    const { form, setField, dirty, saving, save } = useSettingsForm('retention', initial)

    return (
        <div className='flex flex-col gap-5'>
            <NumberField
                id='rainfall_retention_days'
                label='Rainfall history'
                description='How long raw rainfall readings are kept before the daily cleanup prunes them.'
                value={form.rainfall_retention_days}
                suffix='days'
                onChange={(v) => setField('rainfall_retention_days', v)}
            />
            <NumberField
                id='risk_score_retention_days'
                label='Risk score history'
                description='Retention window for computed risk scores.'
                value={form.risk_score_retention_days}
                suffix='days'
                onChange={(v) => setField('risk_score_retention_days', v)}
            />
            <NumberField
                id='flood_event_purge_grace_hours'
                label='Flood-event purge grace'
                description='How long a soft-deleted flood event is recoverable before it is hard-deleted.'
                value={form.flood_event_purge_grace_hours}
                suffix='hours'
                onChange={(v) => setField('flood_event_purge_grace_hours', v)}
            />
            <SaveBar dirty={dirty} saving={saving} onSave={save} />
        </div>
    )
}

const RetentionPanel = () => (
    <SettingsSection
        group='retention'
        title='Data retention'
        description='Retention windows for the daily cleanup and flood-event purge tasks.'
    >
        {(initial) => <RetentionForm initial={initial} />}
    </SettingsSection>
)

export default RetentionPanel
