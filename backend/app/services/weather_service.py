import json
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

# IST timezone (UTC+5:30) for Asia/Kolkata
IST_TIMEZONE = timezone(timedelta(hours=5, minutes=30))

def get_weather_data(latitude: float, longitude: float, timeout: int = 12) -> Dict[str, Any]:
    """
    Fetches real location-based environmental data from Open-Meteo API.
    Calculates:
      - rainfall_24h: sum of the latest 24 hourly rain values (mm)
      - rainfall_72h: sum of the latest 72 hourly rain values (mm)
      - soil_moisture: latest available soil moisture (0-1cm depth, m³/m³)
      - soil_moisture_percent: soil moisture expressed as 0-100%
      - elevation: elevation in meters returned by the forecast model
    Does NOT require an API key.
    """
    url = (
        f"{OPEN_METEO_FORECAST_URL}?"
        f"latitude={latitude}&longitude={longitude}&"
        f"hourly=rain,precipitation,soil_moisture_0_to_1cm&"
        f"timezone=Asia%2FKolkata&past_days=3"
    )
    
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "PRAHARI-NER/1.0 (Disaster-Risk-Management-System)"}
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.status == 200:
                payload = json.loads(response.read().decode("utf-8"))
                hourly = payload.get("hourly", {})
                times = hourly.get("time", [])
                rain = hourly.get("rain", [])
                precip = hourly.get("precipitation", [])
                soil_moisture_vals = hourly.get("soil_moisture_0_to_1cm", [])
                elevation = payload.get("elevation", 0.0)

                # Find the current hour index in Asia/Kolkata
                now_ist = datetime.now(IST_TIMEZONE)
                now_str = now_ist.strftime("%Y-%m-%dT%H:00")
                
                curr_idx = -1
                for i, t in enumerate(times):
                    if t <= now_str:
                        curr_idx = i
                    else:
                        break
                
                # If current time is past the array or before, use the latest available hour
                if curr_idx < 0:
                    curr_idx = len(times) - 1 if times else 0

                # Calculate 24h and 72h rainfall (sum of latest 24 and 72 hours up to curr_idx)
                start_24 = max(0, curr_idx - 23)
                start_72 = max(0, curr_idx - 71)

                slice_rain_24 = rain[start_24 : curr_idx + 1] if rain else []
                slice_rain_72 = rain[start_72 : curr_idx + 1] if rain else []
                slice_precip_24 = precip[start_24 : curr_idx + 1] if precip else []
                slice_precip_72 = precip[start_72 : curr_idx + 1] if precip else []

                rainfall_24h = round(sum(r for r in slice_rain_24 if r is not None), 2)
                rainfall_72h = round(sum(r for r in slice_rain_72 if r is not None), 2)
                precipitation_24h = round(sum(p for p in slice_precip_24 if p is not None), 2)
                precipitation_72h = round(sum(p for p in slice_precip_72 if p is not None), 2)

                # Get the latest valid soil moisture value
                latest_soil_moisture = 0.35
                valid_sm_candidates = [sm for sm in soil_moisture_vals[: curr_idx + 1] if sm is not None]
                if valid_sm_candidates:
                    latest_soil_moisture = round(float(valid_sm_candidates[-1]), 4)
                elif soil_moisture_vals:
                    fallback_sm = [sm for sm in soil_moisture_vals if sm is not None]
                    if fallback_sm:
                        latest_soil_moisture = round(float(fallback_sm[-1]), 4)

                soil_moisture_pct = round(latest_soil_moisture * 100.0, 1)

                return {
                    "rainfall_24h": rainfall_24h,
                    "rainfall_72h": rainfall_72h,
                    "precipitation_24h": precipitation_24h,
                    "precipitation_72h": precipitation_72h,
                    "soil_moisture": latest_soil_moisture,
                    "soil_moisture_percent": soil_moisture_pct,
                    "elevation": round(float(elevation), 1) if elevation is not None else 0.0,
                    "timezone": "Asia/Kolkata",
                    "timestamp": times[curr_idx] if times and curr_idx < len(times) else now_str,
                    "source": "Open-Meteo Forecast API",
                    "status": "success"
                }

    except Exception as e:
        print(f"[weather_service] Warning: Failed to fetch weather data from Open-Meteo for ({latitude}, {longitude}): {e}")

    # Fallback response in case of network issues
    return {
        "rainfall_24h": 0.0,
        "rainfall_72h": 0.0,
        "precipitation_24h": 0.0,
        "precipitation_72h": 0.0,
        "soil_moisture": 0.35,
        "soil_moisture_percent": 35.0,
        "elevation": 100.0,
        "timezone": "Asia/Kolkata",
        "timestamp": datetime.now(IST_TIMEZONE).isoformat(),
        "source": "Fallback Defaults",
        "status": "fallback"
    }
