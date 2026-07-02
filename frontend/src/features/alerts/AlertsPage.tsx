import BroadcastForm from './component/BroadcastForm'
import AlertLogTable from './component/AlertLogTable'

/** Phase 2 operator console: manual broadcast + system-wide alert audit log. */
const AlertsPage = () => {
    return (
        <div className='w-full p-4'>
            <div>
                <h1 className='text-2xl font-semibold'>Alerts</h1>
                <p className='text-xs text-black/50'>
                    Send manual advisories and review every alert the system has fired
                </p>
            </div>

            <BroadcastForm />
            <AlertLogTable />
        </div>
    )
}

export default AlertsPage
