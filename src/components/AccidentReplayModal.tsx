import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  Play, 
  Pause, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { HighwayCorridor } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface AccidentReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  highway: HighwayCorridor;
}

export const AccidentReplayModal: React.FC<AccidentReplayModalProps> = ({
  isOpen,
  onClose,
  highway
}) => {
  if (!isOpen) return null;

  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const phases = [
    {
      timeLabel: '-10 SEC (Approach)',
      description: 'Container truck approaching Namakkal S-Bend at 78 km/h under monsoon downpour.',
      vehicleState: 'Truck in right lane; passenger sedan trailing with 14m unsafe buffer.',
      riskFactors: 'Speed Limit: 60 km/h · Over-speeding by +18 km/h · Rain: 32 mm/hr',
      canvasOffset: 15
    },
    {
      timeLabel: '-5 SEC (Braking Cascade)',
      description: 'Slow-moving tractor turns across unauthorized median opening; truck slams emergency air brakes.',
      vehicleState: 'Hydroplaning causes truck trailer to jackknife across two lanes.',
      riskFactors: 'Braking Distance: +46% due to water ponding · Visibility: < 220m',
      canvasOffset: 45
    },
    {
      timeLabel: '0 SEC (IMPACT)',
      description: 'Sedan impacts rear under-ride guard of jackknifed container; secondary two-wheeler skids.',
      vehicleState: 'Violent multi-vehicle collision at apex of curve.',
      riskFactors: 'Impact Speed: 52 km/h · Structural underride hazard',
      canvasOffset: 75
    },
    {
      timeLabel: '+5 SEC (Aftermath)',
      description: 'Traffic halts on all 3 lanes; automated IoT crash sensor sends emergency pulse to Salem dispatch.',
      vehicleState: 'Highway blocked; debris spread over 45m radius.',
      riskFactors: 'Automatic SOS triggered · Response Latency: 6.4 minutes',
      canvasOffset: 95
    }
  ];

  // Auto playback of the 4-phase incident
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActivePhaseIndex(prev => {
        const next = (prev + 1) % phases.length;
        tacticalAudio.playRadarPing();
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, phases.length]);

  const currentPhase = phases[activePhaseIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-blue-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-blue-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300">
              <RotateCcw className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>ACCIDENT RECONSTRUCTION REPLAY</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-500/30 font-bold">
                  4-PHASE DIGITAL TWIN
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Incident Replay: {highway.code} Namakkal Kilometer Post 348
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

        {/* Phase Navigation Strip */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-blue-600 text-white cursor-pointer mr-2"
              title={isPlaying ? 'Pause Replay' : 'Play Replay'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {phases.map((p, idx) => (
              <button
                key={p.timeLabel}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  setActivePhaseIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  activePhaseIndex === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {p.timeLabel}
              </button>
            ))}
          </div>

          <span className="text-slate-500 text-[10px]">PHASE {activePhaseIndex + 1} OF 4</span>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Phase Visual Reconstruction Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-extrabold text-sm">{currentPhase.timeLabel}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {activePhaseIndex === 2 ? '🔴 CRASH IMPACT' : 'RECONSTRUCTION'}
              </span>
            </div>

            <div className="text-white text-xs leading-relaxed font-sans">{currentPhase.description}</div>
            
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-slate-500 font-bold">VEHICLE KINEMATICS: </span>
              {currentPhase.vehicleState}
            </div>

            <div className="text-[10px] text-amber-400 pt-1">
              ⚠️ {currentPhase.riskFactors}
            </div>
          </div>

          {/* WHAT COULD HAVE PREVENTED THIS Section */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WHAT COULD HAVE PREVENTED THIS INCIDENT?</span>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Median Barrier Closure:</strong> Eliminating the unauthorized agricultural tractor crossover point eliminates the initial braking trigger entirely.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>High-Friction Surfacing (HFST):</strong> Increases wet tire friction coefficient from 0.38 to 0.72, reducing braking distance by 28m.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automated VMS Wet Weather Speed Warning:</strong> Lowering truck approach velocity from 78 km/h to 50 km/h prevents jackknife loss of control.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
