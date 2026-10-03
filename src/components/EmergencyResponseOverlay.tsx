import React, { useState } from 'react';
import { 
  X, 
  Ambulance, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Navigation, 
  PhoneCall, 
  Radio, 
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { EMERGENCY_FACILITIES, AI_BLACKSPOTS } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface EmergencyResponseOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyResponseOverlay: React.FC<EmergencyResponseOverlayProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeRoute, setActiveRoute] = useState<'FASTEST' | 'ALTERNATIVE'>('FASTEST');
  const [isDispatched, setIsDispatched] = useState<boolean>(true);

  return (
    <div className="fixed top-16 left-6 w-[420px] max-w-[calc(100vw-3rem)] z-30 pointer-events-auto select-none font-mono text-xs">
      <div className="bg-[#070B14]/95 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3.5 text-slate-200">
        
        {/* Header Alert Banner */}
        <div className="flex items-center justify-between pb-2.5 border-b border-red-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-black text-white text-xs tracking-wider">
              EMERGENCY DISPATCH MODE
            </span>
          </div>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incident Summary Card */}
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1">
          <div className="text-[10px] text-red-400 font-bold uppercase">Active Critical Incident</div>
          <div className="font-bold text-white text-xs">
            Multi-Vehicle Collision at Namakkal S-Bend (NH-44)
          </div>
          <div className="text-[10px] text-slate-400">
            Coordinates: 11.2189° N, 78.1674° E · Salem-Madurai Corridor
          </div>
        </div>

        {/* Nearest Strategic Emergency Units */}
        <div className="space-y-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Nearest Dispatched Facilities
          </div>

          <div className="space-y-1.5">
            {EMERGENCY_FACILITIES.slice(0, 3).map(ef => (
              <div key={ef.id} className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-[11px]">{ef.name.split('-')[0].trim()}</div>
                  <div className="text-[10px] text-slate-400">{ef.type} · {ef.availableUnits} Active Units</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-bold">{ef.avgResponseMins} min ETA</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Routing Options (Fastest vs Alternative) */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Ambulance Navigation Route
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <button
              onClick={() => { tacticalAudio.playRadarPing(); setActiveRoute('FASTEST'); }}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                activeRoute === 'FASTEST'
                  ? 'bg-red-950/60 border-red-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[9px] text-slate-400">FASTEST ROUTE</div>
              <div className="text-sm font-extrabold text-red-400">6 min 24 sec</div>
              <div className="text-[8px] text-slate-500">via NH-44 Express Lane</div>
            </button>

            <button
              onClick={() => { tacticalAudio.playRadarPing(); setActiveRoute('ALTERNATIVE'); }}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                activeRoute === 'ALTERNATIVE'
                  ? 'bg-blue-950/60 border-blue-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[9px] text-slate-400">ALTERNATIVE ROUTE</div>
              <div className="text-sm font-extrabold text-blue-400">8 min 10 sec</div>
              <div className="text-[8px] text-slate-500">via Service Bypass</div>
            </button>
          </div>

          <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 pt-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Green corridor traffic signal preemption active along route.</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => { tacticalAudio.playAlertChime(); onClose(); }}
          className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
        >
          <Ambulance className="w-4 h-4" />
          <span>CONFIRM ALS AMBULANCE DISPATCH</span>
        </button>

      </div>
    </div>
  );
};
