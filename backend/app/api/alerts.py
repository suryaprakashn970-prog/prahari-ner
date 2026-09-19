from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..database import models
from pydantic import BaseModel

router = APIRouter()

class AlertUpdate(BaseModel):
    is_active: bool

@router.get("/")
def get_alerts(db: Session = Depends(get_db)):
    """Returns active alerts."""
    return db.query(models.Alert).filter(models.Alert.is_active == True).all()

@router.patch("/{alert_id}")
def update_alert(alert_id: int, alert_update: AlertUpdate, db: Session = Depends(get_db)):
    """Update alert status (e.g., to acknowledge/dismiss)."""
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_active = alert_update.is_active
    db.commit()
    db.refresh(alert)
    return alert
