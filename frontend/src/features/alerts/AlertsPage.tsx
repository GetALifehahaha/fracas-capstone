import BroadcastForm from './component/BroadcastForm'
import AlertLogTable from './component/AlertLogTable'

/** Phase 2 operator console: manual broadcast + system-wide alert audit log. */
const AlertsPage = () => {
    return (
        <div className='mx-auto flex h-full w-full max-w-6xl flex-col gap-4 p-2'>
            <div>
                <h1 className='text-xl font-semibold tracking-wide text-black/75'>Alerts</h1>
                <p className='text-sm text-muted-foreground'>
                    Send manual advisories and review every alert the system has fired.
                </p>
            </div>

            <div className='grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(20rem,24rem)_1fr]'>
                <BroadcastForm />
                <AlertLogTable />
            </div>
        </div>
    )
}

export default AlertsPage
