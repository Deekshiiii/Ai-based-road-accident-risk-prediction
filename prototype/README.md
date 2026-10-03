# ROADGUARD AI — Python ML & API Prototype Sample

This folder contains a self-contained, standalone sample prototype of the **ROADGUARD AI** Machine Learning and Geospatial Intelligence pipeline for Indian Highway Accident Risk Prediction & Prevention.

---

## 📂 Prototype Directory Contents

- `prototype_ml_model.py`: Complete ML pipeline including dataset generation, Random Forest / XGBoost training, Haversine DBSCAN blackspot clustering, SHAP-style feature attribution, and counterfactual simulation.
- `api_service.py`: FastAPI REST API microservice exposing `/predict-risk`, `/cluster-blackspots`, `/counterfactual`, and `/corridors`.
- `sample_highway_data.json`: Pre-configured Indian highway corridors with empirical MoRTH baselines (NH-44, NH-48, NH-16, Mumbai-Pune Expressway, DME).

---

## ⚡ Quick Start (Run in 2 Minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Dependencies: `numpy`, `pandas`, `scikit-learn`, `xgboost`, `fastapi`, `uvicorn`, `pydantic`)*

### 2. Run the Machine Learning Pipeline CLI Demo
```bash
python -m prototype.prototype_ml_model
# Or directly:
python prototype/prototype_ml_model.py
```

**Expected Console Output**:
```text
========================================================================
 ROADGUARD AI — GITHUB SAMPLE PROTOTYPE
 AI Road Risk Intelligence & Proactive Prevention Platform
========================================================================

[STEP 1/5] Synthesizing MoRTH-calibrated Indian highway training data...
 -> Generated 500 road corridor micro-segments.
 -> Mean Risk Score: 67.4 / 100

[STEP 2/5] Training Random Forest Risk Intelligence Regressor...
 -> Model successfully trained.
 -> Feature Importances:
    - curvature_index           : 0.284 | ████████
    - surface_friction_coef     : 0.245 | ███████
    - traffic_density_pcuh      : 0.176 | █████
    - rain_intensity_mmh        : 0.112 | ███
    ...

[STEP 3/5] Evaluating Test Sample: NH-44 Tamil Nadu (Salem - Namakkal)
 -> PREDICTED ROAD RISK SCORE : 81.6 / 100
 -> TIER                      : CRITICAL (High Collision Likelihood)
 -> SHAP-Style Factor Attribution Breakdown:
    - curvature_index           : +11.20 risk points
    - surface_friction_coef     : + 8.45 risk points
    - rain_intensity_mmh        : + 6.12 risk points

[STEP 4/5] Executing Haversine DBSCAN Blackspot Clustering...
 -> Identified 4 high-density accident blackspot clusters:
    * Cluster #0: Lat 11.2189, Lon 78.1674 | 28 incidents | Risk 82.4/100 [CRITICAL]
    ...

[STEP 5/5] Testing Counterfactual Prevention Intervention Engine...
 -> Baseline Corridor Risk   : 81.6/100 (CRITICAL)
 -> Post-Intervention Risk   : 48.2/100 (MODERATE)
 -> Risk Reduction Delta     : -33.4 points (40.9% reduction)
 -> Applied Civil Interventions:
    ✓ VMS Advisory Speed Reduction (-12 km/h)
    ✓ Anti-Skid Mastic Asphalt Surface Application (+0.30 friction)
    ✓ High-Lux LED Luminaire Coverage (+40%)
```

---

## 🌐 Run the REST API Microservice

Launch the FastAPI application on port 8000:
```bash
uvicorn prototype.api_service:app --reload --port 8000
```

### Test API via cURL:

#### Predict Highway Segment Risk:
```bash
curl -X POST "http://localhost:8000/predict-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "traffic_density_pcuh": 4500,
    "curvature_index": 0.82,
    "surface_friction_coef": 0.38,
    "rain_intensity_mmh": 36.0,
    "night_traffic_ratio": 0.55,
    "historical_accidents_yr": 180,
    "speed_variance_kmh": 24.0,
    "lighting_coverage_pct": 30.0,
    "median_barrier": 1
  }'
```

**Response**:
```json
{
  "risk_score": 84.2,
  "risk_tier": "CRITICAL (High Collision Likelihood)",
  "attributions": {
    "curvature_index": 12.4,
    "surface_friction_coef": 9.8,
    "rain_intensity_mmh": 7.2
  },
  "status": "SUCCESS"
}
```

#### Identify Blackspots via DBSCAN:
```bash
curl "http://localhost:8000/cluster-blackspots?eps_km=4.0&min_samples=5"
```

#### Simulate Counterfactual Intervention:
```bash
curl -X POST "http://localhost:8000/counterfactual" \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "traffic_density_pcuh": 4500,
      "curvature_index": 0.82,
      "surface_friction_coef": 0.38,
      "rain_intensity_mmh": 36.0,
      "night_traffic_ratio": 0.55,
      "historical_accidents_yr": 180,
      "speed_variance_kmh": 24.0,
      "lighting_coverage_pct": 30.0,
      "median_barrier": 1
    },
    "speed_reduction_kmh": 12.0,
    "install_high_friction_asphalt": true,
    "improve_lighting_pct": 40.0
  }'
```

---

## 📊 Dataset Attribution
This prototype uses data schema definitions derived from:
- **Ministry of Road Transport and Highways (MoRTH)** Transport Research Wing (TRW) Road Accidents in India.
- **Open Government Data (OGD) Platform India** (`data.gov.in`).
