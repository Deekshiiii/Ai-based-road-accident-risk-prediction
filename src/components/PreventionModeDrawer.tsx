import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Sparkles, Lightbulb, TrafficCone, Compass, Ambulance, AlertCircle } from 'lucide-react';
import { PREVENTION_INTERVENTIONS } from '../data/digitalTwinCityData';
import { Intervention3D } from '../types/accident';
import { tacticalAudio } from '../services/tacticalAudio';

interface PreventionModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isPreventionActive: boolean;
  onTogglePrevention: () => void;
}

export const PreventionModeDrawer: React.FC<PreventionModeDrawerProps> = ({
  isOpen,
  onClose,
  isPreventionActive,
  onTogglePrevention
}) => {
  const [interventions, setInterventions] = useState<Intervention3D[]>(PREVENTION_INTERVENTIONS);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    tacticalAudio.playTick();
    setInterventions(prev => prev.map(inv => inv.id === id ? { ...inv, active: !inv.active } : inv));
  };

  const totalReduction = interventions
    .filter(inv => isPreventionActive ? true : inv.active)
    .reduce((sum, inv) => sum + inv.riskReductionPct, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  AI PREVENTION MODE — GROUNDED INTERVENTIONS
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  isPreventionActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isPreventionActive ? 'ACTIVE ON 3D CITY' : 'STANDBY'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                Places engineering and civil countermeasures directly onto 3D digital twin
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

        {/* Master Activation Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Full Citywide Countermeasure Deployment</span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Activates high-friction surfacing, adaptive signals, and smart lighting icons directly onto the 3D road canvas.
            </p>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              onTogglePrevention();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer whitespace-nowrap ${
              isPreventionActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-700/50'
            }`}
          >
            {isPreventionActive ? 'DISABLE PREVENTION OVERLAYS' : 'ACTIVATE ALL INTERVENTIONS'}
          </button>
        </div>

        {/* Catalog of Interventions */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
            LOCATION-SPECIFIC CIVIL COUNTERMEASURES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interventions.map(inv => (
              <div
                key={inv.id}
                onClick={() => toggleItem(inv.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  inv.active || isPreventionActive
                    ? 'bg-slate-900 border-emerald-500/70 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800/80 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{inv.icon}</span>
                    <div>
                      <div className="font-bold text-white text-xs leading-tight">{inv.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.locationLabel}</div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    inv.priority === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800/50' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {inv.priority} PRIORITY
                  </span>
                </div>

                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  {inv.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Estimated Risk Reduction:</span>
                  <strong className="text-emerald-400 font-bold font-mono">−{inv.riskReductionPct}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-sans">
            Total Combined Impact: <strong className="text-emerald-400 font-mono">−{totalReduction}% City Hazard Reduction</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
