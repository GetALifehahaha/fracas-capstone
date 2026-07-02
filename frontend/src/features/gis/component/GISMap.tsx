import { Map, MapControls } from '@/common/ui/map'
import { Card } from '@/common/ui/card'
import type { RiskFeatureCollection } from '../types/api'
import BarangayChoropleth from './BarangayChoropleth'

interface GISMapProps {
    data: RiskFeatureCollection | null
    selectedId: number | null
    onSelect: (id: number | null) => void
    panelWidth: number
}

const GISMap = ({ data, selectedId, onSelect, panelWidth }: GISMapProps) => {
    return (
        <Card className='h-full p-0 overflow-hidden'>
            <Map center={[122.07, 6.92]} zoom={11} theme='light'>
                <MapControls position='bottom-left' showFullscreen={true} />
                {data && (
                    <BarangayChoropleth
                        data={data}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        panelWidth={panelWidth}
                    />
                )}
            </Map>
        </Card>
    )
}

export default GISMap
