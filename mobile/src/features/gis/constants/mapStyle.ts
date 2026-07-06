import type { LngLat } from '@maplibre/maplibre-react-native'

/**
 * Basemap + camera constants for the flood-status map.
 *
 * Carto's positron/dark-matter GL styles are free and need no API key, so the
 * choropleth stays the visual lead over a muted basemap. The style is picked
 * from the active color scheme so the map matches the app's light/dark theme.
 */
const CARTO_STYLE = 'https://basemaps.cartocdn.com/gl/{id}-gl-style/style.json'

export const mapStyleFor = (scheme: 'light' | 'dark'): string =>
    CARTO_STYLE.replace('{id}', scheme === 'dark' ? 'dark-matter' : 'positron')

/** Zamboanga City — the fallback camera used until barangay bounds load. */
export const MAP_CENTER: LngLat = [122.07, 6.92]
export const MAP_ZOOM = 10.5

/** Inset kept clear of the phone edges when framing the city to bounds. */
export const MAP_PADDING = { top: 48, right: 48, bottom: 48, left: 48 }
