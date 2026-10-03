import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

interface FutureRiskTimelineProps {
  currentOffset: number; // 0, 0.25, 0.5, 1, 3, 6
  onSelectOffset: (offset: number) => void;
}

export const FutureRiskTimeline: React.FC<FutureRiskTimelineProps> = ({
  currentOffset,
  onSelectOffset
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps = [
    { label: 'NOW', value: 0, sub: 'Live Sensor Calibration', riskDelta: 0 },
    { label: '+15 MIN', value: 0.25, sub: 'Initial Commute Inflow', riskDelta: 3 },
    { label: '+30 MIN', value: 0.5, sub: 'Intersection Weave Saturation', riskDelta: 6 },
    { label: '+1 HR', value: 1.0, sub: 'Peak Commute Rush Hour', riskDelta: 11 },
    { label: '+3 HR', value: 3.0, sub: 'Severe Twilight Friction', riskDelta: 16 },
    { label: '+6 HR', value: 6.0, sub: 'Nocturnal Freight Transition', riskDelta: 4 }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        const curIdx = steps.findIndex(s => s.value === currentOffset);
        const nextIdx = (curIdx + 1) % steps.length;
        tacticalAudio.playTick();
        onSelectOffset(steps[nextIdx].value);
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentOffset, onSelectOffset]);

  const activeStep = steps.find(s => s.value === currentOffset) || steps[0];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl bg-[#0F172A]/90 backdrop-blur-md border border-slate-800 rounded-xl px-5 py-3 shadow-2xl text-xs font-mono text-slate-200">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-bold text-white tracking-wider uppercase text-[11px]">
            PREDICTIVE FUTURE RISK TIMELINE
          </span>
          <span className="text-[10px] text-slate-500">|</span>
          <span className="text-violet-400 font-bold">{activeStep.label} PROJECTION</span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
            activeStep.riskDelta > 10 ? 'bg-red-950 text-red-400 border border-red-800/40' :
            activeStep.riskDelta > 0 ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
            'bg-slate-800 text-slate-300'
          }`}>
            {activeStep.riskDelta > 0 ? `+${activeStep.riskDelta} PTS RISK SHIFT` : 'CURRENT BASELINE'}
          </span>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              setIsPlaying(!isPlaying);
            }}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-bold text-[10px] transition-all cursor-pointer ${
              isPlaying ? 'bg-amber-600 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
        </div>
      </div>

      {/* Step Buttons Line */}
      <div className="pt-2.5 grid grid-cols-6 gap-1.5 items-center">
        {steps.map(step => {
          const isSelected = step.value === currentOffset;
          return (
            <button
              key={step.label}
              onClick={() => {
                tacticalAudio.playTick();
                onSelectOffset(step.value);
              }}
              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-violet-600 text-white border-violet-400 shadow-md ring-1 ring-violet-400'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-[11px]">{step.label}</div>
              <div className="text-[8px] opacity-75 truncate">{step.sub.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
