from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from ..database.database import get_db
from ..database import models
from pydantic import BaseModel

router = APIRouter()

class AlertCreate(BaseModel):
    zone_id: Optional[int] = None
    risk_level: str
    message: str
    is_active: Optional[bool] = True
    status: Optional[str] = "ACTIVE"

class AlertUpdate(BaseModel):
    is_active: Optional[bool] = None
    status: Optional[str] = None

def serialize_alert(alert: models.Alert):
    zone_data = None
    if alert.zone:
        zone_data = {
            "id": alert.zone.id,
            "name": alert.zone.name,
            "state": alert.zone.state,
            "latitude": alert.zone.latitude,
            "longitude": alert.zone.longitude,
            "current_risk_score": alert.zone.current_risk_score,
            "current_risk_level": alert.zone.current_risk_level,
            "rainfall_24h": alert.zone.rainfall_24h,
            "rainfall_72h": alert.zone.rainfall_72h,
            "soil_moisture": alert.zone.soil_moisture,
            "slope": alert.zone.slope,
            "elevation": alert.zone.elevation,
        }
    
    # Derive canonical status string
    current_status = alert.status or ("ACTIVE" if alert.is_active else "ACKNOWLEDGED")

    return {
        "id": alert.id,
        "zone_id": alert.zone_id,
        "risk_level": alert.risk_level,
        "message": alert.message,
        "status": current_status,
        "is_active": alert.is_active if alert.is_active is not None else (current_status == "ACTIVE"),
        "created_at": alert.created_at.isoformat() if alert.created_at else None,
        "state": alert.zone.state if alert.zone else None,
        "location": alert.zone.name if alert.zone else None,
        "district": alert.zone.name if alert.zone else None,
        "latitude": alert.zone.latitude if alert.zone else None,
        "longitude": alert.zone.longitude if alert.zone else None,
        "risk_score": alert.zone.current_risk_score if alert.zone else None,
        "zone": zone_data,
    }

@router.get("/")
def get_alerts(active_only: Optional[bool] = False, db: Session = Depends(get_db)):
    """Returns alerts ordered newest first."""
    query = db.query(models.Alert).order_by(models.Alert.created_at.desc())
    if active_only:
        query = query.filter(models.Alert.is_active == True)
    alerts = query.all()
    return [serialize_alert(a) for a in alerts]

@router.post("/")
def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    """Creates a new alert."""
    status = alert_in.status or ("ACTIVE" if alert_in.is_active else "ACKNOWLEDGED")
    is_active = alert_in.is_active if alert_in.is_active is not None else (status == "ACTIVE")
    
    db_alert = models.Alert(
        zone_id=alert_in.zone_id,
        risk_level=alert_in.risk_level,
        message=alert_in.message,
        is_active=is_active,
        status=status
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return serialize_alert(db_alert)

@router.patch("/{alert_id}")
def update_alert(alert_id: int, alert_update: AlertUpdate, db: Session = Depends(get_db)):
    """Updates an alert status (e.g. acknowledge or dismiss)."""
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if alert_update.status is not None:
        normalized_status = alert_update.status.strip().upper()
        alert.status = normalized_status
        if normalized_status in ["ACKNOWLEDGED", "RESOLVED", "DISMISSED", "INACTIVE"]:
            alert.is_active = False
        elif normalized_status == "ACTIVE":
            alert.is_active = True

    if alert_update.is_active is not None:
        alert.is_active = alert_update.is_active
        if not alert_update.is_active and (alert.status is None or alert.status == "ACTIVE"):
            alert.status = "ACKNOWLEDGED"
        elif alert_update.is_active:
            alert.status = "ACTIVE"

    db.commit()
    db.refresh(alert)
    return serialize_alert(alert)