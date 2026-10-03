import React, { useState } from 'react';
import { DETECTED_PATTERNS, EMERGING_ANOMALIES, ROAD_SEGMENTS } from '../data/roadGuardData';
import { HotspotCluster } from '../types/accident';
import { 
  Radar, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Flame, 
  Zap, 
  Compass, 
  CheckCircle2, 
  Info,
  Sliders,
  Filter
} from 'lucide-react';

interface DetectAnomaliesViewProps {
  hotspots: HotspotCluster[];
  onNavigateToMap: () => void;
}

export const DetectAnomaliesView: React.FC<DetectAnomaliesViewProps> = ({ hotspots, onNavigateToMap }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>(EMERGING_ANOMALIES[0].id);

  const filteredPatterns = selectedCategory === 'All' 
    ? DETECTED_PATTERNS 
    : DETECTED_PATTERNS.filter(p => p.category === selectedCategory);

  const selectedAnomaly = EMERGING_ANOMALIES.find(a => a.id === selectedAnomalyId) || EMERGING_ANOMALIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-red-950 border border-red-800 px-2 py-0.5 rounded text-red-300 font-semibold">
              STAGE 3: DETECT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Radar className="w-6 h-6 text-red-400" />
            Intelligent Risk Pattern & Anomaly Detection
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous surveillance engine identifying unusual statistical deviations, spatial DBSCAN clusters, and recurring collision hazard patterns.
          </p>
        </div>

        {/* Action jump */}
        <button
          onClick={onNavigateToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Inspect Clusters on Map</span>
        </button>
      </div>

      {/* SECTION 1: EMERGING ANOMALIES CALLOUT (Prominent Warning Banners) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Emerging Anomalies ({EMERGING_ANOMALIES.length} Critical Deviations Detected)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Statistical Threshold: Z &gt; 2.5σ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMERGING_ANOMALIES.map(anom => {
            const isSelected = anom.id === selectedAnomalyId;
            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomalyId(anom.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>⚠️ Emerging Risk Detected</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-900/60 border border-red-700 text-red-200 font-semibold">
                    {anom.deviationZScore > 0 ? '+' : ''}{anom.deviationZScore}σ
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{anom.segmentName}</h3>
                  <span className="text-slate-400 text-[11px] font-mono">{anom.type}</span>
                </div>

                <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Observed:</span>
                    <span className="font-mono font-bold text-red-300">{anom.observedValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Baseline:</span>
                    <span className="font-mono text-slate-300">{anom.expectedBaseline}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>{anom.timestamp}</span>
                  <span className="text-indigo-400 font-medium">Click to review diagnostic &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Anomaly Diagnostic Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Diagnostic Investigation Report</span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Anomaly {selectedAnomaly.id}: {selectedAnomaly.segmentName}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold font-mono">
            Deviation Magnitude: {selectedAnomaly.deviationZScore}σ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-semibold block">Empirical Detection Data:</span>
            <p className="text-slate-300 leading-relaxed">
              {selectedAnomaly.supportingData}
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-emerald-400 font-semibold block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Immediate Preventive Countermeasure:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {selectedAnomaly.preventiveAdvisory}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 italic pt-1">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Analytical Principle: Detected anomalies indicate statistically significant deviation from rolling historical baselines; they prompt preventive traffic inspection rather than deterministically guaranteeing collision occurrence.
          </span>
        </div>
      </div>

      {/* SECTION 2: RECURRING PATTERN INTELLIGENCE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Recurring Risk Patterns & Systemic Dynamics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-variable correlations discovered via longitudinal clustering across weather, geometric sightlines, and diurnal traffic curves.
            </p>
          </div>

          {/* Pattern Category Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Temporal Cycle" className="bg-slate-900">Temporal Cycles</option>
              <option value="Weather Correlation" className="bg-slate-900">Weather Correlation</option>
              <option value="Spatial Clustering" className="bg-slate-900">Spatial Clustering</option>
              <option value="Road Geometry" className="bg-slate-900">Road Geometry</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatterns.map(pat => (
            <div key={pat.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
                  {pat.category}
                </span>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">
                  {(pat.confidence * 100).toFixed(0)}% Statistical Confidence
                </span>
              </div>

              <h4 className="font-bold text-white text-sm">{pat.title}</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">{pat.description}</p>

              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-500">Affected Corridors: </span>
                  {pat.affectedSegments.join(', ')}
                </div>
                <div className="text-[11px] text-indigo-300 flex items-start gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Preventive Strategy:</strong> {pat.preventiveInsight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SPATIAL DBSCAN CLUSTER SUMMARY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              Spatial Density Hotspot Clusters (Haversine DBSCAN ε=650m)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies geometric crash density zones, isolating core points from non-systemic dispersed background noise.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{hotspots.length} Core Clusters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {hotspots.slice(0, 6).map(h => (
            <div key={h.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">Zone #{h.clusterIndex + 1}</span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] text-white ${
                  h.riskScore >= 80 ? 'bg-red-600' :
                  h.riskScore >= 60 ? 'bg-orange-600' : 'bg-amber-600'
                }`}>
                  {h.riskScore}/100 Risk
                </span>
              </div>
              <h4 className="font-bold text-white text-xs truncate">{h.name}</h4>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{h.accidentCount} crashes</span>
                <span className="text-red-400">{h.fatalCount} fatal</span>
                <span>Radius {h.radiusMeters}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
