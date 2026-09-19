from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
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