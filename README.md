# PRAHARI-NER

AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region of India (SIH 2026 Prototype).

## Features
- **XGBoost Risk Prediction:** Evaluates landslide risk probability based on 6 core environmental factors.
- **GIS Dashboard:** Visualizes risk zones with Leaflet maps.
- **Explainable AI:** Uses SHAP/Feature Importance to explain *why* a risk is critical.
- **Responsive Design:** Mobile-first user interface tailored for all screen sizes.

## Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, React-Leaflet
- **Backend:** FastAPI, SQLite, SQLAlchemy
- **Machine Learning:** XGBoost, Scikit-Learn, SHAP
- **Authentication:** Firebase (Google/Phone/Demo Mode)

## Local Setup

### Backend
1. Open PowerShell and navigate to `backend/`.
2. Create virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Train XGBoost Model and Generate Database Seed:
   ```powershell
   python -m app.ml.train
   python -m app.database.seed
   ```
5. Run server:
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend
1. Open a new PowerShell terminal and navigate to `frontend/`.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Run development server:
   ```powershell
   npm run dev
   ```

## Limitations & Prototype Constraints
- **Database:** Uses SQLite for local prototyping. It is ephemeral on some free hosting platforms like Render. It is structured to easily migrate to PostgreSQL/PostGIS.
- **ML Data:** The prototype XGBoost model is trained on synthetic data replicating NER weather conditions. A full 6-feature public historical dataset was unavailable, so a mathematically sound fallback was implemented for demonstration purposes.

## Demo Mode
If you haven't configured Firebase credentials, use the "Continue in Demo Mode" button on the Login page to access the full application layout and GIS maps locally.
