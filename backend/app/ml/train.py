import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import json
import os
from datetime import datetime

# Define features
FEATURES = [
    "rainfall_24h",
    "rainfall_72h",
    "soil_moisture",
    "slope",
    "elevation",
    "historical_landslide_count"
]

def generate_prototype_dataset(n_samples=5000):
    """
    Generates a prototype dataset. 
    In a real-world scenario, this would be replaced with actual historical data 
    from geological surveys and meteorological departments.
    """
    np.random.seed(42)
    
    # Feature distributions based on realistic ranges
    rainfall_24h = np.random.exponential(scale=50, size=n_samples) # 0-400mm
    rainfall_72h = rainfall_24h + np.random.exponential(scale=100, size=n_samples) 
    soil_moisture = np.random.normal(loc=50, scale=20, size=n_samples).clip(0, 100) # 0-100%
    slope = np.random.normal(loc=30, scale=15, size=n_samples).clip(0, 90) # 0-90 degrees
    elevation = np.random.normal(loc=1500, scale=1000, size=n_samples).clip(0, 8000) # 0-8000 meters
    historical = np.random.poisson(lam=1, size=n_samples) # 0-10 events
    
    df = pd.DataFrame({
        "rainfall_24h": rainfall_24h,
        "rainfall_72h": rainfall_72h,
        "soil_moisture": soil_moisture,
        "slope": slope,
        "elevation": elevation,
        "historical_landslide_count": historical
    })
    
    # Calculate a synthetic risk probability using logistic function
    # Higher rain, moisture, slope and history increase risk.
    # Elevation has a complex non-linear relationship, we'll simplify here.
    z = (
        (df["rainfall_24h"] * 0.02) + 
        (df["rainfall_72h"] * 0.01) + 
        (df["soil_moisture"] * 0.05) + 
        (df["slope"] * 0.1) + 
        (df["historical_landslide_count"] * 0.8) - 
        10 # Bias term
    )
    
    prob = 1 / (1 + np.exp(-z))
    
    # Add some noise
    prob = prob + np.random.normal(0, 0.1, size=n_samples)
    prob = prob.clip(0, 1)
    
    # Target variable (1 for landslide, 0 for no landslide)
    df["target"] = (prob > 0.5).astype(int)
    
    return df

def train_model():
    print("Generating prototype dataset...")
    df = generate_prototype_dataset()
    
    # Save dataset for reference
    current_dir = os.path.dirname(os.path.abspath(__file__))
    df.to_csv(os.path.join(current_dir, "training_data.csv"), index=False)
    
    X = df[FEATURES]
    y = df["target"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training XGBoost model on {len(X_train)} samples...")
    # Initialize XGBoost Classifier
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        objective="binary:logistic",
        random_state=42,
        use_label_encoder=False,
        eval_metric="logloss"
    )
    
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "roc_auc": float(roc_auc_score(y_test, y_prob))
    }
    
    print(f"Metrics: {metrics}")
    
    # Save model
    model_path = os.path.join(current_dir, "landslide_xgb_model.json")
    model.save_model(model_path)
    
    # Save metadata
    metadata = {
        "model": "XGBoost",
        "version": "1.0",
        "loaded": True,
        "features": FEATURES,
        "inference": "CPU",
        "training_available": True,
        "trained_at": datetime.utcnow().isoformat(),
        "training_samples": len(X_train),
        "validation_samples": len(X_test),
        "metrics": metrics,
        "data_source": "Prototype Derived (Synthetic) - No complete public dataset available for all 6 features."
    }
    
    metadata_path = os.path.join(current_dir, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Model saved to {model_path}")
    print(f"Metadata saved to {metadata_path}")

if __name__ == "__main__":
    train_model()
