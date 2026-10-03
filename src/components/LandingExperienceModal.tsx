import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Cpu, Eye } from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

interface LandingExperienceModalProps {
  isOpen: boolean;
  onEnterCity: () => void;
}

export const LandingExperienceModal: React.FC<LandingExperienceModalProps> = ({
  isOpen,
  onEnterCity
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0B0F19]/95 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Background Animated Geometric Ring */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-violet-500/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '40s' }} />
      <div className="absolute w-[360px] h-[360px] rounded-full border border-slate-700/30 pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 font-mono relative z-10">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-xs shadow-lg">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
          <span className="font-bold tracking-widest uppercase">ROADGUARD AI · DIGITAL TWIN PLATFORM</span>
        </div>

        {/* Hero Philosophical Statement */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-snug">
            “THE ROAD IS NOT JUST A ROAD.<br />
            <span className="text-violet-400">IT IS A SYSTEM OF RISK.”</span>
          </h1>

          <p className="text-slate-400 font-sans text-sm max-w-md mx-auto leading-relaxed">
            Autonomous multi-variable digital twin predicting collision hazards before they physically manifest on urban corridors.
          </p>
        </div>

        {/* 5-Stage Core Paradigm Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-300 font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">SEE THE ROAD</span>
          <span className="text-violet-400">&rarr;</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">UNDERSTAND RISK</span>
          <span className="text-violet-400">&rarr;</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">PREDICT FUTURE</span>
          <span className="text-violet-400">&rarr;</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">SIMULATE LAB</span>
          <span className="text-violet-400">&rarr;</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-300">PREVENT INCIDENT</span>
        </div>

        {/* Enter CTA */}
        <div className="pt-2">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              onEnterCity();
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(139,92,246,0.5)] cursor-pointer flex items-center gap-3 mx-auto uppercase"
          >
            <span>ENTER 3D DIGITAL CITY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-500 mt-3 block">
            LIVE ROAD INTELLIGENCE — “Select a road to understand its future.”
          </span>
        </div>

      </div>

    </div>
  );
};
