import { useRef, useState } from 'react'
import { History, MapPin, Plus, TriangleAlert } from 'lucide-react'
import { Map, MapControls } from '@/common/ui/map'
import { Card } from '@/common/ui/card'
import { Button } from '@/common/ui/button'
import { useAuth } from '@/features/auth/context/useAuth'
import type { DamGeoCollection, RiskFeatureCollection } from '../types/api'
import { featureBoundsById } from '../utils/bounds'
import BarangayChoropleth from './BarangayChoropleth'
import BarangayTooltip from './BarangayTooltip'
import DamLayer from './DamLayer'
import EvacuationLayer from '../poi/EvacuationLayer'
import HotspotLayer from '../poi/HotspotLayer'
import PoiLogDialog from '../poi/PoiLogDialog'
import LayersControl, { type LayerKey, type LayerVisibility } from './LayersControl'
import type { PoiLayerHandle } from '../poi/types'

interface GISMapProps {
    data: RiskFeatureCollection | null
    selectedId: number | null
    onSelect: (id: number | null) => void
    panelWidth: number
    damGeo: DamGeoCollection | undefined
    selectedDamId: number | null
    onSelectDam: (id: number) => void
}

/** Centre of a barangay's bounding box, to anchor its pinned tooltip. */
const centroidOf = (
    data: RiskFeatureCollection,
    id: number,
): [number, number] | null => {
    const box = featureBoundsById(data, id)
    return box ? [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2] : null
}

const GISMap = ({
    data,
    selectedId,
    onSelect,
    panelWidth,
    damGeo,
    selectedDamId,
    onSelectDam,
}: GISMapProps) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null)
    const { isOperator } = useAuth()
    const [poiEdit, setPoiEdit] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [layers, setLayers] = useState<LayerVisibility>({
        dam: true,
        evacuation: true,
        hotspot: true,
    })
    const toggleLayer = (key: LayerKey) => setLayers((l) => ({ ...l, [key]: !l[key] }))

    const evacRef = useRef<PoiLayerHandle>(null)
    const hotspotRef = useRef<PoiLayerHandle>(null)
    // Toggling edit off abandons any in-progress drafts.
    const togglePoiEdit = () =>
        setPoiEdit((editing) => {
            if (editing) {
                evacRef.current?.reset()
                hotspotRef.current?.reset()
            }
            return !editing
        })

    const pinnedCentroid =
        data && selectedId != null ? centroidOf(data, selectedId) : null
    const hoverCentroid =
        data && hoveredId != null && hoveredId !== selectedId
            ? centroidOf(data, hoveredId)
            : null

    return (
        <Card className='relative h-full p-0 overflow-hidden'>
            {/* Operator POI editing controls. */}
            {isOperator && (
                <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background/95 px-2 py-1.5 shadow-md backdrop-blur'>
                    <Button
                        size='sm'
                        variant={poiEdit ? 'default' : 'ghost'}
                        className='cursor-pointer rounded-full'
                        onClick={togglePoiEdit}
                    >
                        <MapPin className='size-4' />
                        {poiEdit ? 'Editing places' : 'Edit places'}
                    </Button>
                    {poiEdit && (
                        <>
                            <Button
                                size='sm'
                                variant='ghost'
                                className='cursor-pointer rounded-full'
                                onClick={() => evacRef.current?.startAdd()}
                            >
                                <Plus className='size-4' />
                                Add center
                            </Button>
                            <Button
                                size='sm'
                                variant='ghost'
                                className='cursor-pointer rounded-full'
                                onClick={() => hotspotRef.current?.startAdd()}
                            >
                                <TriangleAlert className='size-4' />
                                Add hotspot
                            </Button>
                        </>
                    )}
                    <Button
                        size='sm'
                        variant='ghost'
                        className='cursor-pointer rounded-full'
                        onClick={() => setHistoryOpen(true)}
                    >
                        <History className='size-4' />
                        History
                    </Button>
                </div>
            )}

            <Map center={[122.07, 6.92]} zoom={11} theme='light'>
                <MapControls position='bottom-left' showFullscreen={true} />
                {data && (
                    <>
                        <BarangayChoropleth
                            data={data}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onHover={setHoveredId}
                            panelWidth={panelWidth}
                        />
                        {/* Pinned tooltip for the selected barangay. */}
                        {selectedId != null && pinnedCentroid && (
                            <BarangayTooltip
                                data={data}
                                id={selectedId}
                                lngLat={pinnedCentroid}
                                pinned
                                onClose={() => onSelect(null)}
                            />
                        )}
                        {/* Transient tooltip while hovering a different barangay. */}
                        {hoveredId != null && hoveredId !== selectedId && hoverCentroid && (
                            <BarangayTooltip
                                data={data}
                                id={hoveredId}
                                lngLat={hoverCentroid}
                            />
                        )}
                    </>
                )}
                <DamLayer
                    data={damGeo}
                    visible={layers.dam}
                    selectedDamId={selectedDamId}
                    onSelectDam={onSelectDam}
                />
                <EvacuationLayer
                    ref={evacRef}
                    visible={layers.evacuation}
                    editMode={poiEdit}
                    focusedBarangayId={selectedId}
                />
                <HotspotLayer
                    ref={hotspotRef}
                    visible={layers.hotspot}
                    editMode={poiEdit}
                    focusedBarangayId={selectedId}
                />
            </Map>

            <LayersControl layers={layers} onToggle={toggleLayer} />
            <PoiLogDialog open={historyOpen} onOpenChange={setHistoryOpen} />
        </Card>
    )
}

export default GISMap
