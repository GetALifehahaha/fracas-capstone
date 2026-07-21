import type { SettingsByGroup } from '@/features/admin/types/settings'

const settingsFixture: SettingsByGroup = {
    alerting: {
        trigger_category: 'critical',
        renotify_interval_minutes: 60,
        send_all_clear: true,
        updated_at: '2026-07-09T10:53:41.027723Z',
    },
    retention: {
        rainfall_retention_days: 30,
        risk_score_retention_days: 90,
        flood_event_purge_grace_hours: 6,
        updated_at: '2026-07-09T10:53:43.772548Z',
    },
    organization: {
        org_name: 'FRACAS',
        system_title: 'FRACAS Console',
        contact_number: '',
        alert_footer: '',
        updated_at: '2026-07-09T10:53:42.242116Z',
    },
    toggles: {
        maintenance_mode: false,
        announcement_banner: '',
        broadcast_enabled: true,
        updated_at: '2026-07-09T10:53:42.896774Z',
    },
    registration: {
        self_registration_enabled: true,
        otp_ttl_minutes: 10,
        terms_version: '1',
        updated_at: '2026-07-09T23:23:41.707962Z',
    },
}

export default settingsFixture
