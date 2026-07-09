import { useSettingsForm } from '../../hooks/useSettingsForm'
import type { RegistrationPolicy } from '../../types/settings'
import { SettingsSection } from '../components/SettingsSection'
import { NumberField, SaveBar, TextField, ToggleField } from '../components/fields'

const RegistrationForm = ({ initial }: { initial: RegistrationPolicy }) => {
    const { form, setField, dirty, saving, save } = useSettingsForm('registration', initial)

    return (
        <div className='flex flex-col gap-5'>
            <ToggleField
                id='self_registration_enabled'
                label='Self-registration'
                description='Allow the public app to start new resident registrations.'
                checked={form.self_registration_enabled}
                onChange={(v) => setField('self_registration_enabled', v)}
            />
            <NumberField
                id='otp_ttl_minutes'
                label='OTP lifetime'
                description='How long a phone-verification code stays valid.'
                value={form.otp_ttl_minutes}
                suffix='minutes'
                onChange={(v) => setField('otp_ttl_minutes', v)}
            />
            <TextField
                id='terms_version'
                label='Terms version'
                description='Bumping this can force residents to re-accept the terms.'
                value={form.terms_version}
                onChange={(v) => setField('terms_version', v)}
            />
            <SaveBar dirty={dirty} saving={saving} onSave={save} />
        </div>
    )
}

const RegistrationPanel = () => (
    <SettingsSection
        group='registration'
        title='Registration & accounts'
        description='Controls for public sign-up and phone verification.'
    >
        {(initial) => <RegistrationForm initial={initial} />}
    </SettingsSection>
)

export default RegistrationPanel
