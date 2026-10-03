import React, { useState } from 'react';
import { X, Award, DollarSign, TrendingDown, CheckCircle2, ShieldCheck, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import { PLANNER_CHALLENGE_CATALOG } from '../data/digitalTwinCityData';
import { PlannerInvestmentOption } from '../types/accident';
import { tacticalAudio } from '../services/tacticalAudio';

interface UrbanPlannerChallengeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cityRiskScore?: number;
}

export const UrbanPlannerChallengeDrawer: React.FC<UrbanPlannerChallengeDrawerProps> = ({
  isOpen,
  onClose,
  cityRiskScore = 68
}) => {
  const TOTAL_BUDGET = 1000000; // $1,000,000 USD
  const [items, setItems] = useState<PlannerInvestmentOption[]>(PLANNER_CHALLENGE_CATALOG);

  if (!isOpen) return null;

  const totalSpent = items.filter(i => i.purchased).reduce((sum, i) => sum + i.cost, 0);
  const remainingBudget = TOTAL_BUDGET - totalSpent;
  const totalRiskReduction = items.filter(i => i.purchased).reduce((sum, i) => sum + i.expectedRiskReduction, 0);
  const totalAccidentsAvoided = items.filter(i => i.purchased).reduce((sum, i) => sum + i.annualAccidentsAvoided, 0);
  const projectedCityRisk = Math.max(22, cityRiskScore - Math.round(totalRiskReduction * 0.45));

  const togglePurchase = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (!item.purchased && item.cost > remainingBudget) {
      tacticalAudio.playAlertChime();
      return; // Not enough budget
    }

    tacticalAudio.playTick();
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i));
  };

  const resetGame = () => {
    tacticalAudio.playTick();
    setItems(prev => prev.map(i => ({ ...i, purchased: false })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  URBAN PLANNER CHALLENGE — INFRASTRUCTURE SIMULATOR
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-bold">
                  BUDGET: $1,000,000
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                Allocate capital budget to minimize city-wide accident risk and save lives
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

        {/* Real-Time Planner Scoreboard Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <div className="p-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">REMAINING BUDGET</span>
            <div className={`text-2xl font-black font-mono mt-1 ${remainingBudget < 150000 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ${remainingBudget.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500">SPENT: ${totalSpent.toLocaleString()}</span>
          </div>

          <div className="p-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">PROJECTED CITY RISK</span>
            <div className="text-2xl font-black text-white font-mono mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-500 line-through text-lg">{cityRiskScore}</span>
              <span className="text-emerald-400">&rarr; {projectedCityRisk}</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-bold uppercase">−{cityRiskScore - projectedCityRisk} PTS DROP</span>
          </div>

          <div className="p-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ACCIDENTS PREVENTED</span>
            <div className="text-2xl font-black text-violet-400 font-mono mt-1">
              +{totalAccidentsAvoided} / yr
            </div>
            <span className="text-[9px] text-violet-300">ESTIMATED LIVES SAVED</span>
          </div>

          <div className="p-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">PLANNER RATING</span>
            <div className="text-xl font-black font-mono mt-1 text-amber-300">
              {totalAccidentsAvoided >= 50 ? '⭐⭐⭐ S-TIER' : (totalAccidentsAvoided >= 30 ? '⭐⭐ A-TIER' : '⭐ B-TIER')}
            </div>
            <span className="text-[9px] text-slate-500">ROI SCORE</span>
          </div>
        </div>

        {/* Investment Catalog Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              AVAILABLE INFRASTRUCTURE UPGRADE PACKAGES
            </span>
            <span className="text-slate-500 text-[11px] font-sans">Click cards to procure upgrades</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(item => {
              const isAffordable = remainingBudget >= item.cost;
              return (
                <div
                  key={item.id}
                  onClick={() => togglePurchase(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 select-none ${
                    item.purchased
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : !isAffordable
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-40 cursor-not-allowed'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-white text-xs mt-0.5">{item.roadName}</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-white font-mono block">
                        ${item.cost.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.purchased ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.purchased ? 'INSTALLED' : 'PURCHASE'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 font-sans">
                    <span>Model Risk Impact: <strong className="text-emerald-400 font-mono">−{item.expectedRiskReduction} pts</strong></span>
                    <span>Avoided: <strong className="text-white font-mono">{item.annualAccidentsAvoided} crashes/yr</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Budget Allocations</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
          >
            Apply Portfolio & Return to City
          </button>
        </div>

      </div>
    </div>
  );
};
