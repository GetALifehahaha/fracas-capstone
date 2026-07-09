import { useSettingsForm } from '../../hooks/useSettingsForm'
import type { OrganizationSettings } from '../../types/settings'
import { SettingsSection } from '../components/SettingsSection'
import { SaveBar, TextField } from '../components/fields'

const OrganizationForm = ({ initial }: { initial: OrganizationSettings }) => {
    const { form, setField, dirty, saving, save } = useSettingsForm('organization', initial)

    return (
        <div className='flex flex-col gap-5'>
            <TextField
                id='org_name'
                label='Organization name'
                description='Shown to clients and used as the default alert signature.'
                value={form.org_name}
                onChange={(v) => setField('org_name', v)}
            />
            <TextField
                id='system_title'
                label='System title'
                description='The name shown in the console header.'
                value={form.system_title}
                onChange={(v) => setField('system_title', v)}
            />
            <TextField
                id='contact_number'
                label='Contact number'
                value={form.contact_number}
                placeholder='e.g. (062) 991-xxxx'
                onChange={(v) => setField('contact_number', v)}
            />
            <TextField
                id='alert_footer'
                label='Alert footer'
                description='Signature appended to alert and broadcast messages. Defaults to “— {org name}”.'
                value={form.alert_footer}
                placeholder='— Zamboanga City DRRMO'
                onChange={(v) => setField('alert_footer', v)}
            />
            <SaveBar dirty={dirty} saving={saving} onSave={save} />
        </div>
    )
}

const OrganizationPanel = () => (
    <SettingsSection
        group='organization'
        title='Organization & branding'
        description='Identity shown in the console and appended to outgoing alerts.'
    >
        {(initial) => <OrganizationForm initial={initial} />}
    </SettingsSection>
)

export default OrganizationPanel
