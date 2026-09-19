from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/")
def get_weather():
    """Returns weather information for the current risk zones."""
    return {
        "source": "CACHED_PUBLIC",
        "last_updated": datetime.utcnow().isoformat(),
        "data": [
            {
                "location": "Tawang",
                "rainfall_24h": 182,
                "rainfall_72h": 320,
                "temperature": 12,
                "forecast": "Heavy Rain"
            },
            {
                "location": "Shillong",
                "rainfall_24h": 120,
                "rainfall_72h": 200,
                "temperature": 18,
                "forecast": "Showers"
            },
            {
                "location": "Kohima",
                "rainfall_24h": 45,
                "rainfall_72h": 90,
                "temperature": 16,
                "forecast": "Cloudy"
            }
        ]
    }
