/** Real evacuation centers, captured from the live dev backend (GET /api/evacuation/centers/). */
import type { EvacuationCenterCollection } from '@/features/gis/types'

const evacuationCentersFixture: EvacuationCenterCollection = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [122.076, 6.905] },
            properties: {
                id: 2,
                name: 'Don Pablo Lorenzo Memorial HS',
                capacity: 500,
                contact: 'DRRMO 09171234568',
                barangay: 57,
                barangay_name: 'Barangay Zone III (Pob.)',
            },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [122.08, 6.935] },
            properties: {
                id: 6,
                name: 'Tumaga Covered Court',
                capacity: 350,
                contact: 'DRRMO 09171234572',
                barangay: 88,
                barangay_name: 'Tumaga',
            },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [122.0600688388833, 6.912656640824892] },
            properties: {
                id: 3,
                name: 'WMSU Gymnasium',
                capacity: 1200,
                contact: 'DRRMO 09171234569',
                barangay: 3,
                barangay_name: 'Baliwasan',
            },
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [122.079, 6.9126] },
            properties: {
                id: 1,
                name: 'Zamboanga City High School (Main)',
                capacity: 800,
                contact: 'DRRMO 09171234567',
                barangay: 58,
                barangay_name: 'Barangay Zone IV (Pob.)',
            },
        },
    ],
}

export default evacuationCentersFixture
