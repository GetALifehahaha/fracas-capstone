import type { LngLat, LngLatBounds } from '@maplibre/maplibre-react-native'
import type { FeatureCollection, GeoJsonProperties, Position } from 'geojson'

import type { BarangayGeometry } from '../types'

/**
 * Bounding-box helpers for framing the choropleth and anchoring pins. Ported
 * from the web console's `utils/bounds.ts`; the box order `[west, south, east,
 * north]` is exactly MapLibre's `LngLatBounds`, so results feed `fitBounds`
 * directly. Generic over feature properties so both the risk-joined collection
 * and the lean public boundaries (registration) share one implementation.
 */

const extend = (box: LngLatBounds, [lng, lat]: Position): void => {
    if (lng < box[0]) box[0] = lng
    if (lat < box[1]) box[1] = lat
    if (lng > box[2]) box[2] = lng
    if (lat > box[3]) box[3] = lat
}

const eachPosition = (geometry: BarangayGeometry, fn: (p: Position) => void): void => {
    const rings = geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates.flat()
    rings.forEach((ring) => ring.forEach(fn))
}

const emptyBox = (): LngLatBounds => [Infinity, Infinity, -Infinity, -Infinity]
const isValid = (box: LngLatBounds): boolean => box[0] !== Infinity

/** Bounding box of one geometry, or null when it has no coordinates. */
export const geometryBounds = (geometry: BarangayGeometry): LngLatBounds | null => {
    const box = emptyBox()
    eachPosition(geometry, (p) => extend(box, p))
    return isValid(box) ? box : null
}

/** Bounding box covering every feature in the collection. */
export const collectionBounds = <P extends GeoJsonProperties>(
    collection: FeatureCollection<BarangayGeometry, P>,
): LngLatBounds | null => {
    const box = emptyBox()
    collection.features.forEach((f) => eachPosition(f.geometry, (p) => extend(box, p)))
    return isValid(box) ? box : null
}

/** Centre of a bounding box — anchors a pin/label on the feature. */
export const centroidOf = (box: LngLatBounds): LngLat => [
    (box[0] + box[2]) / 2,
    (box[1] + box[3]) / 2,
]
