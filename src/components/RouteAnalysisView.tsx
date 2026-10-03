import React, { useState } from 'react';
import { HotspotCluster, RouteAnalysis } from '../types/accident';
import { PREDEFINED_ROUTES, analyzeRouteRisk } from '../services/routeService';
import { 
  Navigation, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  Sliders,
  CloudRain,
  Flame
} from 'lucide-react';

interface RouteAnalysisViewProps {
  hotspots: HotspotCluster[];
}

export const RouteAnalysisView: React.FC<RouteAnalysisViewProps> = ({ hotspots }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(PREDEFINED_ROUTES[0].id);
  const [simulatedRain, setSimulatedRain] = useState<boolean>(false);
  const [simulatedPeakHour, setSimulatedPeakHour] = useState<boolean>(true);

  const selectedRouteObj = PREDEFINED_ROUTES.find(r => r.id === selectedRouteId) || PREDEFINED_ROUTES[0];

  const weatherModifier = simulatedRain ? 12 : 0;
  const trafficModifier = simulatedPeakHour ? 8 : -4;

  const analysis: RouteAnalysis = analyzeRouteRisk(
    selectedRouteObj,
    hotspots,
    weatherModifier,
    trafficModifier
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Navigation className="w-6 h-6 text-indigo-400" />
            Route Risk Analysis & Hotspot Corridor Profiler
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Segment-level hazard scoring along transit corridors, evaluating cumulative exposure to high-density accident clusters.
          </p>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Corridor:</span>
          <select
            value={selectedRouteId}
            onChange={e => setSelectedRouteId(e.target.value)}
            className="bg-transparent font-medium text-indigo-300 focus:outline-hidden cursor-pointer"
          >
            {PREDEFINED_ROUTES.map(r => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Environmental Scenario Modifiers */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Environmental & Traffic Scenario Modifiers:</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              checked={simulatedRain}
              onChange={e => setSimulatedRain(e.target.checked)}
              className="accent-indigo-500 rounded"
            />
            <span className="text-slate-300 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Wet Weather (+12 pts)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              checked={simulatedPeakHour}
              onChange={e => setSimulatedPeakHour(e.target.checked)}
              className="accent-indigo-500 rounded"
            />
            <span className="text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Peak Rush Hour (+8 pts)
            </span>
          </label>
        </div>
      </div>

      {/* Overall Route Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall Route Risk Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">Overall Route Risk</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-extrabold font-mono ${
              analysis.overallRouteRisk >= 80 ? 'text-red-400' :
              analysis.overallRouteRisk >= 60 ? 'text-orange-400' :
              analysis.overallRouteRisk >= 35 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {analysis.overallRouteRisk}
            </span>
            <span className="text-slate-500 text-sm">/ 100</span>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase ${
              analysis.overallRouteRisk >= 80 ? 'bg-red-600' :
              analysis.overallRouteRisk >= 60 ? 'bg-orange-600' :
              analysis.overallRouteRisk >= 35 ? 'bg-amber-600' : 'bg-emerald-600'
            }`}>
              {analysis.overallRiskLevel} Risk
            </span>
          </div>
        </div>

        {/* Hotspots Intersected */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">Hotspots Crossed</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-400" />
            <span>{analysis.hotspotsCrossedCount}</span>
          </div>
          <div className="text-[11px] text-red-400 mt-2">
            Clusters within 750m buffer
          </div>
        </div>

        {/* High Risk Segments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">Critical Segments</span>
          <div className="text-3xl font-extrabold font-mono text-orange-400 mt-1">
            {analysis.highRiskSegmentsCount} / {analysis.segments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Segments scoring ≥ 65
          </div>
        </div>

        {/* Total Length & Estimated Travel Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">Distance & Est. Time</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {analysis.totalDistanceKm} <span className="text-sm font-normal text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            ~{analysis.estimatedTravelTimeMin} min (nominal velocity)
          </div>
        </div>

      </div>

      {/* Corridor Segment Risk Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Segment-by-Segment Risk Profile: {analysis.origin} ➔ {analysis.destination}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click individual segments to review localized geometric and operational hazards.
            </p>
          </div>
        </div>

        {/* Visual Progress Bar Strip */}
        <div className="space-y-1">
          <div className="flex h-3 rounded-full overflow-hidden w-full bg-slate-950">
            {analysis.segments.map((seg: any) => {
              const widthPct = (seg.lengthKm / analysis.totalDistanceKm) * 100;
              const color =
                seg.riskScore >= 80 ? 'bg-red-500' :
                seg.riskScore >= 60 ? 'bg-orange-500' :
                seg.riskScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div
                  key={seg.id}
                  style={{ width: `${widthPct}%` }}
                  title={`${seg.name}: ${seg.riskScore}/100 (${seg.riskLevel})`}
                  className={`${color} hover:brightness-125 transition-all cursor-pointer border-r border-slate-900 last:border-0`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{analysis.origin}</span>
            <span>{analysis.destination}</span>
          </div>
        </div>

        {/* Detailed Segment Cards */}
        <div className="space-y-3 pt-2">
          {analysis.segments.map((seg: any, idx: number) => (
            <div
              key={seg.id}
              className={`p-4 rounded-xl border transition-all text-xs ${
                seg.riskScore >= 80
                  ? 'bg-red-950/20 border-red-800/40'
                  : seg.riskScore >= 60
                  ? 'bg-orange-950/20 border-orange-800/40'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 font-bold text-[10px] flex items-center justify-center font-mono text-slate-300">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{seg.name}</h4>
                    <span className="text-slate-400 text-[11px]">
                      {seg.roadType} · {seg.lengthKm} km
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {seg.hotspotOverlap && (
                    <span className="flex items-center gap-1 text-[11px] text-red-400 font-semibold bg-red-900/40 px-2 py-0.5 rounded border border-red-700/50">
                      <Flame className="w-3 h-3" /> Intersects Hotspot ({seg.hotspotName})
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded font-bold font-mono text-white text-xs ${
                    seg.riskScore >= 80 ? 'bg-red-600' :
                    seg.riskScore >= 60 ? 'bg-orange-600' :
                    seg.riskScore >= 35 ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {seg.riskScore}/100 Risk
                  </span>
                </div>
              </div>

              {/* Segment Hazards */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 font-medium">Identified Hazards:</span>
                {seg.keyHazards.map((hazard: string, hIdx: number) => (
                  <span key={hIdx} className="bg-slate-900 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md text-[11px]">
                    {hazard}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Advisory & Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Route Safety Advisories</span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-300">
          {analysis.safetyAdvisory.map((adv: string, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{adv}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Disclaimer: Route analysis provides comparative empirical risk estimations. It does not represent guaranteed safety, nor does it replace real-time navigation tools or official traffic police instructions.
          </span>
        </div>
      </div>

    </div>
  );
};
