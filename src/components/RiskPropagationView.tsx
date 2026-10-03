import React from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS } from '../data/roadGuardData';
import { GitBranch, Activity, Info, ArrowRight } from 'lucide-react';

interface RiskPropagationViewProps {
  selectedRoad: RoadSegmentProfile;
  onSelectRoad: (road: RoadSegmentProfile) => void;
}

export const RiskPropagationView: React.FC<RiskPropagationViewProps> = ({ selectedRoad, onSelectRoad }) => {
  return (
    <div className="bg-white border border-[#E6E3DC] rounded-xl p-5 shadow-xs space-y-4 font-mono text-xs">
      
      <div className="flex items-center justify-between pb-2 border-b border-[#E6E3DC]">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
            NETWORK TOPOLOGY ANALYSIS
          </span>
          <h4 className="font-bold text-zinc-900 text-sm mt-0.5">
            Network Risk Propagation & Connectivity Graph
          </h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-bold">
          DIRECTIONAL TOPOLOGY
        </span>
      </div>

      <p className="text-zinc-600 font-sans text-xs leading-relaxed">
        Visualizing multi-segment risk state correlations across connected corridors intersecting with <strong>{selectedRoad.id}</strong> ({selectedRoad.name}).
      </p>

      {/* Cross-Network Visual Node Topology per Prompt Spec */}
      <div className="py-6 flex flex-col items-center justify-center bg-[#F8F7F4] rounded-xl border border-[#E6E3DC] relative select-none">
        
        {/* Top Node (North Feeder: Yellow Elevated) */}
        <div className="flex flex-col items-center space-y-1 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white">
            🟡
          </div>
          <span className="text-[10px] text-zinc-600">R-108 (52/100)</span>
          <div className="w-0.5 h-6 bg-zinc-300"></div>
        </div>

        {/* Horizontal Main Arterial Spine (🟢 ─── 🟠 ─── 🔴 ─── 🟠) */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Node 1: Green Safe */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white cursor-pointer hover:scale-110 transition-transform">
              🟢
            </div>
            <span className="text-[10px] text-zinc-700 font-bold">R-105</span>
            <span className="text-[9px] text-zinc-500">SAFE (48)</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-zinc-300 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-zinc-400">&rarr;</span>
          </div>

          {/* Node 2: Orange High */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white cursor-pointer hover:scale-110 transition-transform">
              🟠
            </div>
            <span className="text-[10px] text-zinc-700 font-bold">R-101</span>
            <span className="text-[9px] text-zinc-500">HIGH (78)</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-zinc-300 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-zinc-400">&rarr;</span>
          </div>

          {/* Node 3: Center Red Critical (Core Focus) */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white ring-4 ring-violet-500/30 cursor-pointer animate-pulse">
              🔴
            </div>
            <span className="text-[11px] text-violet-800 font-black">{selectedRoad.id}</span>
            <span className="text-[9px] text-red-600 font-bold">CRITICAL ({selectedRoad.currentRiskScore})</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-zinc-300 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-zinc-400">&rarr;</span>
          </div>

          {/* Node 4: Orange High */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white cursor-pointer hover:scale-110 transition-transform">
              🟠
            </div>
            <span className="text-[10px] text-zinc-700 font-bold">R-102</span>
            <span className="text-[9px] text-zinc-500">HIGH (76)</span>
          </div>

        </div>

        {/* Bottom Node (South Feeder: Yellow Elevated) */}
        <div className="flex flex-col items-center space-y-1 mt-2">
          <div className="w-0.5 h-6 bg-zinc-300"></div>
          <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white">
            🟡
          </div>
          <span className="text-[10px] text-zinc-600">R-109 (55/100)</span>
        </div>

      </div>

      <div className="text-[10px] text-zinc-500 font-sans italic flex items-center gap-1.5 pt-1">
        <Info className="w-3 h-3 shrink-0" />
        <span>Network Topology Label: Represents network-level spatial connectivity and vehicle handover between corridors. Risk does not physically flow as a fluid; scores reflect correlated structural and traffic friction factors.</span>
      </div>

    </div>
  );
};
