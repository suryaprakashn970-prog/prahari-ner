import math
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional, List
from datetime import datetime

from ..database.database import get_db
from ..database import models
from ..services import weather_service, elevation_service
from ..ml import predictor

router = APIRouter()

# 8 Reference NER test/reference locations
NER_REFERENCE_POINTS = [
    {"state": "Assam", "city": "Guwahati", "latitude": 26.1445, "longitude": 91.7362},
    {"state": "Arunachal Pradesh", "city": "Itanagar", "latitude": 27.0844, "longitude": 93.6053},
    {"state": "Meghalaya", "city": "Shillong", "latitude": 25.5788, "longitude": 91.8933},
    {"state": "Manipur", "city": "Imphal", "latitude": 24.8170, "longitude": 93.9368},
    {"state": "Mizoram", "city": "Aizawl", "latitude": 23.7271, "longitude": 92.7176},
    {"state": "Nagaland", "city": "Kohima", "latitude": 25.6751, "longitude": 94.1086},
    {"state": "Tripura", "city": "Agartala", "latitude": 23.8315, "longitude": 91.2868},
    {"state": "Sikkim", "city": "Gangtok", "latitude": 27.3389, "longitude": 88.6065},
]

# Regional bounding box for North Eastern Region (NER)
NER_LAT_MIN, NER_LAT_MAX = 20.5, 30.5
NER_LON_MIN, NER_LON_MAX = 87.0, 98.5

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in kilometers using the Haversine formula."""
    r = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 1)

def find_nearest_ner_reference(lat: float, lon: float) -> Dict[str, Any]:
    """Finds the closest reference city and state among the 8 NER points."""
    nearest = NER_REFERENCE_POINTS[0]
    min_dist = calculate_distance_km(lat, lon, nearest["latitude"], nearest["longitude"])
    
    for ref in NER_REFERENCE_POINTS[1:]:
        dist = calculate_distance_km(lat, lon, ref["latitude"], ref["longitude"])
        if dist < min_dist:
            min_dist = dist
            nearest = ref
            
    return {
        "state": nearest["state"],
        "nearest_city": nearest["city"],
        "distance_km": min_dist
    }

@router.get("/reference-points")
def get_reference_points():
    """Returns the 8 initial NER reference city test points."""
    return NER_REFERENCE_POINTS

@router.get("/location")
def get_location_environment(
    latitude: float,
    longitude: float,
    name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Receives arbitrary coordinates (within NER or global with validation).
    Calls Open-Meteo Weather and Elevation APIs.
    Calculates 24h & 72h rainfall, soil moisture, and elevation.
    Evaluates XGBoost landslide risk using the real environmental inputs.
    """
    # 1. Validate coordinates
    if not (-90.0 <= latitude <= 90.0 and -180.0 <= longitude <= 180.0):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid geographic coordinates ({latitude}, {longitude}). Latitude must be between -90 and 90, Longitude between -180 and 180."
        )

    is_in_ner = (NER_LAT_MIN <= latitude <= NER_LAT_MAX) and (NER_LON_MIN <= longitude <= NER_LON_MAX)
    ref_info = find_nearest_ner_reference(latitude, longitude)

    # 2. Fetch real elevation from Open-Meteo Elevation API
    elevation_val = elevation_service.get_elevation(latitude, longitude)

    # 3. Fetch real environmental/weather data from Open-Meteo Forecast API
    weather_data = weather_service.get_weather_data(latitude, longitude)
    
    # Reconcile elevation if elevation API succeeded
    if elevation_val > 0.0:
        weather_data["elevation"] = elevation_val

    # 4. Determine nearest risk zone in DB for terrain baselines (slope & landslide history)
    db_zones = db.query(models.RiskZone).all()
    nearest_zone = None
    min_zone_dist = float("inf")
    for z in db_zones:
        if z.latitude is not None and z.longitude is not None:
            dist = calculate_distance_km(latitude, longitude, z.latitude, z.longitude)
            if dist < min_zone_dist:
                min_zone_dist = dist
                nearest_zone = z

    slope_val = float(nearest_zone.slope) if nearest_zone and nearest_zone.slope else 22.0
    hist_count = int(nearest_zone.historical_landslide_count) if nearest_zone and nearest_zone.historical_landslide_count else 2

    # 5. Evaluate Landslide Risk using existing server-side XGBoost Model
    risk_features = {
        "rainfall_24h": float(weather_data["rainfall_24h"]),
        "rainfall_72h": float(weather_data["rainfall_72h"]),
        "soil_moisture": float(weather_data["soil_moisture_percent"]),
        "slope": float(slope_val),
        "elevation": float(weather_data["elevation"]),
        "historical_landslide_count": int(hist_count)
    }

    try:
        prediction = predictor.predict_risk(risk_features)
    except Exception as e:
        print(f"[environment] Prediction error: {e}")
        prediction = {
            "risk_score": 0,
            "risk_level": "LOW",
            "risk_probability": 0.0,
            "model": "XGBoost",
            "model_status": "error",
            "inference": "CPU",
            "offline_capable": True,
            "features": risk_features,
            "explanation": []
        }

    # Location naming
    resolved_name = name or (
        f"{ref_info['nearest_city']} Area" if ref_info["distance_km"] < 25.0 
        else f"NER Location ({latitude:.4f}, {longitude:.4f})"
    )

    return {
        "location": {
            "latitude": round(latitude, 4),
            "longitude": round(longitude, 4),
            "name": resolved_name,
            "state": ref_info["state"],
            "nearest_city": ref_info["nearest_city"],
            "distance_to_nearest_city_km": ref_info["distance_km"],
            "elevation": weather_data["elevation"],
            "is_ner_region": is_in_ner
        },
        "environmental_data": {
            "rainfall_24h": weather_data["rainfall_24h"],
            "rainfall_72h": weather_data["rainfall_72h"],
            "precipitation_24h": weather_data["precipitation_24h"],
            "precipitation_72h": weather_data["precipitation_72h"],
            "soil_moisture": weather_data["soil_moisture"],
            "soil_moisture_percent": weather_data["soil_moisture_percent"],
            "elevation": weather_data["elevation"],
            "timezone": weather_data["timezone"],
            "last_updated": weather_data["timestamp"],
            "source": weather_data["source"],
            "status": weather_data["status"]
        },
        "risk_assessment": {
            "risk_score": prediction.get("risk_score", 0),
            "risk_level": prediction.get("risk_level", "LOW"),
            "risk_probability": prediction.get("risk_probability", 0.0),
            "model": "XGBoost",
            "inference": "CPU",
            "features_used": risk_features,
            "explanation": prediction.get("explanation", [])
        }
    }
