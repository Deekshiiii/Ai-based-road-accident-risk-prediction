import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  GitBranch, 
  Check, 
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { HighwayCorridor } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface WhatIfSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  highway: HighwayCorridor;
  onApplyScenario: (delta: number, isPropagating: boolean) => void;
}

export const WhatIfSimulationModal: React.FC<WhatIfSimulationModalProps> = ({
  isOpen,
  onClose,
  highway,
  onApplyScenario
}) => {
  if (!isOpen) return null;

  // Simulation Controls
  const [trafficDeltaPct, setTrafficDeltaPct] = useState<number>(20); // +20%
  const [rainfallDeltaPct, setRainfallDeltaPct] = useState<number>(40); // +40%
  const [visibilityReductionPct, setVisibilityReductionPct] = useState<number>(30); // -30%
  const [isRoadClosureActive, setIsRoadClosureActive] = useState<boolean>(false);
  const [isNightLightingActive, setIsNightLightingActive] = useState<boolean>(false);
  const [isEmergencyPatrolBoost, setIsEmergencyPatrolBoost] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Compute Simulated Risk
  const baseRisk = highway.riskScore; // e.g. 78
  let calculatedDelta = 
    Math.round(trafficDeltaPct * 0.28) + 
    Math.round(rainfallDeltaPct * 0.22) + 
    Math.round(visibilityReductionPct * 0.20) + 
    (isRoadClosureActive ? 18 : 0) - 
    (isNightLightingActive ? 10 : 0) - 
    (isEmergencyPatrolBoost ? 8 : 0);

  const simulatedRisk = Math.min(99, Math.max(15, baseRisk + calculatedDelta));
  const finalDelta = simulatedRisk - baseRisk;

  const handleRunSimulation = () => {
    tacticalAudio.playRadarPing();
    setIsSimulated(true);
    onApplyScenario(finalDelta, true);
  };

  const handleReset = () => {
    tacticalAudio.playRadarPing();
    setTrafficDeltaPct(0);
    setRainfallDeltaPct(0);
    setVisibilityReductionPct(0);
    setIsRoadClosureActive(false);
    setIsNightLightingActive(false);
    setIsEmergencyPatrolBoost(false);
    setIsSimulated(false);
    onApplyScenario(0, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-amber-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-amber-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Sliders className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>WHAT-IF DIGITAL TWIN SIMULATOR</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-500/30 font-bold">
                  EXPERIMENTAL
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Target Corridor: <strong className="text-white">{highway.code} ({highway.name})</strong>
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

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Traffic Density Slider */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-bold">TRAFFIC DENSITY</span>
                <span className="text-amber-400 font-black">+{trafficDeltaPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={trafficDeltaPct}
                onChange={(e) => {
                  setTrafficDeltaPct(Number(e.target.value));
                  setIsSimulated(false);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[9px] text-slate-500">Peak hour freight + commuter surge</div>
            </div>

            {/* Rainfall Volume Slider */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-bold">MONSOON RAIN</span>
                <span className="text-blue-400 font-black">+{rainfallDeltaPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="10"
                value={rainfallDeltaPct}
                onChange={(e) => {
                  setRainfallDeltaPct(Number(e.target.value));
                  setIsSimulated(false);
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="text-[9px] text-slate-500">Hydroplaning & road friction degradation</div>
            </div>

            {/* Visibility Reduction Slider */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-bold">VISIBILITY DROP</span>
                <span className="text-purple-400 font-black">-{visibilityReductionPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={visibilityReductionPct}
                onChange={(e) => {
                  setVisibilityReductionPct(Number(e.target.value));
                  setIsSimulated(false);
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="text-[9px] text-slate-500">Atmospheric mist, fog and headlight glare</div>
            </div>

          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <button
              onClick={() => { setIsRoadClosureActive(!isRoadClosureActive); setIsSimulated(false); }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isRoadClosureActive 
                  ? 'bg-red-950/60 border-red-500 text-white' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>1-Lane Construction Closure</span>
              <span className="font-bold">{isRoadClosureActive ? 'ON (+18)' : 'OFF'}</span>
            </button>

            <button
              onClick={() => { setIsNightLightingActive(!isNightLightingActive); setIsSimulated(false); }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isNightLightingActive 
                  ? 'bg-emerald-950/60 border-emerald-500 text-white' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>High-Mast LED Lighting</span>
              <span className="font-bold">{isNightLightingActive ? 'ACTIVE (-10)' : 'OFF'}</span>
            </button>

            <button
              onClick={() => { setIsEmergencyPatrolBoost(!isEmergencyPatrolBoost); setIsSimulated(false); }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isEmergencyPatrolBoost 
                  ? 'bg-emerald-950/60 border-emerald-500 text-white' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>Dedicated Highway Patrol</span>
              <span className="font-bold">{isEmergencyPatrolBoost ? 'DEPLOYED (-8)' : 'OFF'}</span>
            </button>
          </div>

          {/* Simulation Output Banner */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Before vs After Score */}
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Baseline Risk</div>
                <div className="text-2xl font-black text-slate-300">{baseRisk} / 100</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600" />

              <div>
                <div className="text-[10px] text-amber-400 uppercase">Simulated Risk</div>
                <div className={`text-3xl font-black ${simulatedRisk >= 80 ? 'text-red-400' : 'text-amber-400'}`}>
                  {simulatedRisk} / 100
                </div>
              </div>

              <div className="pl-4 border-l border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Risk Change</div>
                <div className={`text-xl font-extrabold ${finalDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {finalDelta > 0 ? `+${finalDelta}` : `${finalDelta}`}
                </div>
              </div>
            </div>

            {/* Run Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleRunSimulation}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer shadow-lg shadow-amber-900/30 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN SIMULATION</span>
              </button>
            </div>

          </div>

          {/* Risk Propagation & Causal Explanation */}
          {isSimulated && (
            <div className="space-y-3 p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 text-violet-200">
              <div className="flex items-center gap-2 font-bold text-violet-300">
                <GitBranch className="w-4 h-4 text-violet-400" />
                <span>RISK PROPAGATION CASCADE TRIGGERED</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Elevating commercial traffic by +{trafficDeltaPct}% with +{rainfallDeltaPct}% monsoon rainfall triggers primary congestion at Namakkal S-Bend, propagating secondary spillover delays into connected state highways (SH-79 & SH-95). Secondary risk radius expands by <strong className="text-white">18.4 km</strong>.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
