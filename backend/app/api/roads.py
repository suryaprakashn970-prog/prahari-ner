from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..database import models

router = APIRouter()

@router.get("/")
def get_roads(db: Session = Depends(get_db)):
    """Returns road status information."""
    roads = db.query(models.Road).all()
    return roads
