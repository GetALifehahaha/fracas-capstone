/** Baseline per-barangay risk scores, captured from the live dev backend
 * (GET /api/risk/snapshot/). `getRiskSnapshot` re-stamps `computed_at` to
 * 'now' on every call so the dashboard doesn't look frozen in the past. */
import type { RiskSnapshotEntry } from '@/features/gis/types'

const riskSnapshotBarangaysFixture: RiskSnapshotEntry[] = [
    {
        "id": 1,
        "name": "Arena Blanco",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 2,
        "name": "Ayala",
        "score": 52.07,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 3,
        "name": "Baliwasan",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 5,
        "name": "Boalan",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 6,
        "name": "Bolong",
        "score": 52.82,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 7,
        "name": "Buenavista",
        "score": 50.61,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 9,
        "name": "Busay (Sacol Island)",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 10,
        "name": "Cabaluay",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 15,
        "name": "Campo Islam",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 88,
        "name": "Tumaga",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 81,
        "name": "Tetuan",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 14,
        "name": "Calarian",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 18,
        "name": "Culianan",
        "score": 41.76,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 19,
        "name": "Curuan",
        "score": 51.63,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 20,
        "name": "Dita",
        "score": 52.26,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 24,
        "name": "Guisao",
        "score": 41.76,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 66,
        "name": "San Roque",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 17,
        "name": "Cawit",
        "score": 52.07,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 16,
        "name": "Canelar",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 23,
        "name": "Dulian (Upper Pasonanca)",
        "score": 43.61,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 72,
        "name": "Sibulao (Caruan)",
        "score": 51.08,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 73,
        "name": "Sinubung",
        "score": 52.78,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 25,
        "name": "Guiwan",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 26,
        "name": "La Paz",
        "score": 41.44,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 27,
        "name": "Labuan",
        "score": 52.78,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 28,
        "name": "Lamisahan",
        "score": 42.5,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 29,
        "name": "Landang Gua",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 30,
        "name": "Landang Laum",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 74,
        "name": "Sinunoc",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 34,
        "name": "Limaong",
        "score": 51.02,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 33,
        "name": "Latuan (Curuan)",
        "score": 52.26,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 35,
        "name": "Limpapa",
        "score": 52.78,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 65,
        "name": "San Jose Gusu",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 8,
        "name": "Bunguiao",
        "score": 42.82,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 38,
        "name": "Lumbangan",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 42,
        "name": "Mampang",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 40,
        "name": "Maasin",
        "score": 42.07,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 41,
        "name": "Malagutay",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 43,
        "name": "Manalipa",
        "score": 51.83,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 44,
        "name": "Mangusu",
        "score": 51.02,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 45,
        "name": "Manicahan",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 46,
        "name": "Mariki",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 47,
        "name": "Mercedes",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 48,
        "name": "Muti",
        "score": 50.61,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 11,
        "name": "Cabatangan",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 50,
        "name": "Pangapuyan",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 51,
        "name": "Panubigan",
        "score": 52.26,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 52,
        "name": "Pasilmanta (Sacol Island)",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 71,
        "name": "Santo Ni\u00f1o",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 36,
        "name": "Lubigan",
        "score": 52.26,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 54,
        "name": "Patalon",
        "score": 52.78,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 55,
        "name": "Barangay Zone I (Pob.)",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 56,
        "name": "Barangay Zone II (Pob.)",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 12,
        "name": "Cacao",
        "score": 41.8,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 58,
        "name": "Barangay Zone IV (Pob.)",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 59,
        "name": "Putik",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 61,
        "name": "Recodo",
        "score": 52.07,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 37,
        "name": "Lumayang",
        "score": 41.8,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 60,
        "name": "Quiniput",
        "score": 52.26,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 70,
        "name": "Santa Maria",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 64,
        "name": "San Jose Cawa-cawa",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 67,
        "name": "Sangali",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 68,
        "name": "Santa Barbara",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 69,
        "name": "Santa Catalina",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 57,
        "name": "Barangay Zone III (Pob.)",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 76,
        "name": "Taguiti",
        "score": 51.02,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 77,
        "name": "Talabaan",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 78,
        "name": "Talisayan",
        "score": 52.07,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 79,
        "name": "Talon-talon",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 80,
        "name": "Taluksangay",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 82,
        "name": "Tictapul",
        "score": 51.84,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 83,
        "name": "Tigbalabag",
        "score": 51.02,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 84,
        "name": "Tigtabon",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 86,
        "name": "Tugbungan",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 13,
        "name": "Calabasa",
        "score": 40.61,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 89,
        "name": "Tumalutab",
        "score": 50.9,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 90,
        "name": "Tumitus",
        "score": 51.84,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 96,
        "name": "Pasobolong",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 93,
        "name": "Camino Nuevo",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 92,
        "name": "Capisan",
        "score": 33.61,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 94,
        "name": "Licomo",
        "score": 50.93,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 97,
        "name": "Victoria",
        "score": 51.76,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 100,
        "name": "Unclaimed Area under Jurisdiction of Zamboanga City",
        "score": 42.11,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 99,
        "name": "Pasonanca Natural Park under Jurisdiction of Zamboanga City",
        "score": 41.19,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 4,
        "name": "Baluno",
        "score": 43.61,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 22,
        "name": "Dulian (Upper Bunguiao)",
        "score": 41.63,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 21,
        "name": "Divisoria",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 31,
        "name": "Lanzones",
        "score": 41.8,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 39,
        "name": "Lunzuran",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 87,
        "name": "Tulungatung",
        "score": 52.07,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 63,
        "name": "Salaan",
        "score": 41.8,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 75,
        "name": "Tagasilay",
        "score": 40.61,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 91,
        "name": "Vitali",
        "score": 51.02,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 95,
        "name": "Kasanyangan",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 98,
        "name": "Zambowood",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 101,
        "name": "Watershed Area under Jurisdiction of Zamboanga City",
        "score": 40.94,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 32,
        "name": "Lapakan",
        "score": 42.5,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 49,
        "name": "Pamucutan",
        "score": 42.07,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 53,
        "name": "Pasonanca",
        "score": 41.03,
        "category": "medium",
        "is_degraded": false
    },
    {
        "id": 62,
        "name": "Rio Hondo",
        "score": 51.03,
        "category": "high",
        "is_degraded": false
    },
    {
        "id": 85,
        "name": "Tolosa",
        "score": 42.5,
        "category": "medium",
        "is_degraded": false
    }
]

export default riskSnapshotBarangaysFixture
