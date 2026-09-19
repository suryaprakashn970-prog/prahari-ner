from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
import json
import os

# Initialize tables
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if we already seeded
    if db.query(models.RiskZone).first():
        print("Database already seeded.")
        db.close()
        return

    # 1. Seed Risk Zones (Locations in NER)
    zones = [
        {"name": "Tawang", "state": "Arunachal Pradesh", "latitude": 27.58, "longitude": 91.86, "rainfall_24h": 182, "rainfall_72h": 320, "soil_moisture": 78, "slope": 36, "elevation": 650, "historical_landslide_count": 7},
        {"name": "Kohima", "state": "Nagaland", "latitude": 25.67, "longitude": 94.10, "rainfall_24h": 45, "rainfall_72h": 90, "soil_moisture": 45, "slope": 22, "elevation": 1444, "historical_landslide_count": 2},
        {"name": "Shillong", "state": "Meghalaya", "latitude": 25.57, "longitude": 91.89, "rainfall_24h": 120, "rainfall_72h": 200, "soil_moisture": 85, "slope": 15, "elevation": 1525, "historical_landslide_count": 5},
        {"name": "Aizawl", "state": "Mizoram", "latitude": 23.73, "longitude": 92.71, "rainfall_24h": 90, "rainfall_72h": 150, "soil_moisture": 60, "slope": 40, "elevation": 1132, "historical_landslide_count": 8},
        {"name": "Imphal", "state": "Manipur", "latitude": 24.81, "longitude": 93.93, "rainfall_24h": 20, "rainfall_72h": 40, "soil_moisture": 30, "slope": 5, "elevation": 786, "historical_landslide_count": 0},
    ]

    db_zones = []
    for z in zones:
        zone = models.RiskZone(**z)
        db.add(zone)
        db_zones.append(zone)
    db.commit()

    # 2. Seed Roads
    roads = [
        {"name": "NH-13 (Tawang)", "status": "AT RISK", "latitude": 27.58, "longitude": 91.86},
        {"name": "NH-2 (Kohima)", "status": "OPEN", "latitude": 25.67, "longitude": 94.10},
        {"name": "NH-6 (Shillong)", "status": "BLOCKED", "latitude": 25.57, "longitude": 91.89},
        {"name": "NH-54 (Aizawl)", "status": "AT RISK", "latitude": 23.73, "longitude": 92.71},
    ]
    for r in roads:
        db.add(models.Road(**r))
    
    # 3. Seed Alerts
    alerts = [
        {"zone_id": 1, "risk_level": "CRITICAL", "message": "High rainfall expected. Avoid unstable slopes. Field verification required.", "is_active": True},
        {"zone_id": 3, "risk_level": "HIGH", "message": "Road blockages reported on NH-6 due to recent slides.", "is_active": True},
    ]
    for a in alerts:
        db.add(models.Alert(**a))

    # 4. Seed Field Reports
    reports = [
        {"location": "Tawang Checkpost", "latitude": 27.59, "longitude": 91.87, "report_type": "Crack", "description": "Minor tension cracks observed on hillside.", "reporter_id": "demo", "status": "Verified"},
        {"location": "Shillong Bypass", "latitude": 25.58, "longitude": 91.90, "report_type": "Road Blockage", "description": "Debris on road, single lane open.", "reporter_id": "demo", "status": "Pending"},
    ]
    for r in reports:
        db.add(models.FieldReport(**r))

    db.commit()
    print("Database seeded successfully.")
    db.close()

if __name__ == "__main__":
    seed_data()
