import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import type { Feature, Point, Polygon } from 'geojson'
import type { GeoJSONSource } from 'maplibre-gl'
import { TriangleAlert } from 'lucide-react'
import {
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MapPopup,
    useMap,
} from '@/common/ui/map'
import { Badge } from '@/common/ui/badge'
import { useHotspots, useHotspotMutations } from './usePoi'
import HotspotPopupForm from './HotspotPopupForm'
import { circleRing, SEVERITY_COLOR } from './geo'
import type { HotspotProperties, HotspotSeverity, PoiLayerHandle } from './types'

const SOURCE = 'flood-hotspots'
const FILL = 'flood-hotspots-fill'
const LINE = 'flood-hotspots-line'
const DEFAULT_RADIUS = 300

type HotspotFeature = Feature<Point, HotspotProperties>

/** Live preview of the hotspot currently being edited, keyed by id or 'draft'. */
type Preview = { key: number | 'draft'; radius_m: number; severity: HotspotSeverity }

/** Parse the radius field, falling back to a sane default while it's empty. */
const parseRadius = (s: string): number => {
    const n = Number(s)
    return s === '' || Number.isNaN(n) || n <= 0 ? DEFAULT_RADIUS : n
}

interface AreaInput {
    lng: number
    lat: number
    radius_m: number
    severity: HotspotSeverity
}

/** Translucent radius circles drawn beneath the hotspot markers. */
const HotspotAreas = ({ areas }: { areas: AreaInput[] }) => {
    const { map, isLoaded } = useMap()

    const data = useMemo(
        () => ({
            type: 'FeatureCollection' as const,
            features: areas.map(
                (a): Feature<Polygon, { severity: string }> => ({
                    type: 'Feature',
                    properties: { severity: a.severity },
                    geometry: { type: 'Polygon', coordinates: [circleRing(a.lng, a.lat, a.radius_m)] },
                }),
            ),
        }),
        [areas],
    )

    useEffect(() => {
        if (!map || !isLoaded) return
        const color: (string | string[])[] = [
            'match',
            ['get', 'severity'],
            'low',
            SEVERITY_COLOR.low,
            'medium',
            SEVERITY_COLOR.medium,
            'high',
            SEVERITY_COLOR.high,
            '#f97316',
        ]
        map.addSource(SOURCE, { type: 'geojson', data })
        map.addLayer({
            id: FILL,
            type: 'fill',
            source: SOURCE,
            paint: { 'fill-color': color as never, 'fill-opacity': 0.18 },
        })
        map.addLayer({
            id: LINE,
            type: 'line',
            source: SOURCE,
            paint: { 'line-color': color as never, 'line-width': 1.5, 'line-opacity': 0.6, 'line-dasharray': [2, 1] },
        })
        return () => {
            if (!map.style) return
            for (const id of [FILL, LINE]) if (map.getLayer(id)) map.removeLayer(id)
            if (map.getSource(SOURCE)) map.removeSource(SOURCE)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded])

    useEffect(() => {
        if (!map || !isLoaded) return
        ;(map.getSource(SOURCE) as GeoJSONSource | undefined)?.setData(data)
    }, [map, isLoaded, data])

    return null
}

const Marker = ({ severity }: { severity: HotspotSeverity }) => (
    <div
        className='flex size-7 items-center justify-center rounded-full border-2 border-white shadow-lg'
        style={{ backgroundColor: SEVERITY_COLOR[severity] }}
    >
        <TriangleAlert className='size-4 text-white' />
    </div>
)

const ReadOnlyDetails = ({ p }: { p: HotspotProperties }) => (
    <div className='flex w-52 flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
            <span className='font-medium'>{p.name}</span>
            <Badge
                variant='outline'
                className='capitalize'
                style={{ borderColor: SEVERITY_COLOR[p.severity], color: SEVERITY_COLOR[p.severity] }}
            >
                {p.severity}
            </Badge>
        </div>
        <span className='text-amber-600 text-xs font-medium'>Elevated flood risk — flooded area</span>
        <span className='text-muted-foreground text-xs'>Radius: {p.radius_m} m</span>
        {p.description && <span className='text-muted-foreground text-xs'>{p.description}</span>}
        {p.barangay_name && <span className='text-muted-foreground text-xs'>{p.barangay_name}</span>}
    </div>
)

interface Props {
    visible: boolean
    editMode: boolean
    focusedBarangayId: number | null
}

const HotspotLayer = forwardRef<PoiLayerHandle, Props>(function HotspotLayer(
    { visible, editMode, focusedBarangayId },
    ref,
) {
    const { map } = useMap()
    const { data } = useHotspots()
    const { create, update, remove } = useHotspotMutations()
    const [draft, setDraft] = useState<{ lng: number; lat: number } | null>(null)
    const [preview, setPreview] = useState<Preview | null>(null)

    useImperativeHandle(
        ref,
        () => ({
            startAdd: () => {
                if (!map) return
                const c = map.getCenter()
                setDraft({ lng: c.lng, lat: c.lat })
                setPreview(null)
            },
            reset: () => {
                setDraft(null)
                setPreview(null)
            },
        }),
        [map],
    )

    const effectiveVisible = visible || editMode
    const features = (data?.features ?? []) as HotspotFeature[]
    const shown = effectiveVisible
        ? features
        : features.filter((f) => f.properties.barangay === focusedBarangayId)

    const areas: AreaInput[] = shown.map((f) => {
        const isPrev = preview?.key === f.properties.id
        return {
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
            radius_m: isPrev ? preview.radius_m : f.properties.radius_m,
            severity: isPrev ? preview.severity : f.properties.severity,
        }
    })
    const draftSeverity = preview?.key === 'draft' ? preview.severity : 'medium'
    if (editMode && draft)
        areas.push({
            lng: draft.lng,
            lat: draft.lat,
            radius_m: preview?.key === 'draft' ? preview.radius_m : DEFAULT_RADIUS,
            severity: draftSeverity,
        })

    return (
        <>
            <HotspotAreas areas={areas} />

            {shown.map((f) => {
                const [lng, lat] = f.geometry.coordinates
                const p = f.properties
                return (
                    <MapMarker
                        key={p.id}
                        longitude={lng}
                        latitude={lat}
                        draggable={editMode}
                        onClick={(e) => e.stopPropagation()}
                        onDragEnd={({ lng, lat }) =>
                            update.mutate({ id: p.id, payload: { latitude: lat, longitude: lng } })
                        }
                    >
                        <MarkerContent>
                            <Marker severity={p.severity} />
                        </MarkerContent>
                        <MarkerPopup closeButton className='max-w-72'>
                            {editMode ? (
                                <HotspotPopupForm
                                    initial={{
                                        name: p.name,
                                        severity: p.severity,
                                        radius_m: String(p.radius_m),
                                        description: p.description ?? '',
                                        is_active: p.is_active,
                                    }}
                                    saving={update.isPending || remove.isPending}
                                    onCancel={() => setPreview(null)}
                                    onChange={(v) =>
                                        setPreview({
                                            key: p.id,
                                            radius_m: parseRadius(v.radius_m),
                                            severity: v.severity,
                                        })
                                    }
                                    onDelete={() => {
                                        setPreview(null)
                                        remove.mutate(p.id)
                                    }}
                                    onSubmit={(v) => {
                                        setPreview(null)
                                        update.mutate({
                                            id: p.id,
                                            payload: {
                                                name: v.name.trim(),
                                                severity: v.severity,
                                                radius_m: v.radius_m === '' ? undefined : Number(v.radius_m),
                                                description: v.description.trim(),
                                                is_active: v.is_active,
                                            },
                                        })
                                    }}
                                />
                            ) : (
                                <ReadOnlyDetails p={p} />
                            )}
                        </MarkerPopup>
                    </MapMarker>
                )
            })}

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
                            <Marker severity={draftSeverity} />
                        </MarkerContent>
                    </MapMarker>
                    <MapPopup
                        longitude={draft.lng}
                        latitude={draft.lat}
                        closeButton
                        className='max-w-72'
                        onClose={() => {
                            setDraft(null)
                            setPreview(null)
                        }}
                    >
                        <HotspotPopupForm
                            initial={{ name: '', severity: 'medium', radius_m: '300', description: '', is_active: true }}
                            saving={create.isPending}
                            onCancel={() => {
                                setDraft(null)
                                setPreview(null)
                            }}
                            onChange={(v) =>
                                setPreview({
                                    key: 'draft',
                                    radius_m: parseRadius(v.radius_m),
                                    severity: v.severity,
                                })
                            }
                            onSubmit={(v) =>
                                create.mutate(
                                    {
                                        name: v.name.trim(),
                                        severity: v.severity,
                                        radius_m: v.radius_m === '' ? undefined : Number(v.radius_m),
                                        description: v.description.trim(),
                                        is_active: v.is_active,
                                        latitude: draft.lat,
                                        longitude: draft.lng,
                                    },
                                    {
                                        onSuccess: () => {
                                            setDraft(null)
                                            setPreview(null)
                                        },
                                    },
                                )
                            }
                        />
                    </MapPopup>
                </>
            )}
        </>
    )
})

export default HotspotLayer
