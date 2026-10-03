import React from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS, DETECTED_PATTERNS } from '../data/roadGuardData';
import { CheckCircle2, ShieldAlert, Sparkles, ArrowDown, Info, AlertTriangle, Layers } from 'lucide-react';

interface PreventModuleProps {
  selectedRoad: RoadSegmentProfile;
}

export const PreventModule: React.FC<PreventModuleProps> = ({ selectedRoad }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-[#E6E3DC] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
            STAGE 5: PREVENT
          </span>
          <h2 className="text-xl font-black text-[#1C1E21] uppercase tracking-tight mt-1">
            AI Preventive Intelligence & Actionable Policy
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Converting detected high-risk multivariate patterns directly into grounded civil and traffic engineering countermeasures.
          </p>
        </div>
      </div>

      {/* Featured Primary Transformation Box (Per prompt specification) */}
      <div className="bg-white border border-[#E6E3DC] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="text-xs font-mono font-bold text-zinc-500 uppercase pb-2 border-b border-[#E6E3DC] flex justify-between">
          <span>PATTERN-TO-PREVENTION PIPELINE</span>
          <span>CORRIDOR: {selectedRoad.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Detected Risk Pattern */}
          <div className="md:col-span-5 bg-[#F8F7F4] border border-[#E6E3DC] rounded-xl p-5 space-y-3 font-mono">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
              DETECTED RISK PATTERN
            </span>
            <div className="space-y-1.5 text-xs text-zinc-800">
              <div className="p-2 bg-white rounded border border-[#E6E3DC] font-semibold">
                High peak traffic volume ({selectedRoad.fingerprint.traffic}/100)
              </div>
              <div className="text-center font-bold text-zinc-400">+</div>
              <div className="p-2 bg-white rounded border border-[#E6E3DC] font-semibold">
                Poor nocturnal visibility & street lux deficit
              </div>
              <div className="text-center font-bold text-zinc-400">+</div>
              <div className="p-2 bg-white rounded border border-[#E6E3DC] font-semibold">
                Historical severe & fatal casualty concentration
              </div>
            </div>
          </div>

          {/* Center: Transformation Vector */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono font-bold text-violet-700 uppercase">AI SYNTHESIS</span>
            <ArrowDown className="w-6 h-6 text-violet-600 my-1 hidden md:block rotate-[-90deg]" />
            <ArrowDown className="w-6 h-6 text-violet-600 my-1 md:hidden" />
            <span className="text-[9px] font-mono text-zinc-400">GROUNDED INSIGHT</span>
          </div>

          {/* Right: AI Preventive Insight */}
          <div className="md:col-span-5 bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-3">
            <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              AI PREVENTIVE INSIGHT
            </span>

            <p className="text-xs text-zinc-800 leading-relaxed font-sans font-medium">
              “Review lighting, signage, traffic-management measures and visibility conditions for this road segment.”
            </p>

            <div className="space-y-1.5 pt-2 border-t border-emerald-200/80 text-[11px] text-zinc-700 font-sans">
              <div>1. <strong>Lighting Infrastructure:</strong> Retrofit high-lux smart LED street luminaires along approaches.</div>
              <div>2. <strong>Speed Calming:</strong> Enforce automated radar speed cap during {selectedRoad.peakRiskPeriod}.</div>
              <div>3. <strong>VMS Signage:</strong> Deploy dynamic variable message signs to mandate lane discipline.</div>
            </div>
          </div>

        </div>
      </div>

      {/* Multi-Corridor Evidence-Based Countermeasure Catalog */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase text-zinc-700 tracking-wider">
          ACTIVE SYSTEMIC PREVENTIVE ACTION CATALOG ({ROAD_SEGMENTS.length} MONITORED ROADS)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {ROAD_SEGMENTS.slice(0, 6).map(seg => (
            <div key={seg.id} className="bg-white border border-[#E6E3DC] rounded-xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#E6E3DC]">
                <span className="font-mono font-bold text-violet-700">{seg.id}</span>
                <span className="text-zinc-500 font-mono text-[10px]">{seg.roadType}</span>
              </div>
              <h4 className="font-bold text-zinc-900 text-xs">{seg.name}</h4>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                {seg.preventiveAction}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-white border border-[#E6E3DC] rounded-lg text-[10px] text-zinc-500 font-sans italic flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
        <span>Evidence-Based Policy Notice: Recommendations are analytical AI decision-support suggestions; statutory municipal deployment requires validation against local traffic engineering manuals and environmental clearance guidelines.</span>
      </div>

    </div>
  );
};
