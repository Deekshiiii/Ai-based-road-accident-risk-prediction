import React, { useState } from 'react';
import { ROAD_SEGMENTS } from '../data/roadGuardData';
import { RoadSegmentProfile } from '../types/accident';
import { 
  Fingerprint, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Layers, 
  Ambulance, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface RiskFingerprintViewProps {
  onSelectSegment?: (segment: RoadSegmentProfile) => void;
}

export const RiskFingerprintView: React.FC<RiskFingerprintViewProps> = ({ onSelectSegment }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(ROAD_SEGMENTS[1].id); // R-102
  const segment = ROAD_SEGMENTS.find(s => s.id === selectedSegmentId) || ROAD_SEGMENTS[1];

  const fp = segment.fingerprint;

  const fingerprintDimensions = [
    { label: 'Accident History', score: fp.accidentHistory, desc: 'Historical collision density & repeating incident cluster index' },
    { label: 'Traffic Intensity', score: fp.traffic, desc: 'Flow volume approaching saturation capacity & friction points' },
    { label: 'Infrastructure & Geometry', score: fp.infrastructure, desc: 'Curvature, blind merge ramps, lane width, and speed limit geometry' },
    { label: 'Weather Vulnerability', score: fp.weather, desc: 'Pavement skid resistance and aquaplaning propensity during rainfall' },
    { label: 'Visibility Deficit', score: fp.visibility, desc: 'Nocturnal ambient lighting, street luminaire lux levels, and fog' },
    { label: 'Severity Pattern', score: fp.severityPattern, desc: 'Historical proportion of fatal casualties vs slight property damage' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded text-indigo-300 font-semibold">
              STAGE 2: EXPLAIN
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Fingerprint className="w-6 h-6 text-indigo-400" />
            AI Risk Fingerprint & Explainability Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deconstructs composite road-risk scores into multi-dimensional feature fingerprints, answering exactly why a road segment is hazardous.
          </p>
        </div>

        {/* Segment Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Road Segment:</span>
          <select
            value={selectedSegmentId}
            onChange={e => setSelectedSegmentId(e.target.value)}
            className="bg-transparent font-medium text-indigo-300 focus:outline-hidden cursor-pointer"
          >
            {ROAD_SEGMENTS.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.id}: {s.name} ({s.currentRiskScore}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Digital Risk Fingerprint Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* Header Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400">{segment.id}</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">{segment.corridor}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{segment.name}</h2>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold font-mono ${
                segment.currentRiskScore >= 80 ? 'text-red-400' :
                segment.currentRiskScore >= 60 ? 'text-orange-400' :
                segment.currentRiskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {segment.currentRiskScore}
              </span>
              <span className="text-slate-500 text-sm">/ 100</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ml-2 text-white ${
                segment.currentRiskScore >= 80 ? 'bg-red-600' :
                segment.currentRiskScore >= 60 ? 'bg-orange-600' :
                segment.currentRiskScore >= 35 ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {segment.riskCategory}
              </span>
            </div>
          </div>

          {/* ASCII / Block Visual Meter Box (as specified in prompt) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2.5 shadow-inner">
            <div className="text-[11px] text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800/80 flex justify-between">
              <span>Feature Sub-Dimension</span>
              <span>Normalized Risk Index</span>
            </div>

            {fingerprintDimensions.map(dim => {
              const blocksCount = Math.round((dim.score / 100) * 10);
              const filledBlocks = '█'.repeat(blocksCount);
              const emptyBlocks = '░'.repeat(10 - blocksCount);
              const colorClass =
                dim.score >= 80 ? 'text-red-400' :
                dim.score >= 60 ? 'text-orange-400' :
                dim.score >= 40 ? 'text-amber-400' : 'text-emerald-400';

              return (
                <div key={dim.label} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{dim.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={colorClass}>{filledBlocks}{emptyBlocks}</span>
                      <span className={`w-8 text-right font-bold ${colorClass}`}>{dim.score}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">{dim.desc}</div>
                </div>
              );
            })}
          </div>

          {/* AI Explainable Summary Narrative */}
          <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Analytical Explanation</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">
              “The predicted risk for road segment {segment.id} is elevated ({segment.currentRiskScore}/100) primarily because of historical accident concentration ({fp.accidentHistory}/100), heavy peak traffic intensity ({fp.traffic}/100), poor nocturnal visibility ({fp.visibility}/100), and recurring severe casualties ({fp.severityPattern}/100) along this road stretch.”
            </p>
            <div className="pt-2 border-t border-indigo-900/50 text-[11px] text-slate-400 flex items-start gap-1.5 font-sans">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Causality Boundary: Factors reflect statistical model weights and correlation vectors, not legally established causation.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Segment Profile & Emergency Access (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Segment Operational Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Segment Road Profile
              </h3>
              <span className="font-mono text-slate-400 text-[11px]">Length: {segment.lengthKm} km</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Road Classification:</span>
                <span className="font-semibold text-white">{segment.roadType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Junction Geometry:</span>
                <span className="font-semibold text-white">{segment.junctionType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Regulatory Speed Limit:</span>
                <span className="font-mono text-indigo-400 font-bold">{segment.speedLimit} km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Carriageway Lanes:</span>
                <span className="font-mono text-white">{segment.lanes} lanes divided</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Peak Risk Time Window:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {segment.peakRiskPeriod}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Historical Incidents:</span>
                <span className="font-mono font-bold text-white">
                  {segment.recentAccidentCount} crashes ({segment.fatalCount} fatal · {segment.severeCount} severe)
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Accessibility Overlay Card */}
          <div className={`rounded-2xl p-5 border shadow-xl text-xs space-y-3 ${
            segment.isHighRiskLimitedEmergency
              ? 'bg-red-950/30 border-red-800/60'
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Ambulance className={`w-4 h-4 ${segment.isHighRiskLimitedEmergency ? 'text-red-400' : 'text-emerald-400'}`} />
                Emergency Accessibility Intelligence
              </h3>
            </div>

            {segment.isHighRiskLimitedEmergency && (
              <div className="py-2 px-3 bg-red-900/40 border border-red-700/60 rounded-lg text-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>CRITICAL: High Risk + Limited Emergency Accessibility</span>
              </div>
            )}

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Access Rating:</span>
                <span className={`font-bold font-mono ${
                  segment.emergencyAccess === 'Critical Delay' ? 'text-red-400' :
                  segment.emergencyAccess === 'Low' ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {segment.emergencyAccess}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance to Trauma Unit:</span>
                <span className="font-mono text-white font-bold">{segment.nearestHospitalDistanceKm} km</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Nearest Trauma Center:</span>
                <span className="text-white font-medium">{segment.nearestTraumaCenter}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              Spatial emergency coverage is derived from road network traversal buffers, peak traffic friction factors, and golden-hour paramedic dispatch radiuses.
            </p>
          </div>

          {/* Preventive Action Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Preventive Countermeasure</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {segment.preventiveAction}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
