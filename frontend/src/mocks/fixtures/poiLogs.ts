/** POI audit log sample, captured from the live dev backend (GET /api/poi/logs/). */
import type { PoiLog } from '@/features/gis/poi/types'

const poiLogsFixture: PoiLog[] = [
    { id: 24, poi_type: 'hotspot', poi_id: 6, name: 'Rizal st.', action: 'created', longitude: 122.08505227723293, latitude: 6.904156756227209, detail: {}, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-07T03:09:15.374649Z' },
    { id: 23, poi_type: 'evacuation', poi_id: 3, name: 'WMSU Gymnasium', action: 'moved', longitude: 122.0600688388833, latitude: 6.912656640824892, detail: { moved: true, changed: {} }, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-07T00:11:12.191368Z' },
    { id: 22, poi_type: 'hotspot', poi_id: 3, name: 'Sta. Maria Lowland', action: 'deleted', longitude: 122.0705, latitude: 6.899, detail: {}, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-07T00:10:58.264282Z' },
    { id: 21, poi_type: 'evacuation', poi_id: 5, name: 'Sta. Maria Gymnasium', action: 'deleted', longitude: 122.07, latitude: 6.9, detail: {}, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-07T00:10:54.115425Z' },
    { id: 18, poi_type: 'hotspot', poi_id: 4, name: 'Canelar Creek Mouth', action: 'moved', longitude: 122.0729584997581, latitude: 6.908350738184723, detail: { moved: true, changed: {} }, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-06T23:39:17.951250Z' },
    { id: 17, poi_type: 'hotspot', poi_id: 2, name: 'Guiwan Junction', action: 'moved', longitude: 122.06398108643589, latitude: 6.9221946156721685, detail: { moved: true, changed: {} }, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-06T10:33:25.239310Z' },
    { id: 15, poi_type: 'evacuation', poi_id: 3, name: 'WMSU Gymnasium', action: 'moved', longitude: 122.06308102289597, latitude: 6.912913756826612, detail: { moved: true, changed: {} }, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-06T10:05:59.090364Z' },
    { id: 1, poi_type: 'hotspot', poi_id: 5, name: 'Test', action: 'created', longitude: 122.0901425507841, latitude: 6.925244369026927, detail: {}, editor: 2, editor_name: 'Root Root', editor_username: 'root', created_at: '2026-07-06T09:34:48.800193Z' },
]

export default poiLogsFixture
