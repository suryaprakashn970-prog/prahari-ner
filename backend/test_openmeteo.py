import json
from app.api.environment import get_location_environment, NER_REFERENCE_POINTS
from app.database.database import SessionLocal

db = SessionLocal()
print("=" * 60)
print("TESTING 8 NER REFERENCE CITIES WITH REAL OPEN-METEO DATA:")
print("=" * 60)

for ref in NER_REFERENCE_POINTS:
    city = ref["city"]
    state = ref["state"]
    lat = ref["latitude"]
    lon = ref["longitude"]
    res = get_location_environment(lat, lon, name=city, db=db)
    elev = res["location"]["elevation"]
    rain24 = res["environmental_data"]["rainfall_24h"]
    rain72 = res["environmental_data"]["rainfall_72h"]
    sm = res["environmental_data"]["soil_moisture_percent"]
    risk_level = res["risk_assessment"]["risk_level"]
    risk_score = res["risk_assessment"]["risk_score"]
    print(f"[OK] {city:12} ({state:17}): Elev={elev:6.1f}m | Rain24h={rain24:4.1f}mm | Rain72h={rain72:4.1f}mm | SM={sm:4.1f}% | Risk={risk_level:8} ({risk_score}/100)")

print("\n" + "=" * 60)
print("TESTING ARBITRARY COORDINATES IN NER (26.85, 93.42):")
print("=" * 60)
arb = get_location_environment(26.85, 93.42, db=db)
print("Name:", arb["location"]["name"])
print("State:", arb["location"]["state"])
print("Nearest City:", arb["location"]["nearest_city"], f"({arb['location']['distance_to_nearest_city_km']} km)")
print("Elevation:", arb["location"]["elevation"], "m")
print("Rainfall 24h:", arb["environmental_data"]["rainfall_24h"], "mm")
print("Rainfall 72h:", arb["environmental_data"]["rainfall_72h"], "mm")
print("Soil Moisture:", arb["environmental_data"]["soil_moisture_percent"], "%")
print("Risk Level:", arb["risk_assessment"]["risk_level"], f"({arb['risk_assessment']['risk_score']}/100)")
print("Source:", arb["environmental_data"]["source"])
print("=" * 60)
