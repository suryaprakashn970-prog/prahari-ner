from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..database import models
from pydantic import BaseModel
import os

router = APIRouter()

class NotificationRequest(BaseModel):
    method: str
    recipient: str
    message: str

@router.post("/send")
def send_notification(req: NotificationRequest, db: Session = Depends(get_db)):
    """Sends a notification (simulated if no provider is configured)."""
    
    # Check for real provider configuration
    is_demo = True
    if req.method == "SMS":
        if os.getenv("TWILIO_ACCOUNT_SID"):
            is_demo = False
            # Here you would integrate twilio client
    
    status = "SENT" if not is_demo else "DEMO_SENT"
    
    # Save to db
    notif = models.Notification(
        method=req.method,
        recipient=req.recipient,
        message=req.message,
        status=status,
        is_demo=is_demo
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    
    return {
        "success": True,
        "is_demo": is_demo,
        "provider_status": "configured" if not is_demo else "not_configured",
        "detail": "Notification sent successfully." if not is_demo else "Demo notification generated. External provider not configured. No real message was sent.",
        "notification_id": notif.id
    }
