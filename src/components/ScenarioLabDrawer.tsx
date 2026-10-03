import React, { useState } from 'react';
import { X, Sliders, Play, RotateCcw, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { RoadSegmentProfile } from '../types/accident';
import { tacticalAudio } from '../services/tacticalAudio';

interface ScenarioLabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegmentProfile;
  onApplyScenario: (delta: number, active: boolean) => void;
}

export const ScenarioLabDrawer: React.FC<ScenarioLabDrawerProps> = ({
  isOpen,
  onClose,
  selectedRoad,
  onApplyScenario
}) => {
  if (!isOpen) return null;

  // Scenario variables
  const [trafficVal, setTrafficVal] = useState<number>(75); // 0 to 100
  const [rainVal, setRainVal] = useState<number>(65); // 0 to 100
  const [visibilityVal, setVisibilityVal] = useState<number>(35); // 0 to 100
  const [roadClosure, setRoadClosure] = useState<boolean>(false);
  const [laneReduction, setLaneReduction] = useState<boolean>(true);
  const [streetLighting, setStreetLighting] = useState<boolean>(false);
  const [emergencyPriority, setEmergencyPriority] = useState<boolean>(false);

  // Compute delta
  const baseRisk = selectedRoad.currentRiskScore;
  let simulatedRisk = baseRisk;

  // Traffic delta
  simulatedRisk += Math.round((trafficVal - 50) * 0.15);
  // Rain delta
  simulatedRisk += Math.round((rainVal - 30) * 0.12);
  // Visibility delta (lower visibility = higher risk)
  simulatedRisk += Math.round((50 - visibilityVal) * 0.14);
  // Booleans
  if (roadClosure) simulatedRisk += 14;
  if (laneReduction) simulatedRisk += 8;
  if (!streetLighting) simulatedRisk += 9;
  if (emergencyPriority) simulatedRisk -= 7;

  simulatedRisk = Math.min(99, Math.max(15, simulatedRisk));
  const riskDelta = simulatedRisk - baseRisk;

  const handleApply = () => {
    tacticalAudio.playRadarPing();
    onApplyScenario(riskDelta, true);
  };

  const handleReset = () => {
    setTrafficVal(50);
    setRainVal(20);
    setVisibilityVal(70);
    setRoadClosure(false);
    setLaneReduction(false);
    setStreetLighting(true);
    setEmergencyPriority(false);
    onApplyScenario(0, false);
    tacticalAudio.playTick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  ROAD SCENARIO LAB — COUNTERFACTUAL TWIN
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-bold">
                  {selectedRoad.id}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                Manipulate ambient conditions and observe citywide risk shift in real time
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-down Comparison Box per Prompt Spec */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">CURRENT RISK</span>
            <div className="text-3xl font-black text-slate-200 mt-0.5 font-mono">{baseRisk}</div>
            <span className="text-[9px] text-slate-500">BASE MODEL</span>
          </div>

          <div className="border-x border-slate-800 flex flex-col justify-center items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">RISK CHANGE</span>
            <div className={`text-2xl font-black font-mono mt-0.5 ${riskDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {riskDelta > 0 ? `+${riskDelta}` : riskDelta}
            </div>
            <span className={`text-[9px] font-bold uppercase ${riskDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {riskDelta > 0 ? 'RISK SURGE' : 'RISK REDUCTION'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">SIMULATED RISK</span>
            <div className="text-3xl font-black text-amber-400 mt-0.5 font-mono">{simulatedRisk}</div>
            <span className="text-[9px] text-amber-400/80">PREDICTED OUTCOME</span>
          </div>
        </div>

        {/* Causal Explanation Text */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-sans text-slate-300">
          <strong className="text-white font-mono uppercase text-[10px] block mb-0.5">AI SCENARIO DIAGNOSTIC:</strong>
          “Higher traffic combined with reduced visibility increases intersection conflict probability by {Math.abs(riskDelta)} points.”
        </div>

        {/* Sliders Matrix */}
        <div className="space-y-4">
          
          {/* Traffic */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Traffic Volume</span>
              <span className="text-amber-400 font-bold">{trafficVal}% capacity</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={trafficVal}
              onChange={e => { tacticalAudio.playTick(); setTrafficVal(parseInt(e.target.value)); }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Rain */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Precipitation / Rain Rate</span>
              <span className="text-blue-400 font-bold">{rainVal}% downpour</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainVal}
              onChange={e => { tacticalAudio.playTick(); setRainVal(parseInt(e.target.value)); }}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Atmospheric Photopic Visibility</span>
              <span className="text-violet-400 font-bold">{visibilityVal}% visual range</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={visibilityVal}
              onChange={e => { tacticalAudio.playTick(); setVisibilityVal(parseInt(e.target.value)); }}
              className="w-full accent-violet-500 cursor-pointer"
            />
          </div>

          {/* Boolean Toggles Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => { tacticalAudio.playTick(); setRoadClosure(!roadClosure); }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                roadClosure ? 'bg-red-950/60 border-red-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[11px] font-bold">Road Closure</div>
              <div className="text-[10px] font-mono mt-0.5">{roadClosure ? 'STATUS: CLOSED' : 'STATUS: OPEN'}</div>
            </button>

            <button
              onClick={() => { tacticalAudio.playTick(); setLaneReduction(!laneReduction); }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                laneReduction ? 'bg-amber-950/60 border-amber-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[11px] font-bold">Lane Reduction Workzone</div>
              <div className="text-[10px] font-mono mt-0.5">{laneReduction ? 'STATUS: -2 LANES' : 'STATUS: ALL OPEN'}</div>
            </button>

            <button
              onClick={() => { tacticalAudio.playTick(); setStreetLighting(!streetLighting); }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                streetLighting ? 'bg-violet-950/60 border-violet-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[11px] font-bold">Smart Street Lighting</div>
              <div className="text-[10px] font-mono mt-0.5">{streetLighting ? 'STATUS: ACTIVE (100%)' : 'STATUS: OUTAGE'}</div>
            </button>

            <button
              onClick={() => { tacticalAudio.playTick(); setEmergencyPriority(!emergencyPriority); }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                emergencyPriority ? 'bg-emerald-950/60 border-emerald-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[11px] font-bold">Emergency Signal Priority</div>
              <div className="text-[10px] font-mono mt-0.5">{emergencyPriority ? 'STATUS: GREEN CORRIDOR' : 'STATUS: NORMAL'}</div>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Apply to 3D City</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
