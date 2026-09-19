from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RiskZone(Base):
    __tablename__ = "risk_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    state = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    current_risk_score = Column(Float, default=0.0)
    current_risk_level = Column(String, default="LOW")
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    rainfall_24h = Column(Float, default=0.0)
    rainfall_72h = Column(Float, default=0.0)
    soil_moisture = Column(Float, default=0.0)
    slope = Column(Float, default=0.0)
    elevation = Column(Float, default=0.0)
    historical_landslide_count = Column(Integer, default=0)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("risk_zones.id"))
    risk_level = Column(String)
    message = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    zone = relationship("RiskZone")

class FieldReport(Base):
    __tablename__ = "field_reports"
    id = Column(Integer, primary_key=True, index=True)
    # Human-readable location (NER states/districts)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    location = Column(String)                        # Village / road / landmark name
    # GPS coordinates — optional (set by browser geolocation, null if unavailable)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    report_type = Column(String)
    description = Column(Text)
    reporter_id = Column(String)                     # firebase uid or 'field_agent'
    status = Column(String, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Road(Base):
    __tablename__ = "roads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String, default="OPEN")
    latitude = Column(Float)
    longitude = Column(Float)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    method = Column(String)
    recipient = Column(String)
    message = Column(Text)
    status = Column(String, default="SENT")
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ResponsePriority(Base):
    __tablename__ = "response_priorities"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("risk_zones.id"))
    priority = Column(String)
    reason = Column(Text)
    recommended_action = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    zone = relationship("RiskZone")
