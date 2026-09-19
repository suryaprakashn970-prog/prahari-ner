import xgboost as xgb
import json
import os
import numpy as np
import pandas as pd
import shap

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "landslide_xgb_model.json")
metadata_path = os.path.join(current_dir, "model_metadata.json")

# Global state
_model = None
_metadata = None
_explainer = None

def load_model():
    global _model, _metadata, _explainer
    if _model is not None:
        return True
    
    if not os.path.exists(model_path) or not os.path.exists(metadata_path):
        return False
        
    try:
        # Load XGBoost model
        _model = xgb.XGBClassifier()
        _model.load_model(model_path)
        
        # Load metadata
        with open(metadata_path, "r") as f:
            _metadata = json.load(f)
            
        # Initialize SHAP explainer
        # TreeExplainer is fast for XGBoost
        _explainer = shap.TreeExplainer(_model)
            
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def get_model_status():
    if _model is None:
        loaded = load_model()
    else:
        loaded = True
        
    if not loaded:
        return {
            "model": "XGBoost",
            "loaded": False,
            "inference": "CPU",
            "offline_capable": True,
            "features": [
                "rainfall_24h",
                "rainfall_72h",
                "soil_moisture",
                "slope",
                "elevation",
                "historical_landslide_count"
            ],
            "model_file": model_path,
            "trained": False
        }
        
    return {
        "model": "XGBoost",
        "loaded": True,
        "inference": "CPU",
        "offline_capable": True,
        "features": _metadata["features"],
        "model_file": model_path,
        "trained": True,
        "accuracy": _metadata.get("accuracy")
    }

def predict_risk(features: dict):
    if _model is None:
        if not load_model():
            raise RuntimeError("Model is not loaded.")
            
    feature_names = _metadata["features"]
    
    # Ensure features are in the correct order
    feature_values = []
    for f in feature_names:
        if f not in features:
            raise ValueError(f"Missing required feature: {f}")
        feature_values.append(features[f])
        
    # Convert to DataFrame to keep feature names for SHAP
    X = pd.DataFrame([feature_values], columns=feature_names)
    
    # Predict
    probability = float(_model.predict_proba(X)[0, 1])
    
    # Calculate score (0-100)
    score = int(probability * 100)
    
    # Determine level
    if score <= 25:
        level = "LOW"
    elif score <= 50:
        level = "MODERATE"
    elif score <= 75:
        level = "HIGH"
    else:
        level = "CRITICAL"
        
    # Model Explanation using SHAP
    factors = []
    try:
        shap_values = _explainer.shap_values(X)
        if isinstance(shap_values, list):
            sv = shap_values[1][0]
        else:
            sv = shap_values[0]
            
        for i, fname in enumerate(feature_names):
            importance_val = float(sv[i])
            val = float(feature_values[i])
            
            if importance_val > 0.5:
                interp = "HIGH CONTRIBUTION"
            elif importance_val > 0.1:
                interp = "MODERATE CONTRIBUTION"
            elif importance_val < -0.1:
                interp = "REDUCES RISK"
            else:
                interp = "LOW CONTRIBUTION"
                
            factors.append({
                "feature": fname,
                "value": val,
                "importance": importance_val,
                "interpretation": interp
            })
            
        factors.sort(key=lambda x: abs(x["importance"]), reverse=True)
            
    except Exception as e:
        print(f"SHAP error: {e}")
        fi = _model.feature_importances_
        for i, fname in enumerate(feature_names):
            factors.append({
                "feature": fname,
                "value": float(feature_values[i]),
                "importance": float(fi[i]),
                "interpretation": "GLOBAL FEATURE IMPORTANCE"
            })
    
    return {
        "risk_probability": probability,
        "risk_score": score,
        "risk_level": level,
        "model": "XGBoost",
        "model_status": "loaded",
        "inference": "CPU",
        "offline_capable": True,
        "features": features,
        "explanation": factors
    }
