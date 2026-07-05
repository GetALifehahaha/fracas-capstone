import { EmptyState } from '@/common/components/EmptyState'
import { Screen } from '@/common/ui'

/** Flood status / GIS. Home + current-location barangay cards + nearest center land in Phase C. */
export function StatusScreen() {
    return (
        <Screen scroll={false} padded={false}>
            <EmptyState
                title="Flood status"
                message="Your home and current-location hazard, plus the nearest evacuation center, will appear here."
            />
        </Screen>
    )
}
