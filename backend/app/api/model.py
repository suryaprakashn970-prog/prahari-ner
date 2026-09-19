from fastapi import APIRouter, HTTPException
from ..ml import predictor

router = APIRouter()

@router.get("/status")
def get_model_status():
    """Returns the status of the XGBoost model."""
    status = predictor.get_model_status()
    # Add OFFLINE-CAPABLE explicitly for UI
    status["offline_capable"] = True
    return status
