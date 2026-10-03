# ROADGUARD AI — Lightweight GitHub Prototype Specification

> **“Predict Risk. Understand It. Simulate It. Prevent It.”**  
> A developer guide and architecture specification for building, cloning, and running a lightweight local prototype of the **ROADGUARD AI** Core Machine Learning & Road Safety Intelligence Pipeline.

---

## 🎯 Purpose of the Lightweight Prototype

This prototype provides developers, researchers, and transportation engineers with a minimalist, self-contained implementation of the ROADGUARD AI pipeline. It isolates the core algorithms—**Risk Prediction, SHAP Explainability, DBSCAN Blackspot Clustering, What-If Perturbation, and Counterfactual Prevention**—from the heavy 3D Digital Twin visualization layer so it can be cloned, understood, and run in **under 3 minutes** on any standard laptop.

---

## 📁 Prototype Repository Architecture

```text
roadguard-ai-prototype/
├── data/
│   ├── sample_indian_highways.json      # MoRTH calibrated highway records (NH-44, NH-48, MPEW)
│   └── weather_profiles.json            # Open-Meteo simulated rainfall and fog matrices
├── src/
│   ├── __init__.py
│   ├── pipeline.py                      # Unified 5-stage AI pipeline orchestrator
│   ├── models/
│   │   ├── risk_regressor.py            # Random Forest / XGBoost calibrated risk scorer (0-100)
│   │   └── shap_explainer.py            # Local feature attribution & causal breakdown
│   ├── spatial/
│   │   └── dbscan_blackspots.py         # Haversine spatial density clustering for blackspots
│   └── simulation/
│       ├── what_if_engine.py            # Environmental sensitivity perturbation testing
│       └── counterfactual_solver.py     # Minimum civil intervention optimizer
├── api/
│   ├── __init__.py
│   └── main.py                          # FastAPI REST microservice with OpenAPI Swagger docs
├── client/
│   └── test_client.py                   # Automated test script exercising all 5 AI stages
├── requirements.txt                     # Minimal Python dependencies
├── prototype-sample.md                  # This specification document
└── README.md                            # GitHub repository overview & quickstart
```

---

## ⚡ 3-Minute Quickstart (Local Execution)

### Step 1: Clone & Set Up Virtual Environment

```bash
# Clone the prototype repository
git clone https://github.com/btech-ai/roadguard-ai-prototype.git
cd roadguard-ai-prototype

# Create and activate a Python virtual environment (Python 3.9+)
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install lightweight dependencies
pip install -r requirements.txt
```

### `requirements.txt`
```text
numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
xgboost>=2.0.0
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.4.0
requests>=2.31.0
```

*(Note: The prototype includes a zero-dependency standard library fallback if running in environments without compiler toolchains).*

---

### Step 2: Run the Unified AI Pipeline CLI Demo

Execute the self-contained pipeline demo with a single command:

```bash
python client/test_client.py
# Or run the standalone engine directly:
python prototype/prototype_ml_model.py
```

#### Expected Terminal Output:
```text
========================================================================
 ROADGUARD AI — LIGHTWEIGHT PROTOTYPE CLI DEMO
========================================================================

[STAGE 1: DATA INGESTION & SYNTHESIS]
 -> Ingested 6 MoRTH benchmark corridors (NH-44, NH-48, NH-16, MPEW, NH-66, DME)
 -> Synthesized 500 micro-segments with realistic traffic & geometric variances.

[STAGE 2: AI RISK PREDICTION]
 -> Target Segment: NH-44 Tamil Nadu (Salem - Namakkal S-Bend)
 -> Predicted Risk Score : 81.6 / 100
 -> Risk Classification : CRITICAL (High Collision Likelihood)
 -> Model Confidence    : 91.4%

[STAGE 3: SHAP FACTOR EXPLANATION]
 -> Primary Risk Drivers:
    * Geometric Curvature Index   : +11.20 pts  (Sharp reverse curves)
    * Surface Friction Loss (Rain): + 8.45 pts  (Aquaplaning hazard)
    * Traffic Density             : + 6.12 pts  (4,200 PCU/h saturation)
    * Nocturnal Freight Ratio     : + 3.80 pts  (52% heavy trucks)

[STAGE 4: HAVERSINE DBSCAN BLACKSPOT DETECTION]
 -> Clustered 500 coordinates with eps=4.0km, min_samples=4
 -> Identified 4 high-density accident blackspot clusters:
    * Cluster #0: Lat 11.2189, Lon 78.1674 (Namakkal S-Bend) | 28 incidents | Risk 82.4/100
    * Cluster #1: Lat 18.7533, Lon 73.3444 (Bhor Ghat Incline)| 34 incidents | Risk 88.0/100

[STAGE 5: COUNTERFACTUAL INTERVENTION SIMULATION]
 -> Baseline Risk: 81.6/100 (CRITICAL)
 -> Solving for minimum modifications to achieve SAFE tier (<50/100)...
 -> Recommended Actions:
    1. Dynamic VMS Advisory Speed Reduction: -12 km/h
    2. High-Friction Mastic Asphalt Resurfacing: +0.30 friction coefficient
    3. High-Lux LED Luminaire Coverage: +40% illumination
 -> Post-Intervention Projected Risk: 48.2 / 100 (SAFE)
 -> Net Risk Reduction: -33.4 points (40.9% improvement)
========================================================================
```

---

## 🌐 Step 3: Run the FastAPI Microservice

Launch the lightweight REST API:

```bash
uvicorn prototype.api_service:app --reload --port 8000
```

Once started, open the interactive Swagger UI in your browser:
👉 **`http://localhost:8000/docs`**

---

## 📡 REST API Endpoints Specification

### 1. Predict Road Segment Risk (`POST /predict-risk`)
Calculates the calibrated 0–100 risk score and SHAP factor contributions.

#### Request Payload:
```json
{
  "traffic_density_pcuh": 4200.0,
  "curvature_index": 0.78,
  "surface_friction_coef": 0.42,
  "rain_intensity_mmh": 34.0,
  "night_traffic_ratio": 0.52,
  "historical_accidents_yr": 168.0,
  "speed_variance_kmh": 22.4,
  "lighting_coverage_pct": 32.0,
  "median_barrier": 1
}
```

#### Response:
```json
{
  "risk_score": 81.6,
  "risk_tier": "CRITICAL (High Collision Likelihood)",
  "attributions": {
    "curvature_index": 11.2,
    "surface_friction_coef": 8.45,
    "rain_intensity_mmh": 6.12,
    "night_traffic_ratio": 3.8,
    "traffic_density_pcuh": 3.45,
    "lighting_coverage_pct": -2.8
  },
  "status": "SUCCESS"
}
```

---

### 2. Cluster Blackspots via Haversine DBSCAN (`GET /cluster-blackspots`)
Finds geographical collision clusters using spherical distance geometry.

#### Query Parameters:
- `eps_km` (default: 4.0): Neighborhood radius in kilometers.
- `min_samples` (default: 5): Minimum incidents required to declare an official MoRTH blackspot cluster.

#### Response:
```json
{
  "total_clusters": 4,
  "eps_km": 4.0,
  "clusters": [
    {
      "cluster_id": 0,
      "latitude": 11.2189,
      "longitude": 78.1674,
      "incident_count": 28,
      "average_risk_score": 82.4,
      "severity_tier": "CRITICAL"
    }
  ]
}
```

---

### 3. Solve Counterfactual Prevention (`POST /counterfactual`)
Computes the minimal structural and regulatory modifications needed to transition a dangerous road segment into a safe state.

#### Request:
```json
{
  "features": {
    "traffic_density_pcuh": 4200.0,
    "curvature_index": 0.78,
    "surface_friction_coef": 0.42,
    "rain_intensity_mmh": 34.0,
    "night_traffic_ratio": 0.52,
    "historical_accidents_yr": 168.0,
    "speed_variance_kmh": 22.4,
    "lighting_coverage_pct": 32.0,
    "median_barrier": 1
  },
  "speed_reduction_kmh": 12.0,
  "install_high_friction_asphalt": true,
  "improve_lighting_pct": 40.0
}
```

#### Response:
```json
{
  "baseline_risk": 81.6,
  "baseline_tier": "CRITICAL",
  "post_intervention_risk": 48.2,
  "post_intervention_tier": "SAFE",
  "risk_reduction_points": 33.4,
  "percentage_improvement": 40.9,
  "interventions": [
    "VMS Advisory Speed Reduction (-12 km/h)",
    "Anti-Skid Mastic Asphalt Surface Application (+0.30 friction)",
    "High-Lux LED Luminaire Coverage (+40%)"
  ]
}
```

---

## 🧪 Testing the Pipeline Programmatically (Python Script)

Developers can verify the prototype in their own scripts with just a few lines:

```python
from prototype.prototype_ml_model import (
    RoadGuardModel, 
    generate_training_data, 
    simulate_counterfactual_intervention,
    SAMPLE_INDIAN_HIGHWAYS
)

# 1. Initialize and train
df_records = generate_training_data(n_samples=300)
model = RoadGuardModel()
model.train(df_records)

# 2. Evaluate sample road segment
test_road = SAMPLE_INDIAN_HIGHWAYS[0] # NH-44 Tamil Nadu
risk, tier, attributions = model.predict(test_road)
print(f"Predicted Risk: {risk}/100 [{tier}]")

# 3. Simulate counterfactual prevention
intervention = simulate_counterfactual_intervention(model, test_road)
print(f"Reduced Risk: {intervention['post_intervention_risk']}/100 (Saved {intervention['risk_reduction_points']} pts)")
```

---

## 📊 Empirical Data Grounding Standards

1. **MoRTH / OGD India (`data.gov.in`)**:
   - Accident counts, fatality rates, junction collision profiles, and highway classifications.
2. **Open-Meteo Weather Model**:
   - Rainfall rates ($\text{mm/h}$), relative humidity ($\%$) and horizontal visibility ($\text{km}$) calibrated to Indian monsoon cycles.
3. **OpenStreetMap Road Geometry**:
   - Curvature indices ($0–1$), speed variance ($\text{km/h}$), and physical median barrier presence.

---

## 💡 How This Prototype Connects to the Full System

| Feature | Lightweight Prototype (`prototype/`) | Full ROADGUARD AI Web App |
| :--- | :--- | :--- |
| **Interface** | CLI Terminal & FastAPI Swagger Docs | Full-Screen 3D India Digital Twin with Breathing Risk Pulse |
| **Prediction** | Random Forest / XGBoost in Python | Real-Time In-Browser WebGL + Edge AI Inference |
| **Explainability** | Textual SHAP Attributions | Interactive Causal DAG Graphs & Visual Waterfall Cards |
| **What-If** | Scripted JSON Perturbation | Real-Time Dual Concentric Scenario Sliders & Propagation |
| **Routing** | Analytical Safety Index | 108 Emergency Green Corridor & Interstate Route Optimization |
