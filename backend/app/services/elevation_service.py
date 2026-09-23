import json
import urllib.request
import urllib.error

OPEN_METEO_ELEVATION_URL = "https://api.open-meteo.com/v1/elevation"

def get_elevation(latitude: float, longitude: float, timeout: int = 10) -> float:
    """
    Fetches real elevation in meters from Open-Meteo Elevation API for any geographic coordinate.
    Does not require an API key.
    """
    url = f"{OPEN_METEO_ELEVATION_URL}?latitude={latitude}&longitude={longitude}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "PRAHARI-NER/1.0 (Disaster-Risk-Management-System)"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.status == 200:
                payload = json.loads(response.read().decode("utf-8"))
                elevation_list = payload.get("elevation", [])
                if elevation_list and isinstance(elevation_list, list) and elevation_list[0] is not None:
                    return round(float(elevation_list[0]), 1)
    except Exception as e:
        print(f"[elevation_service] Warning: Failed to fetch elevation from Open-Meteo for ({latitude}, {longitude}): {e}")
    
    # Graceful fallback default if unreachable
    return 100.0
