import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ..database.database import get_db
from ..database import models
from ..ml import predictor

router = APIRouter()

# Reusable constant defining the 8 North Eastern Region (NER) states
NER_STATES = [
    "Arunachal Pradesh",
    "Assam",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Tripura",
    "Sikkim"
]

class RiskPredictionRequest(BaseModel):
    rainfall_24h: float
    rainfall_72h: float
    soil_moisture: float
    slope: float
    elevation: float
    historical_landslide_count: int

class WhatIfRequest(BaseModel):
    zone_id: int

def calculate_distance_km(lat1: Optional[float], lon1: Optional[float], lat2: Optional[float], lon2: Optional[float]) -> Optional[float]:
    """Calculates great-circle distance between two coordinates in kilometers."""
    if None in (lat1, lon1, lat2, lon2):
        return None
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

@router.get("/zones")
def get_risk_zones(db: Session = Depends(get_db)):
    """Returns all monitored risk zones strictly belonging to the 8 NER states."""
    zones = db.query(models.RiskZone).filter(models.RiskZone.state.in_(NER_STATES)).all()
    return zones

@router.post("/predict")
def predict_risk(request: RiskPredictionRequest, db: Session = Depends(get_db)):
    """Runs manual risk prediction using server-side XGBoost model."""
    features = request.dict()
    try:
        prediction = predictor.predict_risk(features)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/what-if")
def simulate_what_if(request: WhatIfRequest, db: Session = Depends(get_db)):
    """
    Simulated Impact Analysis endpoint.
    Evaluates simulated scenario impact at a selected risk zone based strictly on real available data.
    """
    zone = db.query(models.RiskZone).filter(models.RiskZone.id == request.zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail=f"Risk zone with ID {request.zone_id} not found.")

    # 1. Query verified roads
    all_roads = db.query(models.Road).all()
    matched_roads = []
    for r in all_roads:
        dist = calculate_distance_km(zone.latitude, zone.longitude, r.latitude, r.longitude)
        # Match if within 60km corridor or name explicitly mentions zone or state
        if (dist is not None and dist <= 60.0) or (zone.name.lower() in r.name.lower()) or (zone.state.lower() in r.name.lower()):
            matched_roads.append({
                "id": r.id,
                "name": r.name,
                "status": r.status,
                "distance_km": dist,
                "latitude": r.latitude,
                "longitude": r.longitude
            })

    if matched_roads:
        road_access = {
            "available": True,
            "roads": matched_roads,
            "message": None
        }
    else:
        road_access = {
            "available": False,
            "roads": [],
            "message": "Road data unavailable"
        }

    # 2. Settlements (strictly report unavailable if not in database, never invent data)
    settlements = {
        "available": False,
        "data": None,
        "message": "Settlement data unavailable"
    }

    # 3. Critical Infrastructure (strictly report unavailable if not in database, never invent data)
    critical_infrastructure = {
        "available": False,
        "data": None,
        "message": "Critical infrastructure data unavailable"
    }

    # 4. Emergency Access Simulation
    has_blocked_road = any(r["status"] in ["BLOCKED", "AT RISK"] for r in matched_roads)
    if road_access["available"] and has_blocked_road:
        emergency_access = {
            "available": True,
            "status": "Potentially Restricted",
            "description": "Emergency response may require an alternative route."
        }
    elif road_access["available"]:
        emergency_access = {
            "available": True,
            "status": "Potentially Delayed",
            "description": "Transit delays possible along connected primary roadway corridor."
        }
    else:
        emergency_access = {
            "available": True,
            "status": "Potentially Affected",
            "description": "Emergency response may require an alternative route."
        }

    # 5. Calculate Simulated Response Priority (Dynamic based on real inputs)
    base_score = float(zone.current_risk_score) if zone.current_risk_score is not None else 50.0
    road_adjustment = 0
    if road_access["available"]:
        if any(r["status"] == "BLOCKED" for r in matched_roads):
            road_adjustment = 15
        elif any(r["status"] == "AT RISK" for r in matched_roads):
            road_adjustment = 10

    simulated_priority_score = min(100.0, max(1.0, round(base_score + road_adjustment, 1)))

    if simulated_priority_score >= 75:
        simulated_priority_level = "CRITICAL"
    elif simulated_priority_score >= 50:
        simulated_priority_level = "HIGH"
    elif simulated_priority_score >= 25:
        simulated_priority_level = "MEDIUM"
    else:
        simulated_priority_level = "LOW"

    response_priority = {
        "score": simulated_priority_score,
        "level": simulated_priority_level,
        "base_risk_score": base_score,
        "road_adjustment": road_adjustment
    }

    # 6. Scenario Data Quality Classification
    if road_access["available"]:
        data_quality = {
            "level": "MEDIUM",
            "description": "Based on available risk-zone and road-network information."
        }
    else:
        data_quality = {
            "level": "LIMITED",
            "description": "Based on available risk-zone information; road and infrastructure records unavailable."
        }

    return {
        "zone": {
            "id": zone.id,
            "name": zone.name,
            "state": zone.state,
            "latitude": zone.latitude,
            "longitude": zone.longitude,
            "current_risk_score": zone.current_risk_score,
            "current_risk_level": zone.current_risk_level,
            "rainfall_24h": zone.rainfall_24h,
            "rainfall_72h": zone.rainfall_72h,
            "soil_moisture": zone.soil_moisture,
            "slope": zone.slope,
            "elevation": zone.elevation,
            "historical_landslide_count": zone.historical_landslide_count
        },
        "scenario": {
            "title": "SIMULATED IMPACT SCENARIO",
            "subtitle": "A landslide is simulated at the selected risk zone.",
            "disclaimer": "This is a scenario analysis based on available data."
        },
        "road_access": road_access,
        "road_impact": road_access,
        "settlements": settlements,
        "critical_infrastructure": critical_infrastructure,
        "emergency_access": emergency_access,
        "response_priority": response_priority,
        "data_quality": data_quality
    }