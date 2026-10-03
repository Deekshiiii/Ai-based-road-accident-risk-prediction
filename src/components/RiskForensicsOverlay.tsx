import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Activity, 
  CloudRain, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  GitBranch, 
  Sliders, 
  Zap, 
  Layers, 
  ChevronRight,
  TrendingUp,
  FileText,
  RotateCcw,
  CheckCircle2,
  Fingerprint
} from 'lucide-react';
import { HighwayCorridor } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface RiskForensicsOverlayProps {
  highway: HighwayCorridor;
  onClose: () => void;
  onOpenWhatIf: () => void;
  onOpenNearMiss: () => void;
  onOpenIntersection: () => void;
  onOpenDNA: () => void;
  onOpenReplay: () => void;
  onOpenCounterfactual: () => void;
}

export const RiskForensicsOverlay: React.FC<RiskForensicsOverlayProps> = ({
  highway,
  onClose,
  onOpenWhatIf,
  onOpenNearMiss,
  onOpenIntersection,
  onOpenDNA,
  onOpenReplay,
  onOpenCounterfactual
}) => {
  const [activeTab, setActiveTab] = useState<'FORENSICS' | 'CAUSAL_GRAPH' | 'SHAP_EXPLAIN' | 'PREVENTION'>('FORENSICS');

  // 8 Contributing Forensic Dimensions
  const forensicFactors = [
    { name: 'TRAFFIC DENSITY', value: highway.trafficDensityScore, color: '#EF4444', icon: '🚗' },
    { name: 'HISTORICAL ACCIDENTS', value: highway.accidentHistoryScore, color: '#F97316', icon: '💥' },
    { name: 'MONSOON RAIN', value: highway.weatherImpactScore, color: '#38BDF8', icon: '🌧️' },
    { name: 'ROAD CONDITION', value: highway.roadConditionScore, color: '#F59E0B', icon: '🚧' },
    { name: 'OPTICAL VISIBILITY', value: highway.visibilityScore, color: '#A855F7', icon: '👁️' },
    { name: 'CURVE GEOMETRY', value: highway.geometryRiskScore, color: '#EAB308', icon: '↪️' }
  ];

  return (
    <div className="fixed top-16 right-6 bottom-16 w-[440px] max-w-[calc(100vw-3rem)] z-30 pointer-events-auto select-none flex flex-col">
      <div className="bg-[#070B14]/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-2xl flex-1 flex flex-col overflow-hidden font-mono text-slate-200">
        
        {/* Header Strip with Highway Code and Risk Grade */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-extrabold text-white text-sm tracking-wide">
              {highway.code} INVESTIGATION
            </span>
            <span className="text-[10px] text-slate-500 uppercase">{highway.state}</span>
          </div>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Forensics Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 my-3 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-[10px]">
          {(['FORENSICS', 'CAUSAL_GRAPH', 'SHAP_EXPLAIN', 'PREVENTION'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { tacticalAudio.playRadarPing(); setActiveTab(tab); }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                activeTab === tab
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          
          {/* TAB 1: FORENSICS OVERVIEW */}
          {activeTab === 'FORENSICS' && (
            <div className="space-y-4">
              
              {/* Giant Holographic Risk Score Display */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-950/30 via-slate-900/60 to-slate-950/80 border border-red-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Calculated Risk Score</div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-red-400">{highway.riskScore}</span>
                      <span className="text-sm text-slate-500">/ 100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block px-2 py-0.5 rounded bg-red-900/40 border border-red-500/50 text-red-300 font-bold text-[10px] uppercase">
                      {highway.riskCategory} HAZARD
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      CONFIDENCE: <span className="text-emerald-400 font-bold">{highway.confidenceScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Annual Fatalities: <strong className="text-white">{highway.annualFatalities}</strong></span>
                  <span>Near-Miss Conflicts: <strong className="text-amber-400">{highway.nearMissRatePerMonth}/mo</strong></span>
                </div>
              </div>

              {/* Animated Contributing Factor Connections */}
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Contributing Conditions</span>
                  <span className="text-violet-400">Model Weight (%)</span>
                </div>

                {forensicFactors.map(factor => (
                  <div key={factor.name} className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/70 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span>{factor.icon}</span>
                        <span>{factor.name}</span>
                      </span>
                      <span className="font-bold text-white">{factor.value}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700" 
                        style={{ width: `${factor.value}%`, backgroundColor: factor.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Conclusion Text Box */}
              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-violet-200 text-[11px] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-violet-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI FORENSIC VERDICT</span>
                </div>
                High commercial traffic density combined with recent monsoon water-ponding, reduced optical contrast at blind curves, and heavy braking cascade increases rear-end collision probability by <strong className="text-white">3.4×</strong>.
              </div>

            </div>
          )}

          {/* TAB 2: ANIMATED CAUSAL GRAPH (CAUSE -> RISK -> CONSEQUENCE) */}
          {activeTab === 'CAUSAL_GRAPH' && (
            <div className="space-y-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Causal Mechanism (Causal AI DAG)
              </div>

              {/* Step 1: Trigger */}
              <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold text-[9px] uppercase">
                  TRIGGER
                </span>
                <div>
                  <div className="font-bold text-blue-200">{highway.causalChain.trigger}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Atmospheric front moving across Western Ghats corridor</div>
                </div>
              </div>

              <div className="flex justify-center text-slate-600 font-bold">↓</div>

              {/* Step 2: Intermediate Factors */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                  <span className="text-[9px] text-amber-400 uppercase font-bold">FACTOR 1</span>
                  <div className="text-slate-200 mt-0.5">{highway.causalChain.factor1}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                  <span className="text-[9px] text-amber-400 uppercase font-bold">FACTOR 2</span>
                  <div className="text-slate-200 mt-0.5">{highway.causalChain.factor2}</div>
                </div>
              </div>

              <div className="flex justify-center text-slate-600 font-bold">↓</div>

              {/* Step 3: Network Risk */}
              <div className="p-2.5 rounded-xl bg-orange-950/30 border border-orange-500/30 flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-orange-900/60 text-orange-300 font-bold text-[9px] uppercase">
                  DYNAMIC RISK
                </span>
                <div className="text-slate-200 font-semibold">{highway.causalChain.intermediate}</div>
              </div>

              <div className="flex justify-center text-slate-600 font-bold">↓</div>

              {/* Step 4: Collision Consequence */}
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 font-bold text-[9px] uppercase">
                  CONSEQUENCE
                </span>
                <div className="text-red-200 font-bold">{highway.causalChain.consequence}</div>
              </div>
            </div>
          )}

          {/* TAB 3: SHAP-STYLE EXPLAINABILITY WATERFALL */}
          {activeTab === 'SHAP_EXPLAIN' && (
            <div className="space-y-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                SHAP Feature Attributions (Base Value: 42.0)
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Monsoon Precipitation (mm/hr)', impact: +18.4, sign: '+' },
                  { name: 'Freight Truck Saturation Ratio', impact: +14.2, sign: '+' },
                  { name: 'Inadequate Approach Lighting', impact: +11.8, sign: '+' },
                  { name: 'Superelevation Deficit on Curve', impact: +8.6, sign: '+' },
                  { name: 'High Daytime Surface Grip', impact: -6.2, sign: '-' },
                  { name: 'Four-Lane Physical Median Barrier', impact: -8.8, sign: '-' }
                ].map(shap => (
                  <div key={shap.name} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-900/40">
                    <span className="text-slate-300 truncate max-w-[220px]">{shap.name}</span>
                    <span className={`font-bold ${shap.sign === '+' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {shap.sign === '+' ? `+${shap.impact}` : `${shap.impact}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                Model: LightGBM + TreeExplainer · 94.2% test accuracy on MoRTH validated records.
              </div>
            </div>
          )}

          {/* TAB 4: TARGETED PREVENTION RECOMMENDATIONS */}
          {activeTab === 'PREVENTION' && (
            <div className="space-y-2.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                AI Prioritized Prevention Measures
              </div>

              {highway.recommendations.map((rec, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">{rec.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300 font-bold border border-emerald-500/30">
                      -{rec.expectedReductionPct}% RISK
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Priority: <strong className={rec.priority === 'Immediate' ? 'text-red-400' : 'text-amber-400'}>{rec.priority}</strong></span>
                    <span>Est. Cost: <strong className="text-slate-200">₹{rec.costEstimateLakhs} Lakhs</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Interactive Launcher Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-800/80 text-[10px]">
          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenDNA(); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-violet-300 border border-violet-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Fingerprint className="w-3 h-3" />
            <span>RISK DNA</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenWhatIf(); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>WHAT IF?</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenNearMiss(); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Activity className="w-3 h-3" />
            <span>NEAR MISS</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenReplay(); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>REPLAY</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenIntersection(); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-orange-300 border border-orange-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <GitBranch className="w-3 h-3" />
            <span>JUNCTION</span>
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenCounterfactual(); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3" />
            <span>COUNTERFACT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
