import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/ui/popover'
import { Input } from '@/common/ui/input'
import type { RiskFeatureCollection } from '../types/api'

interface Props {
    data: RiskFeatureCollection | null
    onSelect: (id: number) => void
}

const MAX_RESULTS = 6

/**
 * Top-center barangay finder: type a name, pick a suggestion, and the map
 * focuses it (reuses the same `onSelect` the choropleth/cards drive).
 */
const BarangaySearch = ({ data, onSelect }: Props) => {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)

    const results = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q || !data) return []
        return data.features
            .filter((f) => f.properties.name.toLowerCase().includes(q))
            .slice(0, MAX_RESULTS)
    }, [data, query])

    const handlePick = (id: number, name: string) => {
        onSelect(id)
        setQuery(name)
        setOpen(false)
    }

    return (
        <Popover open={open && results.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <div className='relative flex items-center'>
                        <Search className='text-muted-foreground pointer-events-none absolute left-3 size-3.5' />
                        <Input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setOpen(true)
                            }}
                            onFocus={() => setOpen(true)}
                            placeholder='Search barangay…'
                            aria-label='Search barangay'
                            className='bg-background/95 h-9 w-64 rounded-full pl-8 shadow-md backdrop-blur'
                        />
                    </div>
                }
            />
            <PopoverContent align='start' sideOffset={6} className='w-64 gap-0.5 p-1'>
                {results.map((f) => (
                    <button
                        key={f.properties.id}
                        type='button'
                        onClick={() => handlePick(f.properties.id, f.properties.name)}
                        className='hover:bg-muted rounded-md px-2.5 py-1.5 text-left text-sm transition-colors'
                    >
                        {f.properties.name}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    )
}

export default BarangaySearch
