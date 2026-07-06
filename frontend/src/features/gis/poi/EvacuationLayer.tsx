import { forwardRef, useImperativeHandle, useState } from 'react'
import type { Feature, Point } from 'geojson'
import { Tent } from 'lucide-react'
import {
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MapPopup,
} from '@/common/ui/map'
import { useMap } from '@/common/ui/map'
import { Badge } from '@/common/ui/badge'
import { useEvacuationCenters, useEvacuationMutations } from './usePoi'
import CenterPopupForm, { type CenterFormValues } from './CenterPopupForm'
import type { EvacuationProperties, PoiLayerHandle } from './types'

interface Props {
    /** Layer toggle. When off, only centers inside the focused barangay show. */
    visible: boolean
    /** Operator editing enabled (drag to move, add, edit, delete). */
    editMode: boolean
    focusedBarangayId: number | null
}

const Pin = ({ tone }: { tone: 'active' | 'inactive' | 'draft' }) => {
    const color =
        tone === 'draft' ? 'bg-amber-500' : tone === 'inactive' ? 'bg-slate-400' : 'bg-emerald-600'
    return (
        <div
            className={`flex size-7 items-center justify-center rounded-full border-2 border-white shadow-lg ${color}`}
        >
            <Tent className='size-4 text-white' />
        </div>
    )
}

const ReadOnlyDetails = ({ p }: { p: EvacuationProperties }) => (
    <div className='flex w-48 flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
            <span className='font-medium'>{p.name}</span>
            {!p.is_active && <Badge variant='secondary'>Inactive</Badge>}
        </div>
        {p.barangay_name && <span className='text-muted-foreground text-xs'>{p.barangay_name}</span>}
        <div className='text-xs'>
            {p.capacity != null && <div>Capacity: {p.capacity.toLocaleString()}</div>}
            {p.contact && <div>Contact: {p.contact}</div>}
        </div>
    </div>
)

type EvacFeature = Feature<Point, EvacuationProperties>

const ExistingMarker = ({
    feature,
    editMode,
    onMove,
    onSave,
    onDelete,
    saving,
}: {
    feature: EvacFeature
    editMode: boolean
    onMove: (lng: number, lat: number) => void
    onSave: (values: CenterFormValues) => void
    onDelete: () => void
    saving: boolean
}) => {
    const [lng, lat] = feature.geometry.coordinates
    const p = feature.properties
    return (
        <MapMarker
            longitude={lng}
            latitude={lat}
            draggable={editMode}
            onClick={(e) => e.stopPropagation()}
            onDragEnd={({ lng, lat }) => onMove(lng, lat)}
        >
            <MarkerContent>
                <Pin tone={p.is_active ? 'active' : 'inactive'} />
            </MarkerContent>
            <MarkerPopup closeButton>
                {editMode ? (
                    <CenterPopupForm
                        initial={{
                            name: p.name,
                            capacity: p.capacity != null ? String(p.capacity) : '',
                            contact: p.contact ?? '',
                            is_active: p.is_active,
                        }}
                        saving={saving}
                        onSubmit={onSave}
                        onCancel={() => undefined}
                        onDelete={onDelete}
                    />
                ) : (
                    <ReadOnlyDetails p={p} />
                )}
            </MarkerPopup>
        </MapMarker>
    )
}

const EvacuationLayer = forwardRef<PoiLayerHandle, Props>(function EvacuationLayer(
    { visible, editMode, focusedBarangayId },
    ref,
) {
    const { map } = useMap()
    const { data } = useEvacuationCenters()
    const { create, update, remove } = useEvacuationMutations()
    const [draft, setDraft] = useState<{ lng: number; lat: number } | null>(null)

    // Parent (the edit toolbar) drives adds/reset imperatively — no effects.
    useImperativeHandle(
        ref,
        () => ({
            startAdd: () => {
                if (!map) return
                const c = map.getCenter()
                setDraft({ lng: c.lng, lat: c.lat })
            },
            reset: () => setDraft(null),
        }),
        [map],
    )

    const effectiveVisible = visible || editMode
    const features = (data?.features ?? []) as EvacFeature[]
    const shown = effectiveVisible
        ? features
        : features.filter((f) => f.properties.barangay === focusedBarangayId)

    return (
        <>
            {shown.map((f) => (
                <ExistingMarker
                    key={f.properties.id}
                    feature={f}
                    editMode={editMode}
                    saving={update.isPending || remove.isPending}
                    onMove={(lng, lat) =>
                        update.mutate({ id: f.properties.id, payload: { latitude: lat, longitude: lng } })
                    }
                    onSave={(v) =>
                        update.mutate({
                            id: f.properties.id,
                            payload: {
                                name: v.name.trim(),
                                capacity: v.capacity === '' ? null : Number(v.capacity),
                                contact: v.contact.trim(),
                                is_active: v.is_active,
                            },
                        })
                    }
                    onDelete={() => remove.mutate(f.properties.id)}
                />
            ))}

            {editMode && draft && (
                <>
                    <MapMarker
                        longitude={draft.lng}
                        latitude={draft.lat}
                        draggable
                        onClick={(e) => e.stopPropagation()}
                        onDragEnd={({ lng, lat }) => setDraft({ lng, lat })}
                    >
                        <MarkerContent>
                            <Pin tone='draft' />
                        </MarkerContent>
                    </MapMarker>
                    <MapPopup longitude={draft.lng} latitude={draft.lat} closeButton onClose={() => setDraft(null)}>
                        <CenterPopupForm
                            initial={{ name: '', capacity: '', contact: '', is_active: true }}
                            saving={create.isPending}
                            onCancel={() => setDraft(null)}
                            onSubmit={(v) =>
                                create.mutate(
                                    {
                                        name: v.name.trim(),
                                        capacity: v.capacity === '' ? null : Number(v.capacity),
                                        contact: v.contact.trim(),
                                        is_active: v.is_active,
                                        latitude: draft.lat,
                                        longitude: draft.lng,
                                    },
                                    { onSuccess: () => setDraft(null) },
                                )
                            }
                        />
                    </MapPopup>
                </>
            )}
        </>
    )
})

export default EvacuationLayer
