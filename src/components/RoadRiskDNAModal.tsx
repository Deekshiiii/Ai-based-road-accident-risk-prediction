import React from 'react';
import { X, Sparkles, ShieldAlert, Activity, CheckCircle2, ChevronRight, Fingerprint } from 'lucide-react';
import { RoadSegmentProfile } from '../types/accident';
import { HighwayCorridor } from '../data/indiaDigitalTwinData';

interface RoadRiskDNAModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegmentProfile | HighwayCorridor;
}

export const RoadRiskDNAModal: React.FC<RoadRiskDNAModalProps> = ({
  isOpen,
  onClose,
  selectedRoad
}) => {
  if (!isOpen) return null;

  // Normalized properties
  const isHighway = 'code' in selectedRoad;
  const roadId = isHighway ? selectedRoad.code : selectedRoad.id;
  const roadName = selectedRoad.name;
  const corridorSubtitle = isHighway ? `${selectedRoad.state} · ${selectedRoad.region}` : selectedRoad.corridor;
  const riskScore = isHighway ? selectedRoad.riskScore : selectedRoad.currentRiskScore;
  const riskCategory = isHighway ? selectedRoad.riskCategory : selectedRoad.riskCategory;
  const primaryHazard = isHighway ? selectedRoad.causalChain.consequence : selectedRoad.primaryHazard;
  const preventiveAction = isHighway 
    ? (selectedRoad.recommendations[0]?.action || 'Deploy speed radar enforcement and high-friction surfacing.') 
    : selectedRoad.preventiveAction;

  // 8 Parameters arranged around the holographic circle
  const parameters = isHighway ? [
    { label: 'ACCIDENT HISTORY', score: selectedRoad.accidentHistoryScore, sub: `${selectedRoad.annualFatalities} Annual Fatalities`, color: '#EF4444' },
    { label: 'TRAFFIC DENSITY', score: selectedRoad.trafficDensityScore, sub: `${selectedRoad.lanes} Lanes · ${selectedRoad.speedLimitKmh} km/h`, color: '#F97316' },
    { label: 'WEATHER IMPACT', score: selectedRoad.weatherImpactScore, sub: 'Monsoon Front Sensitivity', color: '#38BDF8' },
    { label: 'VISIBILITY DEFICIT', score: selectedRoad.visibilityScore, sub: 'Nocturnal Illumination Gap', color: '#A855F7' },
    { label: 'ROAD CONDITION', score: selectedRoad.roadConditionScore, sub: 'Surface Friction Degradation', color: '#EAB308' },
    { label: 'GEOMETRY & WEAVE', score: selectedRoad.geometryRiskScore, sub: 'Curvature & Superelevation', color: '#EC4899' },
    { label: 'NEAR-MISS CONFLICT', score: Math.min(99, selectedRoad.nearMissRatePerMonth * 1.2), sub: `${selectedRoad.nearMissRatePerMonth} conflicts / month`, color: '#DC2626' },
    { label: 'EMERGENCY ACCESS', score: 82, sub: 'Level-1 Trauma within 6.4m', color: '#10B981' }
  ] : [
    { label: 'ACCIDENT HISTORY', score: selectedRoad.fingerprint.accidentHistory, sub: `${selectedRoad.recentAccidentCount} crashes / 3yr`, color: '#EF4444' },
    { label: 'TRAFFIC DENSITY', score: selectedRoad.fingerprint.traffic, sub: `${selectedRoad.trafficRisk} Saturation`, color: '#F97316' },
    { label: 'WEATHER IMPACT', score: selectedRoad.fingerprint.weather, sub: `${selectedRoad.weatherRisk} Vulnerability`, color: '#38BDF8' },
    { label: 'VISIBILITY DEFICIT', score: selectedRoad.fingerprint.visibility, sub: 'Nocturnal Illumination Gap', color: '#A855F7' },
    { label: 'ROAD CONDITION', score: 74, sub: 'Pavement Friction 0.42', color: '#EAB308' },
    { label: 'GEOMETRY & WEAVE', score: selectedRoad.fingerprint.infrastructure, sub: `${selectedRoad.junctionType}`, color: '#EC4899' },
    { label: 'SEVERITY PATTERN', score: selectedRoad.fingerprint.severityPattern, sub: `${selectedRoad.fatalCount} Fatalities Recorded`, color: '#DC2626' },
    { label: 'EMERGENCY ACCESS', score: selectedRoad.isHighRiskLimitedEmergency ? 88 : 42, sub: `${selectedRoad.nearestHospitalDistanceKm}km to Trauma Center`, color: '#10B981' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-900/60 border border-violet-500/40 text-violet-300 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  ROAD RISK DNA — HOLOGRAPHIC FINGERPRINT
                </span>
                <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-700/60 px-2 py-0.5 rounded font-bold">
                  {roadId}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">{roadName} ({corridorSubtitle})</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Circular Holographic Visualization & Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Holographic Center Radial Disk (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl relative">
            
            {/* Outer Rotating Glow Orbit */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-violet-500/30 border-dashed animate-spin" style={{ animationDuration: '24s' }} />
              <div className="absolute inset-4 rounded-full border border-slate-700/60" />
              <div className="absolute inset-8 rounded-full border border-violet-400/20" />

              {/* Center Risk Index Badge */}
              <div className="w-36 h-36 rounded-full bg-slate-900 border-2 border-violet-500/80 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex flex-col items-center justify-center text-center p-2 z-10">
                <span className="text-[9px] text-slate-400 tracking-widest uppercase">RISK INDEX</span>
                <div className="text-4xl font-black text-white font-mono leading-none my-1">
                  {riskScore}
                </div>
                <span className="text-[10px] text-zinc-400">/ 100</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 ${
                  riskScore >= 80 ? 'bg-red-950 text-red-400' :
                  riskScore >= 60 ? 'bg-orange-950 text-orange-400' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  {riskCategory.toUpperCase()} RISK
                </span>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-slate-400 font-sans">
              Primary Hazard: <strong className="text-amber-300 font-mono">{primaryHazard}</strong>
            </div>
          </div>

          {/* 8 Parameters Side Breakdown (6 cols) */}
          <div className="lg:col-span-6 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              8-DIMENSIONAL RISK PROFILE BREAKDOWN
            </span>

            <div className="grid grid-cols-1 gap-2">
              {parameters.map(param => (
                <div key={param.label} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200">{param.label}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{param.sub}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${param.score}%`, backgroundColor: param.color }}
                      />
                    </div>
                    <span className="font-bold w-7 text-right" style={{ color: param.color }}>
                      {param.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Preventive Advisory */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-violet-400 font-bold uppercase text-[10px]">AI RECOMMENDED MITIGATION</span>
            <p className="text-slate-300 font-sans text-xs">{preventiveAction}</p>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
          >
            Confirm & Close
          </button>
        </div>

      </div>
    </div>
  );
};
