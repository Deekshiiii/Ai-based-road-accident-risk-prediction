import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, AlertTriangle, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

interface TimelineBarProps {
  currentOffsetHours: number;
  onSelectOffsetHours: (offset: number) => void;
  peakRiskInfo?: {
    peakRiskScore: number;
    peakTimeWindow: string;
    factorReason: string;
  };
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  currentOffsetHours,
  onSelectOffsetHours,
  peakRiskInfo = {
    peakRiskScore: 92,
    peakTimeWindow: '18:00 – 20:00 (Next 4 Hours)',
    factorReason: 'Evening monsoon showers + freight truck saturation + reduced photopic contrast'
  }
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps = [
    { label: 'NOW', offset: 0 },
    { label: '15 MIN', offset: 0.25 },
    { label: '1 HR', offset: 1.0 },
    { label: '6 HR', offset: 6.0 },
    { label: '24 HR', offset: 24.0 },
    { label: '7 DAYS', offset: 168.0 }
  ];

  // Auto-playback timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const currentIndex = steps.findIndex(s => Math.abs(s.offset - currentOffsetHours) < 0.1);
      const nextIndex = (currentIndex + 1) % steps.length;
      tacticalAudio.playRadarPing();
      onSelectOffsetHours(steps[nextIndex].offset);
    }, 2400);

    return () => clearInterval(interval);
  }, [isPlaying, currentOffsetHours, onSelectOffsetHours]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none">
      <div className="bg-[#070B14]/95 backdrop-blur-md border border-slate-800/90 rounded-2xl px-3 py-2 shadow-2xl flex flex-col md:flex-row items-center gap-3 font-mono text-xs text-slate-300">
        
        {/* Play/Pause Button */}
        <button
          onClick={() => {
            tacticalAudio.playRadarPing();
            setIsPlaying(!isPlaying);
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
            isPlaying 
              ? 'bg-violet-600 border-violet-400 text-white' 
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={isPlaying ? 'Pause Predictive Simulation' : 'Play Predictive Time-Lapse'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        {/* Timeline Horizon Pills */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
          {steps.map(step => {
            const isActive = Math.abs(step.offset - currentOffsetHours) < 0.1;
            return (
              <button
                key={step.label}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  onSelectOffsetHours(step.offset);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Predictive Future Alert Teaser */}
        {currentOffsetHours > 0 ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="text-slate-400 hidden sm:inline">FUTURE RISK PROJECTION:</span>
            <span className="text-amber-300 font-extrabold">+{Math.round(currentOffsetHours * 3.5)}% ELEVATION</span>
            <span className="text-slate-500 hidden lg:inline">· {peakRiskInfo.factorReason.split('+')[0].trim()}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>REAL-TIME LIVE STREAM</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500 hidden sm:inline">PEAK HAZARD: {peakRiskInfo.peakTimeWindow}</span>
          </div>
        )}

      </div>
    </div>
  );
};
