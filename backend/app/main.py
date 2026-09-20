import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import model, data, risk, alerts, reports, notifications, weather, roads, response
from .database.database import engine
from .database import models

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PRAHARI-NER API")

# Allowed CORS origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://prahari-frontend-6wa3.onrender.com",
    "https://prahari-frontend.onrender.com",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    cleaned_url = frontend_url.strip().rstrip("/")
    if cleaned_url and cleaned_url not in origins:
        origins.append(cleaned_url)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "message": "Prahari-AI Sentinel Backend Online"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Prahari-AI Sentinel Backend Online"
    }

@app.get("/api/health")
def api_health_check():
    return {
        "status": "ok",
        "message": "Prahari-AI Sentinel Backend Online"
    }

# Include routers
app.include_router(model.router, prefix="/api/model", tags=["model"])
app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(risk.router, prefix="/api/risk", tags=["risk"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])
app.include_router(roads.router, prefix="/api/roads", tags=["roads"])
app.include_router(response.router, prefix="/api/response", tags=["response"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
