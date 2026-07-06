import { Droplets, Eye, EyeOff, Layers, Tent, TriangleAlert } from 'lucide-react'
import { Card } from '@/common/ui/card'

export interface LayerVisibility {
    dam: boolean
    evacuation: boolean
    hotspot: boolean
}

export type LayerKey = keyof LayerVisibility

const ROWS: { key: LayerKey; label: string; icon: typeof Droplets; color: string }[] = [
    { key: 'dam', label: 'Dam & river', icon: Droplets, color: '#2563eb' },
    { key: 'evacuation', label: 'Evacuation centers', icon: Tent, color: '#059669' },
    { key: 'hotspot', label: 'Flood hotspots', icon: TriangleAlert, color: '#f97316' },
]

interface Props {
    layers: LayerVisibility
    onToggle: (key: LayerKey) => void
}

/**
 * Toggle map POI layers on/off. When a layer is off its POIs still surface for
 * the focused barangay (handled by each layer), so this only governs the
 * city-wide view.
 */
const LayersControl = ({ layers, onToggle }: Props) => (
    <Card size='sm' className='absolute bottom-4 right-4 z-3 flex w-52 flex-col gap-1 px-2 py-2'>
        <div className='text-muted-foreground flex items-center gap-1.5 px-1 text-xs font-medium'>
            <Layers className='size-3.5' />
            Map layers
        </div>
        {ROWS.map(({ key, label, icon: Icon, color }) => {
            const on = layers[key]
            return (
                <button
                    key={key}
                    type='button'
                    onClick={() => onToggle(key)}
                    className='hover:bg-muted flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-sm transition-colors'
                >
                    <span className='flex items-center gap-2'>
                        <Icon className='size-4' style={{ color: on ? color : undefined }} />
                        <span className={on ? '' : 'text-muted-foreground'}>{label}</span>
                    </span>
                    {on ? (
                        <Eye className='size-4 text-foreground/70' />
                    ) : (
                        <EyeOff className='text-muted-foreground size-4' />
                    )}
                </button>
            )
        })}
    </Card>
)

export default LayersControl
