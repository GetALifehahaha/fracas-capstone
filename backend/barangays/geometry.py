"""Display-geometry generalization for hazard-susceptibility zones.

The authoritative `geom` is a vectorized raster: ~150k pixel-sized polygons
citywide (67% of them under 200 m^2), 1.16M vertices at ~15-digit precision.
Served raw that is a ~45 MB GeoJSON payload — far more than a translucent map
backdrop needs, and slow to parse/render in the browser.

`rebuild_simplified_geometry` regenerates the `geom_simplified` display field
from `geom` by dropping sub-pixel slivers, dissolving adjacent pixels, snapping
to a ~20 m grid and simplifying. That cuts the payload ~4x (and vertices ~2x)
with no visible change at city zoom. `geom` is never touched, so the risk engine
(which scores on `level`/`area_sqm`, not geometry) and any future re-derivation
stay exact, and the rebuild is safe to re-run.
"""

from django.db import connection

# Tuned against the Zamboanga hazard shapefile. Degrees at ~7 deg N:
# 0.0002 deg ~= 22 m, 0.0003 deg ~= 33 m. The sliver filter is metric (geography
# cast) so it is latitude-independent.
MIN_PART_SQM = 200.0
SNAP_GRID_DEG = 0.0002
SIMPLIFY_TOLERANCE_DEG = 0.0003

# Per row: dump `geom` into its component polygons, drop sub-`MIN_PART_SQM`
# slivers, dissolve the survivors (ST_Union), snap to a grid so coincident pixel
# edges collapse, simplify, and coerce back to a MultiPolygon. ST_MakeValid
# guards the union against the self-touching pixels that ST_SnapToGrid can
# otherwise turn into topology errors; ST_CollectionExtract(..., 3) keeps only
# polygonal output so a stray point/line from simplification can't break the
# MultiPolygonField assignment.
_REBUILD_SQL = """
UPDATE barangays_barangaysusceptibility s
SET geom_simplified = sub.g
FROM (
    SELECT t.id,
        ST_Multi(ST_CollectionExtract(
            ST_SimplifyPreserveTopology(
                ST_SnapToGrid(ST_Union(ST_MakeValid(dp.geom)), %(snap)s),
                %(tol)s
            ), 3
        )) AS g
    FROM barangays_barangaysusceptibility t,
         LATERAL ST_Dump(t.geom) dp
    WHERE ST_Area(dp.geom::geography) >= %(min_area)s
    GROUP BY t.id
) sub
WHERE s.id = sub.id AND sub.g IS NOT NULL AND NOT ST_IsEmpty(sub.g);
"""


def rebuild_simplified_geometry() -> int:
    """Regenerate every zone's `geom_simplified` display geometry from its
    authoritative `geom`. Returns the number of rows updated. A row whose
    geometry is entirely sub-`MIN_PART_SQM` slivers is left as-is (its existing
    `geom_simplified` is kept, never nulled — the column is NOT NULL)."""
    with connection.cursor() as cursor:
        cursor.execute(
            _REBUILD_SQL,
            {"snap": SNAP_GRID_DEG, "tol": SIMPLIFY_TOLERANCE_DEG, "min_area": MIN_PART_SQM},
        )
        return cursor.rowcount
