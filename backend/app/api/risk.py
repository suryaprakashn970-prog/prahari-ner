from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..database.database import get_db
from ..database import models
from ..ml import predictor

router = APIRouter()

class RiskPredictionRequest(BaseModel):
    rainfall_24h: float
    rainfall_72h: float
    soil_moisture: float
    slope: float
    elevation: float
    historical_landslide_count: int

@router.get("/zones")
def get_risk_zones(db: Session = Depends(get_db)):
    """Returns all monitored risk zones with their latest calculated risks."""
    zones = db.query(models.RiskZone).all()
    return zones

@router.post("/predict")
def predict_risk(request: RiskPredictionRequest, db: Session = Depends(get_db)):
    """Runs a manual risk prediction and returns the result."""
    features = request.dict()
    
    try:
        prediction = predictor.predict_risk(features)
        
        # If prediction triggers an alert logic, we could tie it to a zone, 
        # but for this standalone prediction, we just return it.
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
