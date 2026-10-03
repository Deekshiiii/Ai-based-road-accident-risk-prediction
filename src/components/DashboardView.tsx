import React from 'react';
import { AccidentRecord, HotspotCluster } from '../types/accident';
import { ROAD_SEGMENTS, EMERGING_ANOMALIES, DETECTED_PATTERNS } from '../data/roadGuardData';
import { 
  Activity, 
  AlertTriangle, 
  Flame, 
  Skull, 
  TrendingUp, 
  Compass, 
  ShieldAlert, 
  Fingerprint, 
  Radar, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowUpRight,
  Sparkles,
  Ambulance,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  accidents: AccidentRecord[];
  hotspots: HotspotCluster[];
  onNavigateToMap: () => void;
  onNavigateToPredict: () => void;
  onNavigateToFingerprint: () => void;
  onNavigateToDetect: () => void;
  onNavigateToSimulator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accidents,
  hotspots,
  onNavigateToMap,
  onNavigateToPredict,
  onNavigateToFingerprint,
  onNavigateToDetect,
  onNavigateToSimulator
}) => {
  // Aggregate Metrics
  const totalAccidents = accidents.length;
  const fatalAccidents = accidents.filter(a => a.severity === 'Fatal').length;
  const severeAccidents = accidents.filter(a => a.severity === 'Severe').length;
  const totalCasualties = accidents.reduce((sum, a) => sum + a.casualties, 0);

  // Overall Metropolitan Risk Index
  const overallRiskIndex = Math.round(
    ROAD_SEGMENTS.reduce((sum, s) => sum + s.currentRiskScore, 0) / ROAD_SEGMENTS.length
  );

  const highRiskRoads = ROAD_SEGMENTS.filter(s => s.currentRiskScore >= 75);
  const emergencyBottlenecks = ROAD_SEGMENTS.filter(s => s.isHighRiskLimitedEmergency);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hero Banner: 5-Stage Core Intelligence Pipeline */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-indigo-950 border border-indigo-700/80 px-2 py-0.5 rounded text-indigo-300 font-semibold tracking-wider">
                CORE INTELLIGENCE MODEL
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                PREDICT &rarr; EXPLAIN &rarr; DETECT &rarr; SIMULATE &rarr; PREVENT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
              ROADGUARD AI — Unified Risk Intelligence Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Moving beyond historical heatmaps: predictive ML risk scoring, multi-dimensional risk fingerprints, emerging anomaly detection, and actionable preventive engineering.
            </p>
          </div>

          {/* Quick 5-Stage Action Links */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToPredict}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm shadow-indigo-600/30 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Predict</span>
            </button>
            <button
              onClick={onNavigateToFingerprint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explain</span>
            </button>
            <button
              onClick={onNavigateToDetect}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <Radar className="w-3.5 h-3.5 text-red-400" />
              <span>Detect</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Overall Risk Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs pb-1">
            <span>Overall Risk Index</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {overallRiskIndex} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            High Risk Network Baseline
          </div>
        </div>

        {/* Card 2: High Risk Road Segments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs pb-1">
            <span>High-Risk Segments</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {highRiskRoads.length} <span className="text-xs font-normal text-slate-500">/ {ROAD_SEGMENTS.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Scores &ge; 75/100
          </div>
        </div>

        {/* Card 3: Active Anomalies */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs pb-1">
            <span>Emerging Anomalies</span>
            <Radar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {EMERGING_ANOMALIES.length}
          </div>
          <div className="text-[11px] text-red-400 mt-1">
            Statistically &gt; 2.5σ Dev
          </div>
        </div>

        {/* Card 4: Emergency Bottlenecks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs pb-1">
            <span>Emergency Bottlenecks</span>
            <Ambulance className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {emergencyBottlenecks.length}
          </div>
          <div className="text-[11px] text-red-400 mt-1">
            High Risk + Delay &gt; 15m
          </div>
        </div>

        {/* Card 5: Monitored Incidents */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs pb-1">
            <span>Monitored Incidents</span>
            <Skull className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalAccidents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {fatalAccidents} Fatal · {totalCasualties} Dead
          </div>
        </div>

      </div>

      {/* SECTION: Emerging Anomalies & High-Risk Roads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: High-Risk Road Segments & Digital Fingerprints (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                High-Risk Road Segments (Digital Profile Ranks)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ranked by combined accident history, geometric conflict vectors, and traffic saturation.
              </p>
            </div>
            <button
              onClick={onNavigateToFingerprint}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View Fingerprints</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {ROAD_SEGMENTS.slice(0, 5).map(seg => (
              <div
                key={seg.id}
                onClick={onNavigateToFingerprint}
                className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-bold">{seg.id}</span>
                    <span className="font-bold text-white">{seg.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {seg.roadType} · Peak: <span className="text-slate-300 font-semibold">{seg.peakRiskPeriod}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {seg.isHighRiskLimitedEmergency && (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] text-red-300 font-bold">
                      Limited Emergency Access
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs text-white ${
                    seg.currentRiskScore >= 80 ? 'bg-red-600' :
                    seg.currentRiskScore >= 60 ? 'bg-orange-600' : 'bg-amber-600'
                  }`}>
                    {seg.currentRiskScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Emerging Anomalies Callout (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radar className="w-4 h-4 text-amber-400" />
                Active Emerging Anomalies
              </h3>
              <button
                onClick={onNavigateToDetect}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>All Anomalies</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {EMERGING_ANOMALIES.map(anom => (
                <div key={anom.id} className="p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> ⚠️ {anom.segmentName}
                    </span>
                    <span className="font-mono text-[10px] bg-red-900/60 px-1.5 rounded text-white">
                      {anom.deviationZScore}σ
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">{anom.type}: <strong className="text-white">{anom.observedValue}</strong></div>
                  <div className="text-[10px] text-slate-400">{anom.preventiveAdvisory}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Real-time anomaly detector scans rolling 7-day velocity and collision distributions every 15 minutes.
          </div>
        </div>

      </div>

      {/* SECTION: Recent AI Preventive Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Recent AI Preventive Insights & Intelligence</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Stage 5: PREVENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-300 text-xs block">R-102: GST Chromepet Reverse Curve</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              “This road segment shows a recurring high-risk pattern (89/100) under evening and low-visibility conditions. Review lighting, signage, and consider mobile radar patrols during 8 PM – 1 AM.”
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Priority: Critical Speed Enforcement
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-300 text-xs block">R-101: Kathipara Multi-Grade Cloverleaf</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              “Elevated collision frequency occurs on flyover approach ramps during rush hours. Install physical flexible lane dividers to discourage late multi-lane exit weaving.”
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Priority: Geometric Weave Channelization
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-300 text-xs block">R-106: Akkarai Maritime Coastal Bend</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              “Maritime moisture reduces pavement skid coefficient during weekend late nights. Station dedicated emergency response vehicle and apply anti-skid aggregate.”
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Priority: Emergency Ambulatory Readiness
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
