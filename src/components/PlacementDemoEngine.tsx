import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  X,
  ShieldAlert,
  Sliders,
  Ambulance,
  FileText
} from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

export interface DemoStep {
  stepIndex: number;
  title: string;
  badge: string;
  narration: string;
  actionHint: string;
}

interface PlacementDemoEngineProps {
  isActive: boolean;
  onClose: () => void;
  onStepChange: (stepIndex: number) => void;
}

export const DEMO_STAGES: DemoStep[] = [
  {
    stepIndex: 1,
    title: '1. National Risk Pulse Activation',
    badge: 'SYSTEM ONLINE',
    narration: 'ROADGUARD AI boots up India Digital Twin monitoring 6 major National Highway corridors with continuous stream telemetry.',
    actionHint: 'Observing living national risk waves across India.'
  },
  {
    stepIndex: 2,
    title: '2. Emerging Event Detected: NH-44 Tamil Nadu',
    badge: 'AI EVENT DETECTED',
    narration: 'Camera zooms dynamically into the Salem–Namakkal–Madurai corridor. System illuminates glowing risk field: 78/100 HIGH RISK.',
    actionHint: 'Corridor illuminated with 89% AI confidence.'
  },
  {
    stepIndex: 3,
    title: '3. AI Forensics & Causal Mechanism Graph',
    badge: 'CAUSE → EFFECT',
    narration: 'AI reveals the causal chain: Heavy Monsoon Rain → Reduced Visibility (<350m) → 42% Increased Braking Distance → Rear-End Collision Hazard.',
    actionHint: 'SHAP waterfall feature contributions loaded.'
  },
  {
    stepIndex: 4,
    title: '4. DBSCAN Blackspot & Near-Miss Conflict Zone',
    badge: 'NEAR MISS: 87%',
    narration: 'Spatial density clustering isolates Namakkal S-Bend (38 fatalities over 3 years), logging 142 sudden braking incidents per day.',
    actionHint: 'Near-miss conflict zone highlighted.'
  },
  {
    stepIndex: 5,
    title: '5. Accident Reconstruction Replay',
    badge: '4-PHASE REPLAY',
    narration: 'Digital twin replays historical -10s, -5s, Impact, and +5s kinematics, demonstrating how median crossover closure could have prevented the incident.',
    actionHint: 'Forensic replay completed.'
  },
  {
    stepIndex: 6,
    title: '6. Predictive Risk Curve (Next 6 Hours)',
    badge: 'FUTURE PROJECTION',
    narration: 'Timeline slider forecasts peak hazard window between 18:00 and 20:00, with risk index climbing to 92/100 as evening monsoon intensifies.',
    actionHint: 'Diurnal time-series analyzed.'
  },
  {
    stepIndex: 7,
    title: '7. What-If Digital Twin Simulation',
    badge: 'WHAT IF? LAB',
    narration: 'Operator tests +20% traffic surge + 40% monsoon rain: Risk jumps from 78 to 94 (+16), triggering spatial risk propagation onto adjacent state highways.',
    actionHint: 'Risk propagation animated.'
  },
  {
    stepIndex: 8,
    title: '8. Counterfactual Intervention Engine',
    badge: 'COUNTERFACTUAL',
    narration: 'Testing 5 civil interventions: Porous asphalt resurfacing delivers the single largest safety dividend (-16 points), lowering corridor risk to 62.',
    actionHint: 'Optimal policy intervention identified.'
  },
  {
    stepIndex: 9,
    title: '9. Safety-First Interstate Route Analyzer',
    badge: 'SAFETY ROUTE',
    narration: 'Evaluating Chennai → Bengaluru routes: Route B (Chittoor Bypass) reduces risk from 61 to 43, avoiding industrial truck bottlenecks with minimal travel time delta.',
    actionHint: 'Safety-first route generated.'
  },
  {
    stepIndex: 10,
    title: '10. Computer Vision Road Vision Mode',
    badge: 'YOLOv11 CV',
    narration: 'Real-time camera feed detects deep pothole (-16 pts) and faded lane markings, automatically generating a public works repair ticket.',
    actionHint: 'Bounding boxes and road health computed.'
  },
  {
    stepIndex: 11,
    title: '11. Emergency Response Mode Dispatch',
    badge: 'EMERGENCY DISPATCH',
    narration: 'System transforms interface, coordinates nearest Level-1 Trauma Hospital, and computes green-corridor ambulance route with 6 min 24 sec ETA.',
    actionHint: 'Ambulance siren route animated.'
  },
  {
    stepIndex: 12,
    title: '12. Final AI Intelligence Decision & Executive Report',
    badge: 'ANALYSIS COMPLETE',
    narration: 'Comprehensive Road Risk Intelligence Report compiled with MoRTH data transparency, ready for executive download and smart-city deployment.',
    actionHint: 'Placement demo complete: From Detection to Prevention.'
  }
];

export const PlacementDemoEngine: React.FC<PlacementDemoEngineProps> = ({
  isActive,
  onClose,
  onStepChange
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [progressSec, setProgressSec] = useState<number>(0);

  const stepDurationSec = 14; // 14 seconds per step = approx 2.8 minutes total

  useEffect(() => {
    if (!isActive) return;
    onStepChange(DEMO_STAGES[currentStepIdx].stepIndex);
  }, [isActive, currentStepIdx, onStepChange]);

  // Automated step advance timer
  useEffect(() => {
    if (!isActive || !isAutoPlaying) return;

    const timer = setInterval(() => {
      setProgressSec(prev => {
        if (prev >= stepDurationSec) {
          // Advance step
          setCurrentStepIdx(s => {
            const next = s < DEMO_STAGES.length - 1 ? s + 1 : 0;
            tacticalAudio.playRadarPing();
            return next;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isAutoPlaying, stepDurationSec]);

  if (!isActive) return null;

  const currentStep = DEMO_STAGES[currentStepIdx];
  const progressPct = (progressSec / stepDurationSec) * 100;

  const handleNext = () => {
    tacticalAudio.playRadarPing();
    setProgressSec(0);
    setCurrentStepIdx(prev => (prev < DEMO_STAGES.length - 1 ? prev + 1 : 0));
  };

  const handleBack = () => {
    tacticalAudio.playRadarPing();
    setProgressSec(0);
    setCurrentStepIdx(prev => (prev > 0 ? prev - 1 : DEMO_STAGES.length - 1));
  };

  const handleRestart = () => {
    tacticalAudio.playRadarPing();
    setProgressSec(0);
    setCurrentStepIdx(0);
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[620px] max-w-[calc(100vw-2rem)] z-50 pointer-events-auto select-none font-mono">
      <div className="bg-[#070B14]/95 backdrop-blur-xl border border-violet-500/70 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 text-slate-200">
        
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping"></span>
            <span className="font-extrabold text-white text-xs tracking-wider">
              ROADGUARD AI · 3-MINUTE INTERACTIVE PLACEMENT DEMO
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-violet-300 font-bold">
              STEP {currentStep.stepIndex} / {DEMO_STAGES.length}
            </span>
            <button
              onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentStepIdx + progressPct / 100) / DEMO_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Title and Narration */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-300 font-black text-[10px] border border-violet-500/40">
              {currentStep.badge}
            </span>
            <span className="font-bold text-white text-xs sm:text-sm">{currentStep.title}</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-sans pt-1">
            {currentStep.narration}
          </p>

          <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{currentStep.actionHint}</span>
          </div>
        </div>

        {/* Bottom Interactive Controls */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isAutoPlaying
                  ? 'bg-violet-600 border-violet-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoPlaying ? 'PAUSE AUTO' : 'AUTO PLAY'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Restart 3-Minute Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBack}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-900/30"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
