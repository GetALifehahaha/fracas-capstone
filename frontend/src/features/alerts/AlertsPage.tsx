import { Badge } from '@/common/ui/badge'
import BroadcastForm from './component/BroadcastForm'
import AlertLogTable from './component/AlertLogTable'
import { useAlertEvents } from './hooks/useAlertEvents'

/** Phase 2 operator console: manual broadcast + system-wide alert audit log. */
const AlertsPage = () => {
    // Unfiltered first page — we only read `count` for the header chip; the
    // query is deduped with the table's own paged fetches by TanStack Query.
    const { data } = useAlertEvents({})
    const total = data?.count

    return (
        <div className='w-full p-4'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
                <div>
                    <h1 className='text-2xl font-semibold'>Alerts</h1>
                    <p className='text-xs text-black/50'>
                        Send manual advisories and review every alert the system has fired
                    </p>
                </div>
                {total != null && (
                    <Badge variant='secondary' className='h-6'>
                        {total.toLocaleString()} {total === 1 ? 'alert' : 'alerts'} logged
                    </Badge>
                )}
            </div>

            <BroadcastForm />
            <AlertLogTable />
        </div>
    )
}

export default AlertsPage
