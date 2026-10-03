import React from 'react';
import { X, GitBranch, ArrowDown, Activity, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { RoadSegmentProfile } from '../types/accident';

interface RiskPropagationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegmentProfile;
}

export const RiskPropagationModal: React.FC<RiskPropagationModalProps> = ({
  isOpen,
  onClose,
  selectedRoad
}) => {
  if (!isOpen) return null;

  const propagationSteps = [
    {
      stage: 'PRIMARY HOTSPOT CORRIDOR',
      roadId: selectedRoad.id,
      name: selectedRoad.name,
      risk: selectedRoad.currentRiskScore,
      icon: '🔴',
      color: 'border-red-600 bg-red-950/40 text-red-300',
      description: 'Localized recurring crash concentration with peak commute saturation and standing friction deficits.'
    },
    {
      stage: 'JUNCTION CAPACITY PRESSURE',
      roadId: 'INT-02',
      name: 'Kathipara Multi-Grade Grade Separator',
      risk: 84,
      icon: '🟠',
      color: 'border-orange-600 bg-orange-950/40 text-orange-300',
      description: 'Backlog in exit ramp cloverleaf decelerates traffic from 70 km/h to 18 km/h over 350 meters.'
    },
    {
      stage: 'TRAFFIC SPILLOVER WEAVE',
      roadId: 'R-102',
      name: 'GST Highway - Southern S-Curve',
      risk: 76,
      icon: '🟠',
      color: 'border-orange-500 bg-orange-950/30 text-orange-300',
      description: 'Vehicles divert toward outer arterial bypass, triggering erratic lane-change weaving.'
    },
    {
      stage: 'ADJACENT CORRIDOR ELEVATION',
      roadId: 'R-105',
      name: 'Guindy - Velachery Commercial Link',
      risk: 54,
      icon: '🟡',
      color: 'border-amber-500 bg-amber-950/30 text-amber-300',
      description: 'Secondary feeder absorption elevates localized risk by +12 points above daytime baseline.'
    },
    {
      stage: 'DOWNSTREAM STABILIZATION ZONE',
      roadId: 'R-103',
      name: 'OMR Tech Corridor Outbound',
      risk: 32,
      icon: '🟢',
      color: 'border-emerald-600 bg-emerald-950/40 text-emerald-300',
      description: 'Wide 6-lane divided cross-section absorbs dissipated volume; returns to nominal green safety state.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-950/60 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  NETWORK RISK PROPAGATION MAP
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-700/60 px-2 py-0.5 rounded font-bold animate-pulse">
                  CASCADE DETECTED
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                Dynamic hydrodynamic vehicle spillover across connected city corridors
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

        {/* Cascade Step-by-Step Chain */}
        <div className="space-y-3 py-2">
          {propagationSteps.map((step, idx) => (
            <React.Fragment key={step.stage}>
              <div className={`p-4 rounded-2xl border ${step.color} shadow-sm space-y-1.5`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{step.icon}</span>
                    <span className="font-extrabold tracking-wider uppercase text-[11px]">{step.stage}</span>
                    <span className="text-slate-400 font-sans">({step.roadId})</span>
                  </div>

                  <span className="font-mono font-black text-sm">{step.risk} / 100</span>
                </div>

                <div className="text-white font-bold text-xs">{step.name}</div>
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">{step.description}</p>
              </div>

              {idx < propagationSteps.length - 1 && (
                <div className="flex flex-col items-center justify-center my-0.5">
                  <ArrowDown className="w-4 h-4 text-orange-400 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-sans text-xs">
            Model recommendation: Enforce dynamic ramp metering at <strong>Kathipara Cloverleaf</strong> to halt corridor cascade.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer shrink-0 ml-3"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
