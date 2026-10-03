import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, AlertTriangle, Activity, Sparkles, Clock, ShieldAlert } from 'lucide-react';
import { INCIDENT_REPLAY_DATA } from '../data/digitalTwinCityData';
import { IncidentReplayFrame, RoadSegmentProfile } from '../types/accident';
import { tacticalAudio } from '../services/tacticalAudio';

interface IncidentReplayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegmentProfile;
}

export const IncidentReplayDrawer: React.FC<IncidentReplayDrawerProps> = ({
  isOpen,
  onClose,
  selectedRoad
}) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveFrameIndex(prev => {
          const next = prev + 1;
          tacticalAudio.playTick();
          if (next >= INCIDENT_REPLAY_DATA.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentFrame = INCIDENT_REPLAY_DATA[activeFrameIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  HISTORICAL ACCIDENT PATTERN REPLAY & INVESTIGATION
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-700/60 px-2 py-0.5 rounded font-bold">
                  {selectedRoad.id} CASE #8921
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                Forensic multi-variable reconstruction of collision cascade
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

        {/* 4-Phase Progress Timeline */}
        <div className="grid grid-cols-4 gap-2">
          {INCIDENT_REPLAY_DATA.map((frame, idx) => {
            const isSelected = activeFrameIndex === idx;
            const isPast = activeFrameIndex > idx;
            return (
              <button
                key={frame.phase}
                onClick={() => {
                  tacticalAudio.playTick();
                  setActiveFrameIndex(idx);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/60 border-red-500 shadow-md ring-1 ring-red-500'
                    : isPast
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase">{frame.phase}</span>
                  <span className="text-[10px] font-mono">{frame.time.slice(0, 5)}</span>
                </div>
                <div className="text-base font-black font-mono text-white mt-1">
                  {frame.riskScore} <span className="text-[9px] font-normal text-slate-400">RISK</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Telemetry Display Box */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              PHASE: {currentFrame.phase} (TIMESTAMP: {currentFrame.time})
            </span>
            <span className="text-[10px] text-slate-400">CALIBRATED LOG</span>
          </div>

          <p className="text-xs font-sans text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            {currentFrame.eventDescription}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">TRAFFIC DENSITY</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{currentFrame.trafficDensityPct}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">WEATHER STATE</span>
              <div className="text-xs font-bold text-white mt-0.5 truncate">{currentFrame.weatherState.split(' ')[0]}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">ROAD FRICTION</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{currentFrame.roadFrictionCoeff}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">HEADWAY GAP</span>
              <div className="text-lg font-bold text-red-400 font-mono mt-0.5">{currentFrame.telemetry.headwayMeters}m</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE REPLAY' : 'AUTO-PLAY REPLAY'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Close Investigation
          </button>
        </div>

      </div>
    </div>
  );
};
