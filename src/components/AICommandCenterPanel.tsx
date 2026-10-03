import React, { useState } from 'react';
import { ShieldAlert, Activity, Flame, Zap, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { RoadSegmentProfile } from '../types/accident';

interface AICommandCenterPanelProps {
  cityRiskScore?: number;
  activeHotspotsCount?: number;
  emergingRisksCount?: number;
  criticalRoadsCount?: number;
  selectedRoad: RoadSegmentProfile;
}

export const AICommandCenterPanel: React.FC<AICommandCenterPanelProps> = ({
  cityRiskScore = 68,
  activeHotspotsCount = 7,
  emergingRisksCount = 3,
  criticalRoadsCount = 4,
  selectedRoad
}) => {
  const [isFeedExpanded, setIsFeedExpanded] = useState<boolean>(true);

  const intelligenceFeed = [
    { type: 'AI DETECTED', time: '18:42', text: `Risk surge detected on ${selectedRoad.id} (+8 pts)`, level: 'alert' },
    { type: 'AI PREDICTED', time: '18:47', text: 'Congestion spillover likely to spread to Junction 12', level: 'warning' },
    { type: 'AI RECOMMENDED', time: '18:48', text: 'Pre-position trauma unit & activate green corridor', level: 'action' }
  ];

  return (
    <div className="absolute top-20 left-6 z-20 w-80 bg-[#0F172A]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-200 font-mono text-xs space-y-4">
      
      {/* Top Identity Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
            AI COMMAND CENTER
          </span>
        </div>
        <span className="text-[9px] text-slate-500">SECTOR 04</span>
      </div>

      {/* Main KPI Matrix */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest block">CITY-WIDE RISK</span>
          <div className="text-2xl font-black text-white mt-0.5">
            {cityRiskScore} <span className="text-xs font-normal text-slate-500">/100</span>
          </div>
          <span className="text-[9px] text-amber-400 font-bold uppercase">ELEVATED EXPOSURE</span>
        </div>

        <div className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest block">ACTIVE HOTSPOTS</span>
          <div className="text-2xl font-black text-red-400 mt-0.5">
            0{activeHotspotsCount}
          </div>
          <span className="text-[9px] text-red-400/80 font-bold uppercase">DBSCAN DETECTED</span>
        </div>

        <div className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest block">EMERGING RISKS</span>
          <div className="text-2xl font-black text-amber-400 mt-0.5">
            0{emergingRisksCount}
          </div>
          <span className="text-[9px] text-slate-400 uppercase">WEAVE ANOMALIES</span>
        </div>

        <div className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest block">CRITICAL ROADS</span>
          <div className="text-2xl font-black text-red-500 mt-0.5">
            0{criticalRoadsCount}
          </div>
          <span className="text-[9px] text-red-400 uppercase font-bold">&ge; 75 RISK INDEX</span>
        </div>
      </div>

      {/* Current AI Insight Banner */}
      <div className="p-3 bg-violet-950/40 border border-violet-800/40 rounded-xl text-[11px] font-sans text-violet-200 space-y-1">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-violet-400 font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span>SYNTHESIZED SITUATIONAL AWARENESS</span>
        </div>
        <p className="leading-relaxed">
          “3 emerging risk zones detected in the eastern corridor. Pre-commute congestion approaching saturation on <strong>{selectedRoad.id}</strong>.”
        </p>
      </div>

      {/* Real-Time Intelligence Feed */}
      <div className="space-y-2">
        <div 
          onClick={() => setIsFeedExpanded(!isFeedExpanded)}
          className="flex items-center justify-between text-[10px] text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
        >
          <span className="font-bold">LIVE INTELLIGENCE STREAM</span>
          {isFeedExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>

        {isFeedExpanded && (
          <div className="space-y-1.5 font-mono text-[10px]">
            {intelligenceFeed.map((item, idx) => (
              <div 
                key={idx}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-0.5"
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${
                    item.level === 'alert' ? 'text-red-400' :
                    item.level === 'warning' ? 'text-amber-400' : 'text-violet-400'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-slate-500">{item.time} IST</span>
                </div>
                <div className="text-slate-300 font-sans text-[11px]">{item.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
