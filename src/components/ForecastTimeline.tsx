import React, { useState } from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { Clock, TrendingUp, Calendar, Info } from 'lucide-react';

interface ForecastTimelineProps {
  selectedRoad: RoadSegmentProfile;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({ selectedRoad }) => {
  const timePoints = [
    { time: '08:00', label: 'LOW', score: 28, color: '#10B981', note: 'Early morning clear flow' },
    { time: '12:00', label: 'LOW', score: 32, color: '#10B981', note: 'Midday daylight stability' },
    { time: '16:00', label: 'MODERATE', score: 54, color: '#F59E0B', note: 'Inbound school & delivery traffic' },
    { time: '20:00', label: 'HIGH', score: 82, color: '#F97316', note: 'Peak commute rush + twilight' },
    { time: '00:00', label: 'MODERATE', score: 58, color: '#F59E0B', note: 'Nocturnal freight speeds' }
  ];

  const [activePoint, setActivePoint] = useState<number>(3); // 20:00 High

  return (
    <div className="bg-white border border-[#E6E3DC] rounded-xl p-5 shadow-xs space-y-4 font-mono text-xs">
      
      <div className="flex items-center justify-between pb-2 border-b border-[#E6E3DC]">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
            DIURNAL RISK HORIZON
          </span>
          <h4 className="font-bold text-zinc-900 text-sm mt-0.5">
            24-Hour Model-Estimated Risk Progression: {selectedRoad.id}
          </h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-bold">
          TIME-SERIES SLICE
        </span>
      </div>

      {/* Elegant Timeline Component per Prompt Spec */}
      <div className="py-6 px-4 bg-[#F8F7F4] rounded-xl border border-[#E6E3DC] space-y-3">
        
        {/* Horizontal Line with Dots */}
        <div className="relative flex items-center justify-between">
          {/* Continuous Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-300" />

          {timePoints.map((pt, idx) => {
            const isSelected = activePoint === idx;
            return (
              <div 
                key={pt.time} 
                onClick={() => setActivePoint(idx)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                {/* Time Label Above */}
                <span className={`text-[11px] mb-2 font-bold transition-colors ${
                  isSelected ? 'text-violet-700' : 'text-zinc-500 group-hover:text-black'
                }`}>
                  {pt.time}
                </span>

                {/* Circle Node */}
                <div 
                  className={`w-5 h-5 rounded-full border-2 border-white transition-all flex items-center justify-center ${
                    isSelected ? 'ring-4 ring-violet-500/30 scale-125' : 'group-hover:scale-110'
                  }`}
                  style={{ backgroundColor: pt.color }}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                {/* Risk Level Below */}
                <span 
                  className="text-[9px] mt-2 font-black tracking-wider uppercase"
                  style={{ color: pt.color }}
                >
                  {pt.label}
                </span>

                <span className="text-[9px] text-zinc-400 font-mono mt-0.5">
                  {pt.score}/100
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Active Time Horizon Diagnostics */}
      <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between items-center text-xs">
        <div>
          <span className="text-zinc-500 font-sans text-[11px]">Selected Window: </span>
          <strong className="text-zinc-900">{timePoints[activePoint].time} ({timePoints[activePoint].label} RISK)</strong>
          <span className="text-zinc-500 text-[11px] font-sans block mt-0.5">{timePoints[activePoint].note}</span>
        </div>
        <div className="text-right">
          <span className="text-base font-black font-mono text-zinc-900">{timePoints[activePoint].score}</span>
          <span className="text-[10px] text-zinc-400">/ 100</span>
        </div>
      </div>

    </div>
  );
};
