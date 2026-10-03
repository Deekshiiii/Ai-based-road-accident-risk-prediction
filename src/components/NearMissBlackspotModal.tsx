import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Activity, 
  Crosshair, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { AI_BLACKSPOTS, BlackspotCluster, HighwayCorridor } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface NearMissBlackspotModalProps {
  isOpen: boolean;
  onClose: () => void;
  highway: HighwayCorridor;
  selectedBlackspot: BlackspotCluster | null;
  onSelectBlackspot: (blackspot: BlackspotCluster) => void;
}

export const NearMissBlackspotModal: React.FC<NearMissBlackspotModalProps> = ({
  isOpen,
  onClose,
  highway,
  selectedBlackspot,
  onSelectBlackspot
}) => {
  if (!isOpen) return null;

  const activeBlackspot = selectedBlackspot || AI_BLACKSPOTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-cyan-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>NEAR-MISS & PREDICTED BLACKSPOT ENGINE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 font-bold">
                  DBSCAN CLUSTERED
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Non-Collision Incident Telemetry & Spatial Hotspot Clustering
              </div>
            </div>
          </div>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Near-Miss Conflict Zone Metric Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/70 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Corridor Conflict Metric
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                NEAR-MISS RISK: <span className="text-cyan-400">87%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Monitored corridor: <strong className="text-slate-200">{highway.name}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-right">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[9px] text-slate-500">SUDDEN BRAKES</div>
                <div className="text-sm font-bold text-amber-400">142 / day</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[9px] text-slate-500">LANE CONFLICTS</div>
                <div className="text-sm font-bold text-red-400">86 / day</div>
              </div>
            </div>
          </div>

          {/* AI Detected Blackspots List */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>AI DETECTED BLACKSPOTS (National Highway Grid)</span>
              <span className="text-slate-500">Spatial eps=250m</span>
            </div>

            {AI_BLACKSPOTS.map(bs => {
              const isSelected = activeBlackspot.id === bs.id;
              return (
                <div
                  key={bs.id}
                  onClick={() => {
                    tacticalAudio.playRadarPing();
                    onSelectBlackspot(bs);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/30 border-cyan-500/80 shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="font-bold text-white text-xs">{bs.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 font-bold border border-red-500/40">
                        SEVERITY {bs.severityIndex}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-400">
                    <div>Cluster Radius: <strong className="text-slate-200">{bs.clusterRadiusMeters}m</strong></div>
                    <div>3-Year Fatalities: <strong className="text-red-400">{bs.fatalitiesPast3Years}</strong></div>
                    <div>Peak Hazard Time: <strong className="text-amber-400">{bs.peakTime}</strong></div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-300 leading-snug">
                    <span className="text-slate-500 font-bold">PRIMARY CAUSE: </span>
                    {bs.primaryCause}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-cyan-400 font-semibold">
                      RECOMMENDED INTERVENTION: {bs.counterfactualIntervention}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      -{bs.riskReductionEstimatePct}% PROJECTED REDUCTION
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
