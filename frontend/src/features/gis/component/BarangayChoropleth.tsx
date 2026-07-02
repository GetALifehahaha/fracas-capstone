import { useEffect, useRef } from 'react'
import type {
    GeoJSONSource,
    LngLatBoundsLike,
    Map as MapLibreMap,
    MapGeoJSONFeature,
    MapLayerMouseEvent,
} from 'maplibre-gl'
import { useMap } from '@/common/ui/map'
import type { RiskFeatureCollection } from '../types/api'
import { fillColorExpression } from '../constants/risk'
import { collectionBounds, featureBoundsById, type BBox } from '../utils/bounds'

const SOURCE = 'barangays'
const FILL = 'barangay-fill'
const DIM = 'barangay-dim'
const LINE = 'barangay-line'
const OUTLINE = 'barangay-selected'
const NONE_ID = -1

interface Props {
    data: RiskFeatureCollection
    selectedId: number | null
    onSelect: (id: number | null) => void
    /** Pixels reserved on the right for the detail panel (0 when closed). */
    panelWidth: number
}

/** First symbol (label) layer, so our fills sit under place names, not over them. */
const firstSymbolLayerId = (map: MapLibreMap): string | undefined =>
    map.getStyle().layers?.find((l) => l.type === 'symbol')?.id

const fitBox = (
    map: MapLibreMap,
    box: BBox,
    panelWidth: number,
    duration: number,
): void => {
    map.fitBounds(box as LngLatBoundsLike, {
        padding: { top: 64, bottom: 64, left: 64, right: 64 + panelWidth },
        maxZoom: 14,
        duration,
    })
}

const BarangayChoropleth = ({ data, selectedId, onSelect, panelWidth }: Props) => {
    const { map, isLoaded } = useMap()
    const hoveredRef = useRef<number | null>(null)
    const didFitRef = useRef(false)
    // Keep the latest handler reachable from the stable map listener.
    const onSelectRef = useRef(onSelect)
    useEffect(() => {
        onSelectRef.current = onSelect
    }, [onSelect])

    // Create source + layers once the style is ready.
    useEffect(() => {
        if (!map || !isLoaded) return
        const beforeId = firstSymbolLayerId(map)

        map.addSource(SOURCE, { type: 'geojson', data, promoteId: 'id' })

        map.addLayer(
            {
                id: FILL,
                type: 'fill',
                source: SOURCE,
                paint: { 'fill-color': fillColorExpression, 'fill-opacity': 0.8 },
            },
            beforeId,
        )
        // Darkens every barangay except the selected one (spotlight focus).
        map.addLayer(
            {
                id: DIM,
                type: 'fill',
                source: SOURCE,
                filter: ['!=', ['id'], NONE_ID],
                paint: { 'fill-color': '#0a0a0a', 'fill-opacity': 0 },
            },
            beforeId,
        )
        map.addLayer(
            {
                id: LINE,
                type: 'line',
                source: SOURCE,
                paint: {
                    'line-color': '#7f1d1d',
                    'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0.6],
                    'line-opacity': 0.35,
                },
            },
            beforeId,
        )
        map.addLayer(
            {
                id: OUTLINE,
                type: 'line',
                source: SOURCE,
                filter: ['==', ['id'], NONE_ID],
                paint: { 'line-color': '#7f1d1d', 'line-width': 2.5, 'line-opacity': 0.9 },
            },
            beforeId,
        )

        const handleClick = (e: MapLayerMouseEvent) => {
            const hit = map.queryRenderedFeatures(e.point, { layers: [FILL] })[0] as
                | MapGeoJSONFeature
                | undefined
            onSelectRef.current(hit ? Number(hit.id) : null)
        }
        const setHover = (id: number | null) => {
            if (hoveredRef.current === id) return
            if (hoveredRef.current != null)
                map.setFeatureState({ source: SOURCE, id: hoveredRef.current }, { hover: false })
            hoveredRef.current = id
            if (id != null) map.setFeatureState({ source: SOURCE, id }, { hover: true })
        }
        const handleMove = (e: MapLayerMouseEvent) => {
            map.getCanvas().style.cursor = 'pointer'
            setHover(e.features?.[0]?.id != null ? Number(e.features[0].id) : null)
        }
        const handleLeave = () => {
            map.getCanvas().style.cursor = ''
            setHover(null)
        }

        map.on('click', handleClick)
        map.on('mousemove', FILL, handleMove)
        map.on('mouseleave', FILL, handleLeave)

        return () => {
            map.off('click', handleClick)
            map.off('mousemove', FILL, handleMove)
            map.off('mouseleave', FILL, handleLeave)
            if (!map.style) return
            for (const id of [FILL, DIM, LINE, OUTLINE]) if (map.getLayer(id)) map.removeLayer(id)
            if (map.getSource(SOURCE)) map.removeSource(SOURCE)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded])

    // Push fresh joined data to the existing source (no layer churn).
    useEffect(() => {
        if (!map || !isLoaded) return
        const source = map.getSource(SOURCE) as GeoJSONSource | undefined
        source?.setData(data)
        if (!didFitRef.current) {
            const box = collectionBounds(data)
            if (box) {
                fitBox(map, box, panelWidth, 0)
                didFitRef.current = true
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded, data])

    // React to selection: spotlight the barangay and frame it in the visible area.
    useEffect(() => {
        if (!map || !isLoaded || !map.getLayer(DIM)) return
        const id = selectedId ?? NONE_ID
        map.setFilter(DIM, ['!=', ['id'], id])
        map.setPaintProperty(DIM, 'fill-opacity', selectedId != null ? 0.5 : 0)
        map.setFilter(OUTLINE, ['==', ['id'], id])

        if (selectedId != null) {
            const box = featureBoundsById(data, selectedId)
            if (box) fitBox(map, box, panelWidth, 800)
        } else if (didFitRef.current) {
            const box = collectionBounds(data)
            if (box) fitBox(map, box, panelWidth, 800)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded, selectedId, panelWidth])

    return null
}

export default BarangayChoropleth
