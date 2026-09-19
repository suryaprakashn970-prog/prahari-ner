from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..database import models

router = APIRouter()

@router.get("/priorities")
def get_response_priorities(db: Session = Depends(get_db)):
    """Returns response priorities calculated from risk and infrastructure."""
    
    zones = db.query(models.RiskZone).all()
    priorities = []
    
    for zone in zones:
        if zone.current_risk_score > 75:
            priorities.append({
                "zone_id": zone.id,
                "location": zone.name,
                "priority": "IMMEDIATE",
                "reason": f"High risk score ({zone.current_risk_score:.0f}). Potential population and infrastructure impact.",
                "recommended_action": "Field verification and immediate evacuation warning if verified."
            })
        elif zone.current_risk_score > 50:
            priorities.append({
                "zone_id": zone.id,
                "location": zone.name,
                "priority": "HIGH",
                "reason": f"Elevated risk score ({zone.current_risk_score:.0f}).",
                "recommended_action": "Monitor closely. Prepare field teams."
            })
            
    return priorities
