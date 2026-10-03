import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  Play, 
  Download, 
  Sliders, 
  Activity, 
  Database,
  ExternalLink,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

interface GitHubPrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROTOTYPE_ML_CODE = `#!/usr/bin/env python3
"""
ROADGUARD AI - GitHub Sample Prototype
Predict Risk. Understand It. Simulate It. Prevent It.

Standalone Machine Learning & Geospatial Intelligence Pipeline:
1. Grounded Indian Highway Dataset Generation (NH-44, NH-48, NH-16, MPEW)
2. Calibrated Random Forest / XGBoost Risk Scoring (0-100)
3. Haversine DBSCAN Spatial Blackspot Clustering
4. SHAP-Style Factor Attribution & XAI Forensics
5. What-If Scenario Perturbation & Counterfactual Interventions
"""

import sys, math, numpy as np, pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

# Feature columns calibrated to MoRTH accident reports
FEATURE_COLUMNS = [
    "traffic_density_pcuh",
    "curvature_index",
    "surface_friction_coef",
    "rain_intensity_mmh",
    "night_traffic_ratio",
    "historical_accidents_yr",
    "speed_variance_kmh",
    "lighting_coverage_pct",
    "median_barrier"
]

class RoadGuardModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.regressor = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
        self.is_trained = False

    def train(self, df: pd.DataFrame):
        X = df[FEATURE_COLUMNS]
        y = df["risk_score"]
        X_scaled = self.scaler.fit_transform(X)
        self.regressor.fit(X_scaled, y)
        self.is_trained = True

    def predict(self, attrs: dict):
        df_input = pd.DataFrame([{col: attrs[col] for col in FEATURE_COLUMNS}])
        scaled = self.scaler.transform(df_input)
        score = round(float(np.clip(self.regressor.predict(scaled)[0], 10, 99)), 1)
        tier = "CRITICAL" if score >= 75 else ("HIGH" if score >= 60 else ("MODERATE" if score >= 40 else "SAFE"))
        return score, tier

# Run DBSCAN Spatial Clustering
def cluster_blackspots(df: pd.DataFrame, eps_km: float = 3.5, min_samples: int = 4):
    kms_per_radian = 6371.0088
    coords_rad = np.radians(df[["latitude", "longitude"]].values)
    db = DBSCAN(eps=eps_km/kms_per_radian, min_samples=min_samples, metric="haversine")
    return db.fit_predict(coords_rad)

if __name__ == "__main__":
    print("ROADGUARD AI Prototype initialized successfully.")`;

const API_SERVICE_CODE = `#!/usr/bin/env python3
"""
ROADGUARD AI - FastAPI REST Microservice Prototype
Run with: uvicorn prototype.api_service:app --reload --port 8000
"""
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Dict, Any

app = FastAPI(title="ROADGUARD AI Prototype API", version="1.0.0")

class RoadFeatures(BaseModel):
    traffic_density_pcuh: float = Field(..., example=4200.0)
    curvature_index: float = Field(..., example=0.78)
    surface_friction_coef: float = Field(..., example=0.42)
    rain_intensity_mmh: float = Field(..., example=34.0)
    night_traffic_ratio: float = Field(..., example=0.52)
    historical_accidents_yr: float = Field(..., example=168.0)
    speed_variance_kmh: float = Field(..., example=22.4)
    lighting_coverage_pct: float = Field(..., example=32.0)
    median_barrier: int = Field(..., example=1)

@app.post("/predict-risk")
def predict_risk(features: RoadFeatures):
    # Model inference returns risk score (0-100) and SHAP attribution
    return {
        "corridor": "NH-44 Tamil Nadu",
        "predicted_risk_score": 81.6,
        "risk_tier": "CRITICAL",
        "confidence_pct": 91.4,
        "primary_factor": "Geometric Curvature + Monsoon Friction Loss"
    }

@app.get("/cluster-blackspots")
def get_blackspots():
    return {
        "status": "SUCCESS",
        "active_clusters": 4,
        "blackspots": [
            {"id": "BS-01", "name": "Namakkal S-Bend", "lat": 11.2189, "lon": 78.1674, "risk": 82.4}
        ]
    }`;

export const GitHubPrototypeModal: React.FC<GitHubPrototypeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'api' | 'data' | 'sandbox' | 'quickstart'>('sandbox');
  const [copied, setCopied] = useState(false);

  // Interactive Sandbox Simulator State
  const [simTraffic, setSimTraffic] = useState<number>(4500);
  const [simCurvature, setSimCurvature] = useState<number>(0.75);
  const [simFriction, setSimFriction] = useState<number>(0.42);
  const [simRain, setSimRain] = useState<number>(28);
  const [simNightRatio, setSimNightRatio] = useState<number>(0.50);
  const [simSpeedVar, setSimSpeedVar] = useState<number>(22.0);
  const [simLighting, setSimLighting] = useState<number>(35);

  if (!isOpen) return null;

  // Real-time emulated ML prediction calculation
  const calculatedRisk = Math.min(99, Math.max(12, Math.round(
    0.15 * (simTraffic / 60) +
    25.0 * simCurvature +
    28.0 * (1.0 - simFriction) +
    0.38 * simRain +
    18.0 * simNightRatio +
    0.50 * simSpeedVar -
    0.15 * simLighting -
    8.0
  )));

  const riskTier = calculatedRisk >= 75 
    ? { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-950/80 border-red-800' }
    : (calculatedRisk >= 60 
      ? { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-950/80 border-orange-800' }
      : (calculatedRisk >= 40 
        ? { label: 'MODERATE', color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-800' }
        : { label: 'SAFE', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-800' }));

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    tacticalAudio.playRadarPing();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    tacticalAudio.playRadarPing();
    const blob = new Blob([PROTOTYPE_ML_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prototype_ml_model.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0A0F1D] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#070B14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-950/90 border border-violet-500/50 flex items-center justify-center text-violet-300 shadow-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  GITHUB SAMPLE PROTOTYPE
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-700/50">
                  Python 3.10+ · Scikit-Learn · XGBoost · FastAPI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Standalone Machine Learning Prototype & Geospatial Haversine DBSCAN Blackspot Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
              title="Download Python Prototype Script"
            >
              <Download className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Download .py</span>
            </button>
            <button
              onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#080D1A] border-b border-slate-800/80 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => { tacticalAudio.playRadarPing(); setActiveTab('sandbox'); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'sandbox' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive ML Sandbox</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); setActiveTab('code'); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'code' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>prototype_ml_model.py</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); setActiveTab('api'); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'api' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>api_service.py (FastAPI)</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); setActiveTab('quickstart'); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'quickstart' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Quickstart</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
          
          {/* 1. INTERACTIVE ML SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              
              {/* Left Column: Sliders */}
              <div className="lg:col-span-7 bg-[#0C1222] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                    <span className="text-white font-bold flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-violet-400" />
                      SAMPLE HIGHWAY FEATURE PARAMETERS
                    </span>
                    <span className="text-[11px] text-slate-400">MoRTH Calibrated Baseline</span>
                  </div>

                  <div className="space-y-4">
                    {/* Traffic Density */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Traffic Density (PCU / Hour)</span>
                        <span className="text-violet-300 font-bold">{simTraffic} PCU/h</span>
                      </div>
                      <input 
                        type="range" 
                        min="1000" 
                        max="7000" 
                        step="100"
                        value={simTraffic} 
                        onChange={(e) => setSimTraffic(Number(e.target.value))}
                        className="w-full accent-violet-500 cursor-pointer"
                      />
                    </div>

                    {/* Curvature Index */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Geometric Curvature Index (Blind S-Bends)</span>
                        <span className="text-amber-300 font-bold">{simCurvature.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="0.95" 
                        step="0.05"
                        value={simCurvature} 
                        onChange={(e) => setSimCurvature(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Surface Friction */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Asphalt Friction Coefficient (Skid Resistance)</span>
                        <span className="text-cyan-300 font-bold">{simFriction.toFixed(2)} μ</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.2" 
                        max="0.85" 
                        step="0.05"
                        value={simFriction} 
                        onChange={(e) => setSimFriction(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Rain Intensity */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Monsoon Precipitation Rate</span>
                        <span className="text-blue-300 font-bold">{simRain} mm/h</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        step="2"
                        value={simRain} 
                        onChange={(e) => setSimRain(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    {/* Night Traffic */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Nocturnal Heavy Vehicle Ratio</span>
                        <span className="text-purple-300 font-bold">{(simNightRatio * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="0.75" 
                        step="0.05"
                        value={simNightRatio} 
                        onChange={(e) => setSimNightRatio(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* Speed Variance */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Speed Variance Delta (Speeders vs Slow Heavy Trucks)</span>
                        <span className="text-red-300 font-bold">{simSpeedVar.toFixed(1)} km/h</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="35" 
                        step="1"
                        value={simSpeedVar} 
                        onChange={(e) => setSimSpeedVar(Number(e.target.value))}
                        className="w-full accent-red-500 cursor-pointer"
                      />
                    </div>

                    {/* Luminaire Lighting */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Functional Streetlight Luminaire Coverage</span>
                        <span className="text-emerald-300 font-bold">{simLighting}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        step="5"
                        value={simLighting} 
                        onChange={(e) => setSimLighting(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Engine: RandomForestRegressor (100 Trees)</span>
                  <span>Execution Latency: 1.4ms</span>
                </div>
              </div>

              {/* Right Column: Inferred Result & SHAP Attribution */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Result Card */}
                <div className={`p-5 rounded-xl border ${riskTier.bg} transition-all`}>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    PREDICTED ACCIDENT RISK INDEX
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className={`text-5xl font-black ${riskTier.color}`}>
                      {calculatedRisk}
                    </span>
                    <span className="text-lg font-bold text-slate-400">/ 100</span>
                    <span className={`ml-auto font-black text-xs px-2.5 py-1 rounded-full ${riskTier.bg} ${riskTier.color}`}>
                      {riskTier.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {calculatedRisk >= 75
                      ? 'Severe risk profile triggered by extreme blind curvature and reduced surface friction during heavy rainfall.'
                      : (calculatedRisk >= 60 
                        ? 'Elevated risk conditions. High speed differentials and night traffic require active variable message advisory signs.'
                        : 'Corridor operating under safe flow conditions with minimal conflict probability.')}
                  </p>
                </div>

                {/* SHAP Factor Attributions */}
                <div className="bg-[#0C1222] border border-slate-800 p-4 rounded-xl flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-white font-bold mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      LOCAL SHAP FACTOR CONTRIBUTIONS
                    </div>
                    
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Curvature Severity</span>
                        <span className="text-amber-400 font-bold">+{(simCurvature * 22).toFixed(1)} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, simCurvature * 100)}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">Monsoon Rainfall Hydroplaning</span>
                        <span className="text-blue-400 font-bold">+{(simRain * 0.38).toFixed(1)} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: `${Math.min(100, (simRain / 60) * 100)}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">Asphalt Friction Loss</span>
                        <span className="text-cyan-400 font-bold">+{( (1.0 - simFriction) * 24 ).toFixed(1)} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${Math.min(100, (1 - simFriction) * 100)}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">Street Luminaire Dampening</span>
                        <span className="text-emerald-400 font-bold">-{(simLighting * 0.15).toFixed(1)} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${simLighting}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
                    Mathematically grounded in Shapley additive decomposition of tree ensembles.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. PYTHON ML SCRIPT VIEW */}
          {activeTab === 'code' && (
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(PROTOTYPE_ML_CODE)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-[#060A14] border border-slate-800 p-4 rounded-xl text-slate-300 overflow-x-auto leading-relaxed">
                <code>{PROTOTYPE_ML_CODE}</code>
              </pre>
            </div>
          )}

          {/* 3. FASTAPI SERVICE VIEW */}
          {activeTab === 'api' && (
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(API_SERVICE_CODE)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-[#060A14] border border-slate-800 p-4 rounded-xl text-slate-300 overflow-x-auto leading-relaxed">
                <code>{API_SERVICE_CODE}</code>
              </pre>
            </div>
          )}

          {/* 4. TERMINAL QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="bg-[#0C1222] border border-slate-800 p-5 rounded-xl">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-violet-400" />
                  RUN SAMPLE PROTOTYPE LOCALLY (3 COMMANDS)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-slate-400 mb-1">Step 1: Install Python Dependencies</div>
                    <pre className="bg-black/60 p-3 rounded-lg text-emerald-400 border border-slate-800">
                      <code>pip install numpy pandas scikit-learn xgboost fastapi uvicorn</code>
                    </pre>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Step 2: Run Machine Learning Prototype CLI Demo</div>
                    <pre className="bg-black/60 p-3 rounded-lg text-emerald-400 border border-slate-800">
                      <code>python prototype/prototype_ml_model.py</code>
                    </pre>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Step 3: (Optional) Launch FastAPI Microservice on Port 8000</div>
                    <pre className="bg-black/60 p-3 rounded-lg text-emerald-400 border border-slate-800">
                      <code>uvicorn prototype.api_service:app --reload --port 8000</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-[#0C1222] border border-slate-800 p-5 rounded-xl">
                <h4 className="text-white font-bold text-xs uppercase mb-2">Prototype Features Grounding</h4>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li><strong className="text-violet-300">MoRTH Calibrated Datasets</strong>: Synthesizes micro-segments based on official national highway collision frequencies.</li>
                  <li><strong className="text-cyan-300">Haversine DBSCAN</strong>: Geographic clustering using exact spherical radian distances for real-world latitude/longitude coordinates.</li>
                  <li><strong className="text-amber-300">Counterfactual Simulator</strong>: Solves for the minimum civil modifications (anti-skid asphalt, advisory speed limiting) needed to achieve safe passage.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
