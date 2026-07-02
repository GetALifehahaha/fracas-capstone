import { useState } from 'react'
import { Map, MapControls } from '@/common/ui/map'
import { Card } from '@/common/ui/card'
import type { RiskFeatureCollection } from '../types/api'
import { featureBoundsById } from '../utils/bounds'
import BarangayChoropleth from './BarangayChoropleth'
import BarangayTooltip from './BarangayTooltip'

interface GISMapProps {
    data: RiskFeatureCollection | null
    selectedId: number | null
    onSelect: (id: number | null) => void
    panelWidth: number
}

/** Centre of a barangay's bounding box, to anchor its pinned tooltip. */
const centroidOf = (
    data: RiskFeatureCollection,
    id: number,
): [number, number] | null => {
    const box = featureBoundsById(data, id)
    return box ? [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2] : null
}

const GISMap = ({ data, selectedId, onSelect, panelWidth }: GISMapProps) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null)

    const pinnedCentroid =
        data && selectedId != null ? centroidOf(data, selectedId) : null
    const hoverCentroid =
        data && hoveredId != null && hoveredId !== selectedId
            ? centroidOf(data, hoveredId)
            : null

    return (
        <Card className='h-full p-0 overflow-hidden'>
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
            </Map>
        </Card>
    )
}

export default GISMap
