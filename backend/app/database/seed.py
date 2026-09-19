from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
from ..ml import predictor

# Initialize tables
models.Base.metadata.create_all(bind=engine)

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

def seed_data():
    db = SessionLocal()

    # 1. Seed / Synchronize Risk Zones across the 8 NER states
    zones_data = [
        {"name": "Tawang", "state": "Arunachal Pradesh", "latitude": 27.58, "longitude": 91.86, "rainfall_24h": 182, "rainfall_72h": 320, "soil_moisture": 78, "slope": 36, "elevation": 650, "historical_landslide_count": 7},
        {"name": "Haflong", "state": "Assam", "latitude": 25.17, "longitude": 93.02, "rainfall_24h": 140, "rainfall_72h": 260, "soil_moisture": 82, "slope": 28, "elevation": 680, "historical_landslide_count": 4},
        {"name": "Imphal", "state": "Manipur", "latitude": 24.81, "longitude": 93.93, "rainfall_24h": 20, "rainfall_72h": 40, "soil_moisture": 30, "slope": 5, "elevation": 786, "historical_landslide_count": 0},
        {"name": "Shillong", "state": "Meghalaya", "latitude": 25.57, "longitude": 91.89, "rainfall_24h": 120, "rainfall_72h": 200, "soil_moisture": 85, "slope": 15, "elevation": 1525, "historical_landslide_count": 5},
        {"name": "Aizawl", "state": "Mizoram", "latitude": 23.73, "longitude": 92.71, "rainfall_24h": 90, "rainfall_72h": 150, "soil_moisture": 60, "slope": 40, "elevation": 1132, "historical_landslide_count": 8},
        {"name": "Kohima", "state": "Nagaland", "latitude": 25.67, "longitude": 94.10, "rainfall_24h": 45, "rainfall_72h": 90, "soil_moisture": 45, "slope": 22, "elevation": 1444, "historical_landslide_count": 2},
        {"name": "Gangtok", "state": "Sikkim", "latitude": 27.33, "longitude": 88.61, "rainfall_24h": 110, "rainfall_72h": 210, "soil_moisture": 74, "slope": 32, "elevation": 1650, "historical_landslide_count": 6},
        {"name": "Ambassa", "state": "Tripura", "latitude": 23.92, "longitude": 91.84, "rainfall_24h": 35, "rainfall_72h": 70, "soil_moisture": 40, "slope": 12, "elevation": 180, "historical_landslide_count": 1},
    ]

    for z in zones_data:
        # Calculate real risk level and score using server-side XGBoost model
        try:
            pred = predictor.predict_risk({
                "rainfall_24h": z["rainfall_24h"],
                "rainfall_72h": z["rainfall_72h"],
                "soil_moisture": z["soil_moisture"],
                "slope": z["slope"],
                "elevation": z["elevation"],
                "historical_landslide_count": z["historical_landslide_count"]
            })
            risk_score = float(pred.get("risk_score", 0))
            risk_level = str(pred.get("risk_level", "LOW"))
        except Exception:
            risk_score = 0.0
            risk_level = "LOW"

        existing = db.query(models.RiskZone).filter(models.RiskZone.name == z["name"]).first()
        if existing:
            existing.current_risk_score = risk_score
            existing.current_risk_level = risk_level
            existing.rainfall_24h = z["rainfall_24h"]
            existing.rainfall_72h = z["rainfall_72h"]
            existing.soil_moisture = z["soil_moisture"]
            existing.slope = z["slope"]
            existing.elevation = z["elevation"]
            existing.historical_landslide_count = z["historical_landslide_count"]
        else:
            new_zone = models.RiskZone(
                name=z["name"],
                state=z["state"],
                latitude=z["latitude"],
                longitude=z["longitude"],
                rainfall_24h=z["rainfall_24h"],
                rainfall_72h=z["rainfall_72h"],
                soil_moisture=z["soil_moisture"],
                slope=z["slope"],
                elevation=z["elevation"],
                historical_landslide_count=z["historical_landslide_count"],
                current_risk_score=risk_score,
                current_risk_level=risk_level
            )
            db.add(new_zone)
    db.commit()

    # 2. Seed Roads if empty
    if not db.query(models.Road).first():
        roads = [
            {"name": "NH-13 (Tawang, Arunachal)", "status": "AT RISK", "latitude": 27.58, "longitude": 91.86},
            {"name": "NH-2 (Kohima, Nagaland)", "status": "OPEN", "latitude": 25.67, "longitude": 94.10},
            {"name": "NH-6 (Shillong, Meghalaya)", "status": "BLOCKED", "latitude": 25.57, "longitude": 91.89},
            {"name": "NH-54 (Aizawl, Mizoram)", "status": "AT RISK", "latitude": 23.73, "longitude": 92.71},
        ]
        for r in roads:
            db.add(models.Road(**r))
        db.commit()

    # 3. Seed Alerts if empty
    if not db.query(models.Alert).first():
        tawang_zone = db.query(models.RiskZone).filter(models.RiskZone.name == "Tawang").first()
        shillong_zone = db.query(models.RiskZone).filter(models.RiskZone.name == "Shillong").first()
        if tawang_zone:
            db.add(models.Alert(zone_id=tawang_zone.id, risk_level="CRITICAL", message="High rainfall in Tawang sector. Unstable slope warning.", is_active=True))
        if shillong_zone:
            db.add(models.Alert(zone_id=shillong_zone.id, risk_level="HIGH", message="Slope saturation high on Shillong bypass.", is_active=True))
        db.commit()

    # 4. Seed Field Reports if empty
    if not db.query(models.FieldReport).first():
        reports = [
            {"state": "Arunachal Pradesh", "district": "Tawang", "location": "Tawang Checkpost", "latitude": 27.59, "longitude": 91.87, "report_type": "Crack", "description": "Minor tension cracks observed on hillside.", "reporter_id": "field_agent_01", "status": "Verified"},
            {"state": "Meghalaya", "district": "East Khasi Hills", "location": "Shillong Bypass", "latitude": 25.58, "longitude": 91.90, "report_type": "Road Blockage", "description": "Debris on road, single lane open.", "reporter_id": "field_agent_02", "status": "Pending"},
        ]
        for r in reports:
            db.add(models.FieldReport(**r))
        db.commit()

    print("NER Risk Zones database synchronization completed successfully.")
    db.close()

if __name__ == "__main__":
    seed_data()