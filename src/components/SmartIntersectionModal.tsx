import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Sliders, 
  Check, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  Activity, 
  TrendingDown,
  Clock
} from 'lucide-react';
import { HighwayCorridor } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface SmartIntersectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  highway: HighwayCorridor;
}

export const SmartIntersectionModal: React.FC<SmartIntersectionModalProps> = ({
  isOpen,
  onClose,
  highway
}) => {
  if (!isOpen) return null;

  // Signal Timing Control
  const [mainGreenSec, setMainGreenSec] = useState<number>(45);
  const [crossGreenSec, setCrossGreenSec] = useState<number>(25);
  const [allRedClearanceSec, setAllRedClearanceSec] = useState<number>(3);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Baseline metrics
  const baseConflictRisk = 81;
  const basePedestrianRisk = 72;
  const baseTrafficPressure = 88;

  // Simulated metrics based on timing adjustments
  const conflictReduction = Math.round((mainGreenSec - 45) * 0.4 + (allRedClearanceSec - 3) * 3.5);
  const simulatedConflict = Math.max(25, baseConflictRisk - conflictReduction);

  const pedestrianReduction = Math.round((allRedClearanceSec - 3) * 4.2 + (crossGreenSec - 25) * 0.3);
  const simulatedPedestrian = Math.max(20, basePedestrianRisk - pedestrianReduction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-orange-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-orange-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-300">
              <GitBranch className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>SMART INTERSECTION INTELLIGENCE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-900/60 text-orange-300 border border-orange-500/30 font-bold">
                  SIGNAL TIMING
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Junction Analysis: {highway.origin} Approach Merge
              </div>
            </div>
          </div>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Current Intersection Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Conflict Risk</div>
              <div className="text-2xl font-black text-red-400 mt-1">
                {isSimulated ? simulatedConflict : baseConflictRisk}
                <span className="text-xs text-slate-500"> / 100</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-1">Cross-traffic angle collisions</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Pedestrian Risk</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {isSimulated ? simulatedPedestrian : basePedestrianRisk}
                <span className="text-xs text-slate-500"> / 100</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-1">Crossing exposure without refuge</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Traffic Pressure</div>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {baseTrafficPressure}
                <span className="text-xs text-slate-500"> / 100</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-1">Queue spillover to upstream lanes</div>
            </div>
          </div>

          {/* Signal Timing Sliders */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-[10px] text-orange-400 uppercase tracking-wider font-bold">
              Simulate Adaptive Signal Timing Parameters
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Main Highway Green Phase</span>
                  <span className="text-white font-bold">{mainGreenSec} seconds</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={mainGreenSec}
                  onChange={(e) => {
                    setMainGreenSec(Number(e.target.value));
                    setIsSimulated(true);
                  }}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Cross-Street Green Phase</span>
                  <span className="text-white font-bold">{crossGreenSec} seconds</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={crossGreenSec}
                  onChange={(e) => {
                    setCrossGreenSec(Number(e.target.value));
                    setIsSimulated(true);
                  }}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-300">All-Red Safety Clearance Interval</span>
                  <span className="text-white font-bold">{allRedClearanceSec} seconds</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={allRedClearanceSec}
                  onChange={(e) => {
                    setAllRedClearanceSec(Number(e.target.value));
                    setIsSimulated(true);
                  }}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Outcome Summary */}
          {isSimulated && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-[11px] leading-relaxed">
              <span className="font-bold text-emerald-300">Optimization Verdict: </span>
              Expanding the All-Red clearance interval to {allRedClearanceSec}s and coordinating the main green phase yields a <strong className="text-white">-{conflictReduction} point reduction</strong> in high-speed junction intersection conflict risk.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
