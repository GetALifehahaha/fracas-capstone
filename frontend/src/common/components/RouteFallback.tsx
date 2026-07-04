import { Hourglass } from 'lucide-react'

/** Full-viewport placeholder shown while a lazily-loaded route chunk downloads. */
const RouteFallback = () => {
    return (
        <div className='flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-2 text-black/50'>
            <Hourglass size={24} strokeOpacity={0.5} className='animate-spin' />
            <span className='text-sm font-medium'>Loading…</span>
        </div>
    )
}

export default RouteFallback
