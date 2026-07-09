"""Regenerate the hazard-zone display geometry (`geom_simplified`) from the
authoritative full-precision `geom`, shrinking the /api/hazard-zones/ payload
~4x (see `barangays.geometry`). Safe to re-run; does not touch `geom` or any
risk-engine input. Run after `load_flood_susceptibility` (which already calls
this) or on demand to re-tune the generalization.

    python manage.py rebuild_hazard_geometry
"""

from django.core.management.base import BaseCommand

from barangays.geometry import rebuild_simplified_geometry


class Command(BaseCommand):
    help = "Rebuild BarangaySusceptibility.geom_simplified from geom (map-display generalization)."

    def handle(self, *args, **options):
        updated = rebuild_simplified_geometry()
        self.stdout.write(
            self.style.SUCCESS(f"Rebuilt geom_simplified for {updated} zone(s).")
        )
