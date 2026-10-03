#!/usr/bin/env python3
"""
ROADGUARD AI - FastAPI Microservice Prototype
=============================================
REST API providing real-time highway risk prediction, DBSCAN blackspot
clustering, and counterfactual intervention recommendations.

Run with:
    uvicorn prototype.api_service:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import numpy as np
import pandas as pd

from prototype.prototype_ml_model import (
    RoadGuardModel,
    generate_training_data,
    cluster_accident_blackspots,
    simulate_counterfactual_intervention,
    SAMPLE_INDIAN_HIGHWAYS
)

app = FastAPI(
    title="ROADGUARD AI — Highway Risk Intelligence API",
    description="MoRTH-calibrated Machine Learning API for Indian road safety prediction and prevention.",
    version="1.0.0"
)

# Initialize and train prototype model in memory
print("[INIT] Training RoadGuard AI ML Pipeline...")
df_train = generate_training_data(n_samples=500, seed=42)
global_model = RoadGuardModel()
global_model.train(df_train)
print("[READY] RoadGuard AI API initialized.")


class RoadSegmentFeatures(BaseModel):
    traffic_density_pcuh: float = Field(..., example=4200.0, description="Traffic volume (PCU/hour)")
    curvature_index: float = Field(..., ge=0.0, le=1.0, example=0.75, description="Geometric curvature severity")
    surface_friction_coef: float = Field(..., ge=0.1, le=1.0, example=0.45, description="Asphalt friction coefficient")
    rain_intensity_mmh: float = Field(..., ge=0.0, example=24.0, description="Rainfall intensity in mm/hour")
    night_traffic_ratio: float = Field(..., ge=0.0, le=1.0, example=0.48, description="Proportion of nocturnal transit")
    historical_accidents_yr: float = Field(..., ge=0.0, example=150.0, description="MoRTH annual historical accident count")
    speed_variance_kmh: float = Field(..., ge=0.0, example=21.5, description="Speed variance between fast & slow vehicles")
    lighting_coverage_pct: float = Field(..., ge=0.0, le=100.0, example=35.0, description="Highway luminaire coverage %")
    median_barrier: int = Field(..., ge=0, le=1, example=1, description="1 if physical concrete barrier exists, 0 otherwise")


class PredictionResponse(BaseModel):
    risk_score: float
    risk_tier: str
    attributions: Dict[str, float]
    status: str


class CounterfactualRequest(BaseModel):
    features: RoadSegmentFeatures
    target_risk_score: Optional[float] = 45.0
    speed_reduction_kmh: Optional[float] = 12.0
    install_high_friction_asphalt: Optional[bool] = True
    improve_lighting_pct: Optional[float] = 40.0


@app.get("/")
def root():
    return {
        "service": "ROADGUARD AI Prototype API",
        "tagline": "Predict Risk. Understand It. Simulate It. Prevent It.",
        "status": "ONLINE",
        "model_architecture": "RandomForestRegressor + DBSCAN",
        "endpoints": [
            "/predict-risk",
            "/corridors",
            "/cluster-blackspots",
            "/counterfactual"
        ]
    }


@app.post("/predict-risk", response_model=PredictionResponse)
def predict_risk(features: RoadSegmentFeatures):
    try:
        attrs = features.model_dump()
        score, tier, attributions = global_model.predict(attrs)
        return PredictionResponse(
            risk_score=score,
            risk_tier=tier,
            attributions=attributions,
            status="SUCCESS"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/corridors")
def get_sample_corridors():
    """Retrieve pre-configured Indian highway corridors with verified MoRTH baselines."""
    return {"corridors": SAMPLE_INDIAN_HIGHWAYS}


@app.get("/cluster-blackspots")
def get_blackspots(eps_km: float = 4.0, min_samples: int = 5):
    """Run Haversine DBSCAN to identify high-severity spatial collision hotspots."""
    blackspots = cluster_accident_blackspots(df_train, eps_km=eps_km, min_samples=min_samples)
    return {
        "total_clusters": len(blackspots),
        "eps_km": eps_km,
        "clusters": blackspots
    }


@app.post("/counterfactual")
def get_counterfactual(req: CounterfactualRequest):
    """Compute targeted civil interventions to reduce corridor risk score."""
    attrs = req.features.model_dump()
    result = simulate_counterfactual_intervention(
        model=global_model,
        original_attributes=attrs,
        speed_reduction_kmh=req.speed_reduction_kmh or 12.0,
        install_high_friction_asphalt=req.install_high_friction_asphalt if req.install_high_friction_asphalt is not None else True,
        improve_lighting_pct=req.improve_lighting_pct or 40.0
    )
    return result
