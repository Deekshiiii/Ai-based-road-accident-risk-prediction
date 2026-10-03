import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  TrendingDown, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Scale, 
  ArrowRight
} from 'lucide-react';
import { HighwayCorridor } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface CounterfactualEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  highway: HighwayCorridor;
}

export const CounterfactualEngineModal: React.FC<CounterfactualEngineModalProps> = ({
  isOpen,
  onClose,
  highway
}) => {
  if (!isOpen) return null;

  const [selectedInterventionIdx, setSelectedInterventionIdx] = useState<number>(0);

  const baselineRisk = highway.riskScore; // e.g. 78 or 84

  const interventions = [
    {
      id: 'inv-1',
      title: 'Porous Asphalt Resurfacing & Rutting Repair',
      category: 'Infrastructure',
      newRiskScore: Math.max(20, baselineRisk - 16),
      delta: -16,
      costLakhs: 48,
      leadTimeWeeks: 6,
      causalMechanism: 'Increases wet pavement skid resistance and eliminates water ponding at curve apex.',
      confidence: 93.4
    },
    {
      id: 'inv-2',
      title: 'Variable Speed Limit Enforcement (90 → 65 km/h)',
      category: 'Speed Management',
      newRiskScore: Math.max(20, baselineRisk - 13),
      delta: -13,
      costLakhs: 18,
      leadTimeWeeks: 2,
      causalMechanism: 'Reduces kinetic impact energy by 48% and expands emergency reaction buffer for following vehicles.',
      confidence: 95.8
    },
    {
      id: 'inv-3',
      title: 'Continuous High-Mast LED Lighting & Optical Studs',
      category: 'Visibility',
      newRiskScore: Math.max(20, baselineRisk - 9),
      delta: -9,
      costLakhs: 24,
      leadTimeWeeks: 4,
      causalMechanism: 'Elevates nighttime target recognition distance from 95m to 280m, preventing unlit rear-end crashes.',
      confidence: 91.2
    },
    {
      id: 'inv-4',
      title: 'Freight Lane Separation & Crossover Barrier Barricade',
      category: 'Traffic Control',
      newRiskScore: Math.max(20, baselineRisk - 11),
      delta: -11,
      costLakhs: 32,
      leadTimeWeeks: 3,
      causalMechanism: 'Segregates slow freight lorries from light passenger vehicles and eliminates illegal U-turns.',
      confidence: 89.5
    },
    {
      id: 'inv-5',
      title: 'Smart Adaptive Traffic Signal Synchronization',
      category: 'Signal Timing',
      newRiskScore: Math.max(20, baselineRisk - 7),
      delta: -7,
      costLakhs: 15,
      leadTimeWeeks: 3,
      causalMechanism: 'Smooths arrival platoons, reducing queue formation at approach bottlenecks.',
      confidence: 92.0
    }
  ];

  const activeIntervention = interventions[selectedInterventionIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-emerald-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>AI COUNTERFACTUAL ENGINE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-bold">
                  SIMULATION
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                “What single change reduces risk the most on {highway.code}?”
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
          
          {/* Active Comparison Bar */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Current Risk</div>
              <div className="text-3xl font-black text-red-400">{baselineRisk} / 100</div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600" />

            <div>
              <div className="text-[10px] text-emerald-400 uppercase">Counterfactual Risk</div>
              <div className="text-3xl font-black text-emerald-400">{activeIntervention.newRiskScore} / 100</div>
            </div>

            <div className="text-right pl-4 border-l border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Impact Delta</div>
              <div className="text-2xl font-black text-emerald-400">{activeIntervention.delta} PTS</div>
            </div>
          </div>

          {/* Intervention Selection List */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Candidate Interventions Ranked by Impact</span>
              <span className="text-emerald-400">Click to Inspect</span>
            </div>

            {interventions.map((inv, idx) => {
              const isSel = selectedInterventionIdx === idx;
              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    tacticalAudio.playRadarPing();
                    setSelectedInterventionIdx(idx);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-md'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{inv.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{inv.causalMechanism}</div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <span className="text-xs font-black text-emerald-400">{inv.delta} PTS</span>
                      <div className="text-[9px] text-slate-500">₹{inv.costLakhs}L · {inv.leadTimeWeeks}wks</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Policy Recommendation Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] leading-relaxed text-slate-300">
            <span className="font-bold text-white">AI Policy Verdict: </span>
            The highest single return on investment is achieved via <strong className="text-emerald-300">{interventions[0].title}</strong>, offering a 16-point safety enhancement within 6 weeks of civil deployment.
          </div>

        </div>

      </div>
    </div>
  );
};
