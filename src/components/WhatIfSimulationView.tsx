import React, { useState } from 'react';
import { 
  HotspotCluster, 
  WeatherCondition, 
  RoadSurface, 
  TrafficDensity, 
  RoadType, 
  JunctionType, 
  LightingCondition,
  PredictionResult 
} from '../types/accident';
import { KNOWN_HUBS } from '../data/mockAccidentData';
import { predictAccidentRisk } from '../services/mlRiskModel';
import { 
  SlidersHorizontal, 
  ArrowRight, 
  Sparkles, 
  Info, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCcw 
} from 'lucide-react';

interface WhatIfSimulationViewProps {
  hotspots: HotspotCluster[];
}

export const WhatIfSimulationView: React.FC<WhatIfSimulationViewProps> = ({ hotspots }) => {
  const [selectedHub, setSelectedHub] = useState<string>(KNOWN_HUBS[1].name); // GST Road Chromepet curve
  const currentHub = KNOWN_HUBS.find(h => h.name === selectedHub) || KNOWN_HUBS[1];

  // Baseline Scenario (Default: Severe Adverse conditions)
  const [baseWeather, setBaseWeather] = useState<WeatherCondition>('Rain');
  const [baseTraffic, setBaseTraffic] = useState<TrafficDensity>('Heavy');
  const [baseSurface, setBaseSurface] = useState<RoadSurface>('Wet');
  const [baseSpeedLimit, setBaseSpeedLimit] = useState<number>(75);
  const [baseLighting, setBaseLighting] = useState<LightingCondition>('Dark - No Street Lights');
  const [baseVisibility, setBaseVisibility] = useState<number>(3.0);

  // Simulated Scenario (Default: Countermeasure / Cleared conditions)
  const [simWeather, setSimWeather] = useState<WeatherCondition>('Clear');
  const [simTraffic, setSimTraffic] = useState<TrafficDensity>('Moderate');
  const [simSurface, setSimSurface] = useState<RoadSurface>('Dry');
  const [simSpeedLimit, setSimSpeedLimit] = useState<number>(50);
  const [simLighting, setSimLighting] = useState<LightingCondition>('Dark - Street Lights On');
  const [simVisibility, setSimVisibility] = useState<number>(9.0);

  // Compute Baseline Risk
  const baseResult: PredictionResult = predictAccidentRisk(
    {
      locationName: currentHub.name,
      latitude: currentHub.lat,
      longitude: currentHub.lng,
      date: '2026-10-02',
      time: '21:00',
      weather: baseWeather,
      roadSurface: baseSurface,
      trafficLevel: baseTraffic,
      roadType: currentHub.roadType,
      junctionType: currentHub.junctionType,
      speedLimit: baseSpeedLimit,
      visibilityKm: baseVisibility,
      lanes: 4,
      lighting: baseLighting,
      isPeakHour: false,
      isWeekend: true
    },
    hotspots
  );

  // Compute Simulated Risk
  const simResult: PredictionResult = predictAccidentRisk(
    {
      locationName: currentHub.name,
      latitude: currentHub.lat,
      longitude: currentHub.lng,
      date: '2026-10-02',
      time: '21:00',
      weather: simWeather,
      roadSurface: simSurface,
      trafficLevel: simTraffic,
      roadType: currentHub.roadType,
      junctionType: currentHub.junctionType,
      speedLimit: simSpeedLimit,
      visibilityKm: simVisibility,
      lanes: 4,
      lighting: simLighting,
      isPeakHour: false,
      isWeekend: true
    },
    hotspots
  );

  const deltaScore = simResult.riskScore - baseResult.riskScore;
  const isReduced = deltaScore < 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <SlidersHorizontal className="w-6 h-6 text-indigo-400" />
            What-If Sensitivity Simulation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experiment with proactive road safety interventions (e.g. speed calming, improved street lighting, weather clearance) and evaluate predicted risk reductions.
          </p>
        </div>

        {/* Corridor Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Target Corridor:</span>
          <select
            value={selectedHub}
            onChange={e => setSelectedHub(e.target.value)}
            className="bg-transparent font-medium text-indigo-300 focus:outline-hidden cursor-pointer"
          >
            {KNOWN_HUBS.map(h => (
              <option key={h.name} value={h.name} className="bg-slate-900 text-white">
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delta Outcome Spotlight Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Baseline Score */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-xs font-mono uppercase">Current Baseline State</span>
            <div className="text-4xl font-extrabold font-mono text-red-400 mt-1">
              {baseResult.riskScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-bold bg-red-600/30 border border-red-500/40 text-red-300">
              {baseResult.riskLevel} Risk
            </span>
          </div>

          {/* Delta Metric */}
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-xs text-slate-400 font-mono">Predicted Impact Delta</span>
            <div className={`text-4xl font-black font-mono my-1 flex items-center gap-1.5 ${
              isReduced ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isReduced ? <TrendingDown className="w-8 h-8" /> : <TrendingUp className="w-8 h-8" />}
              <span>{isReduced ? '' : '+'}{deltaScore} pts</span>
            </div>
            <span className="text-xs text-slate-300">
              {isReduced ? 'Significant Hazard Mitigation' : 'Elevated Hazard Risk'}
            </span>
          </div>

          {/* Simulated Score */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-xs font-mono uppercase">Simulated Countermeasure State</span>
            <div className={`text-4xl font-extrabold font-mono mt-1 ${
              simResult.riskScore >= 80 ? 'text-red-400' :
              simResult.riskScore >= 60 ? 'text-orange-400' :
              simResult.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {simResult.riskScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
            </div>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-bold ${
              simResult.riskScore >= 80 ? 'bg-red-600/30 text-red-300 border border-red-500/40' :
              simResult.riskScore >= 60 ? 'bg-orange-600/30 text-orange-300 border border-orange-500/40' :
              simResult.riskScore >= 35 ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
            }`}>
              {simResult.riskLevel} Risk
            </span>
          </div>

        </div>
      </div>

      {/* Comparison Grid: Baseline vs What-If Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Baseline Conditions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200">
              Condition Set A: Baseline Adverse
            </h3>
            <span className="text-xs text-red-400 font-mono font-semibold">Score: {baseResult.riskScore}</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Weather */}
            <div>
              <label className="block text-slate-400 mb-1">Weather</label>
              <select
                value={baseWeather}
                onChange={e => setBaseWeather(e.target.value as WeatherCondition)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="Rain">Rain</option>
                <option value="Storm">Storm</option>
                <option value="Fog/Mist">Fog/Mist</option>
                <option value="Clear">Clear</option>
              </select>
            </div>

            {/* Traffic */}
            <div>
              <label className="block text-slate-400 mb-1">Traffic Density</label>
              <select
                value={baseTraffic}
                onChange={e => setBaseTraffic(e.target.value as TrafficDensity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="Heavy">Heavy (Congested)</option>
                <option value="Gridlock">Gridlock</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Road Surface */}
            <div>
              <label className="block text-slate-400 mb-1">Road Surface</label>
              <select
                value={baseSurface}
                onChange={e => setBaseSurface(e.target.value as RoadSurface)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="Wet">Wet Asphalt</option>
                <option value="Flooded">Flooded / Standing Water</option>
                <option value="Dry">Dry Pavement</option>
              </select>
            </div>

            {/* Speed Limit */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Speed Limit</span>
                <span className="font-mono text-white">{baseSpeedLimit} km/h</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={baseSpeedLimit}
                onChange={e => setBaseSpeedLimit(parseInt(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            {/* Lighting */}
            <div>
              <label className="block text-slate-400 mb-1">Illumination</label>
              <select
                value={baseLighting}
                onChange={e => setBaseLighting(e.target.value as LightingCondition)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="Dark - No Street Lights">Dark (No Street Lights)</option>
                <option value="Dark - Street Lights On">Dark (Street Lights On)</option>
                <option value="Daylight">Daylight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Countermeasures */}
        <div className="bg-slate-900 border border-indigo-900/60 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Condition Set B: Simulated Interventions
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">Score: {simResult.riskScore}</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Weather */}
            <div>
              <label className="block text-slate-400 mb-1">Weather</label>
              <select
                value={simWeather}
                onChange={e => setSimWeather(e.target.value as WeatherCondition)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500"
              >
                <option value="Clear">Clear</option>
                <option value="Rain">Rain</option>
                <option value="Fog/Mist">Fog/Mist</option>
                <option value="Storm">Storm</option>
              </select>
            </div>

            {/* Traffic */}
            <div>
              <label className="block text-slate-400 mb-1">Traffic Density</label>
              <select
                value={simTraffic}
                onChange={e => setSimTraffic(e.target.value as TrafficDensity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500"
              >
                <option value="Moderate">Moderate (Steady)</option>
                <option value="Low">Low (Free Flow)</option>
                <option value="Heavy">Heavy</option>
                <option value="Gridlock">Gridlock</option>
              </select>
            </div>

            {/* Road Surface */}
            <div>
              <label className="block text-slate-400 mb-1">Road Surface</label>
              <select
                value={simSurface}
                onChange={e => setSimSurface(e.target.value as RoadSurface)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500"
              >
                <option value="Dry">Dry Pavement</option>
                <option value="Wet">Wet Asphalt</option>
                <option value="Flooded">Flooded</option>
              </select>
            </div>

            {/* Speed Limit */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Speed Limit (Calmed)</span>
                <span className="font-mono text-indigo-400">{simSpeedLimit} km/h</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={simSpeedLimit}
                onChange={e => setSimSpeedLimit(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Lighting */}
            <div>
              <label className="block text-slate-400 mb-1">Illumination</label>
              <select
                value={simLighting}
                onChange={e => setSimLighting(e.target.value as LightingCondition)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500"
              >
                <option value="Dark - Street Lights On">Dark (Street Lights On)</option>
                <option value="Daylight">Daylight</option>
                <option value="Dark - No Street Lights">Dark (No Street Lights)</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Causality Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Model Sensitivity Simulation Protocol</span>
        </div>
        <p className="leading-relaxed">
          The simulated differences represent marginal probabilistic shifts within the machine-learning decision boundary given isolated feature modifications. In civil and traffic engineering, empirical interventions should be validated via corridor speed audits and micro-simulation traffic models before permanent infrastructure deployment.
        </p>
      </div>

    </div>
  );
};
