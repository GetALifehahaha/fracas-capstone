"""Alert copy — kept in one place so wording stays consistent across channels.

The signature is admin-configurable via Organization settings; it defaults to the
org name so today's "— FRACAS" footer is unchanged until edited.
"""


def _footer() -> str:
    from monitoring.models import OrganizationSettings

    org = OrganizationSettings.cached()
    return org.alert_footer or f"— {org.org_name}"


def critical_message(barangay_name: str, score: float) -> tuple[str, str]:
    title = f"Critical flood risk: {barangay_name}"
    body = (
        f"Flood risk in {barangay_name} has reached CRITICAL "
        f"(score {score:.0f}/100). Prepare to evacuate and monitor local advisories. {_footer()}"
    )
    return title, body


def all_clear_message(barangay_name: str, level: str) -> tuple[str, str]:
    title = f"Flood risk eased: {barangay_name}"
    body = f"Flood risk in {barangay_name} has dropped to {level.upper()}. Stay alert. {_footer()}"
    return title, body
