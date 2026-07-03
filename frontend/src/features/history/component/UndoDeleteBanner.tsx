import { useNavigate } from 'react-router-dom'
import { RotateCcw, X } from 'lucide-react'
import { Button } from '@/common/ui/button'
import { useRestoreFloodEvent } from '../hooks/useFloodEventActions'

interface UndoDeleteBannerProps {
    eventId: number
    onDismiss: () => void
}

/** Recovery prompt shown after a soft-delete; restores the event within its window. */
const UndoDeleteBanner = ({ eventId, onDismiss }: UndoDeleteBannerProps) => {
    const navigate = useNavigate()
    const restore = useRestoreFloodEvent()

    const handleUndo = () =>
        restore.mutate(eventId, { onSuccess: () => navigate(`/history/${eventId}`) })

    return (
        <div className='mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm'>
            <span className='text-black/70'>
                Flood event deleted. It will be permanently purged in 6 hours.
            </span>
            <div className='flex items-center gap-1'>
                <Button
                    size='sm'
                    variant='outline'
                    className='cursor-pointer'
                    disabled={restore.isPending}
                    onClick={handleUndo}
                >
                    <RotateCcw className='size-4' />
                    {restore.isPending ? 'Restoring…' : 'Undo'}
                </Button>
                <Button
                    size='icon-sm'
                    variant='ghost'
                    className='cursor-pointer text-black/50'
                    aria-label='Dismiss'
                    onClick={onDismiss}
                >
                    <X className='size-4' />
                </Button>
            </div>
        </div>
    )
}

export default UndoDeleteBanner
