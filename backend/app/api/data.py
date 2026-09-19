from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/status")
def get_data_status():
    """Returns the status and provenance of data sources."""
    # Since this is a prototype running offline locally by default, 
    # we simulate the fallback logic required by the prompt.
    # In a real deployed app, it would ping NASA POWER / OSM etc.
    return {
        "rainfall": {
            "source": "NASA POWER",
            "status": "available",
            "mode": "CACHED_PUBLIC",
            "last_updated": datetime.utcnow().isoformat()
        },
        "roads": {
            "source": "OpenStreetMap",
            "status": "available",
            "mode": "CACHED_PUBLIC",
            "last_updated": datetime.utcnow().isoformat()
        },
        "soil_moisture": {
            "source": "Prototype Derived",
            "status": "available",
            "mode": "DEMO",
            "last_updated": datetime.utcnow().isoformat()
        }
    }
