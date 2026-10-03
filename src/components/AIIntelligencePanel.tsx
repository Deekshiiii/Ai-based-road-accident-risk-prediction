import React from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { 
  Sparkles, 
  ShieldAlert, 
  Activity, 
  Zap, 
  SlidersHorizontal, 
  CheckCircle2, 
  ChevronRight,
  Info
} from 'lucide-react';

interface AIIntelligencePanelProps {
  segment: RoadSegmentProfile;
  simulatedDelta?: number;
  onOpenExplain?: () => void;
  onOpenSimulate?: () => void;
}

export const AIIntelligencePanel: React.FC<AIIntelligencePanelProps> = ({
  segment,
  simulatedDelta = 0,
  onOpenExplain,
  onOpenSimulate
}) => {
  return (
    <div className="bg-[#1C1E21] text-[#F8F7F4] border border-zinc-800 rounded-xl p-4 shadow-xl space-y-3.5 font-mono text-xs max-w-sm w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-bold tracking-wider uppercase text-zinc-200">AI INTELLIGENCE</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">LIVE DOSSIER</span>
      </div>

      {/* Current Road Identity & Risk */}
      <div className="space-y-1">
        <div className="text-[10px] text-zinc-400 uppercase tracking-wider">CURRENT ROAD</div>
        <div className="flex items-baseline justify-between">
          <div className="font-bold text-white text-sm">{segment.id}</div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 text-[11px]">Risk:</span>
            <span className={`text-base font-black ${
              segment.currentRiskScore >= 80 ? 'text-[#DC2626]' :
              segment.currentRiskScore >= 60 ? 'text-[#F97316]' : 'text-amber-400'
            }`}>
              {segment.currentRiskScore}
            </span>
            <span className="text-[10px] text-zinc-400">/ 100</span>
          </div>
        </div>
        <div className="text-[11px] text-zinc-400">
          Status: <strong className="text-white uppercase">{segment.riskCategory} RISK</strong>
        </div>
      </div>

      {/* WHY? Feature Drivers */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-1">
        <div className="text-[10px] text-violet-400 uppercase font-bold flex items-center justify-between">
          <span>WHY? (TOP MODEL FACTORS)</span>
          {onOpenExplain && (
            <button
              onClick={onOpenExplain}
              className="text-[9px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              DETAILS &rarr;
            </button>
          )}
        </div>
        <ul className="text-zinc-300 space-y-0.5 font-sans text-[11px]">
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-violet-400"></span>
            <span>Historical accident concentration ({segment.fingerprint.accidentHistory}/100)</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-violet-400"></span>
            <span>Peak traffic volume approaching capacity ({segment.fingerprint.traffic}/100)</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-violet-400"></span>
            <span>Geometric ramp & sightline friction ({segment.fingerprint.infrastructure}/100)</span>
          </li>
        </ul>
      </div>

      {/* PATTERN */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
        <div className="text-[10px] text-amber-400 uppercase font-bold">PATTERN</div>
        <div className="text-zinc-300 font-sans text-[11px]">
          Evening commute risk concentration ({segment.peakRiskPeriod})
        </div>
      </div>

      {/* SIMULATION DELTA */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
        <div className="text-[10px] text-zinc-400 uppercase font-bold flex justify-between">
          <span>SIMULATION LAB</span>
          {onOpenSimulate && (
            <button
              onClick={onOpenSimulate}
              className="text-[9px] text-violet-400 hover:text-violet-300 cursor-pointer"
            >
              SIMULATE &rarr;
            </button>
          )}
        </div>
        <div className="text-zinc-300 font-sans text-[11px]">
          {simulatedDelta !== 0 ? (
            <span className={simulatedDelta > 0 ? 'text-coral-400 font-bold' : 'text-emerald-400 font-bold'}>
              {simulatedDelta > 0 ? `+${simulatedDelta}` : simulatedDelta} risk delta under current simulated scenario
            </span>
          ) : (
            <span>Base model calibrated; test rain or speed calm in Scenario Lab</span>
          )}
        </div>
      </div>

      {/* ACTION */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
        <div className="text-[10px] text-emerald-400 uppercase font-bold">PREVENTIVE ACTION</div>
        <div className="text-zinc-300 font-sans text-[11px] leading-tight">
          {segment.preventiveAction}
        </div>
      </div>

    </div>
  );
};
