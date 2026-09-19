from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from ..database.database import get_db
from ..database import models
from pydantic import BaseModel

router = APIRouter()

class FieldReportCreate(BaseModel):
    # Location fields — human-friendly, no raw lat/lng required
    state: str
    district: str
    location: str                        # Village / road name / landmark
    # GPS coordinates — optional, populated by browser geolocation
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # Report details
    report_type: str
    description: str
    reporter_id: str

class FieldReportUpdate(BaseModel):
    status: str

@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    """Returns all field reports ordered newest first."""
    return db.query(models.FieldReport).order_by(models.FieldReport.created_at.desc()).all()

@router.post("/")
def create_report(report: FieldReportCreate, db: Session = Depends(get_db)):
    """Creates a new field report. Coordinates are optional."""
    db_report = models.FieldReport(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.patch("/{report_id}")
def update_report(report_id: int, update: FieldReportUpdate, db: Session = Depends(get_db)):
    """Updates the status of a field report."""
    report = db.query(models.FieldReport).filter(models.FieldReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = update.status
    db.commit()
    db.refresh(report)
    return report
