import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Sparkles, 
  HardDrive,
  Cpu,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

interface RoadVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DetectedBoundingBox {
  id: string;
  label: string;
  confidence: number;
  category: 'defect' | 'hazard' | 'vehicle' | 'vulnerable';
  severity: 'Critical' | 'High' | 'Moderate';
  box: { topPct: number; leftPct: number; widthPct: number; heightPct: number };
  color: string;
  impactScoreDelta: number;
}

export const RoadVisionModal: React.FC<RoadVisionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeSource, setActiveSource] = useState<'CCTV' | 'DASHCAM' | 'DRONE' | 'UPLOAD'>('CCTV');

  // Sample Computer Vision Detections on NH-44 Feed
  const detections: DetectedBoundingBox[] = [
    {
      id: 'd-1',
      label: 'Deep Asphalt Pothole (0.4m depth)',
      confidence: 94.8,
      category: 'defect',
      severity: 'Critical',
      box: { topPct: 62, leftPct: 34, widthPct: 18, heightPct: 14 },
      color: '#EF4444',
      impactScoreDelta: -16
    },
    {
      id: 'd-2',
      label: 'Surface Waterlogging / Ponding (Monsoon Runoff)',
      confidence: 91.2,
      category: 'hazard',
      severity: 'High',
      box: { topPct: 54, leftPct: 56, widthPct: 24, heightPct: 18 },
      color: '#38BDF8',
      impactScoreDelta: -12
    },
    {
      id: 'd-3',
      label: 'Faded Edge Thermoplastic Line Markings',
      confidence: 88.5,
      category: 'defect',
      severity: 'Moderate',
      box: { topPct: 48, leftPct: 12, widthPct: 10, heightPct: 42 },
      color: '#F59E0B',
      impactScoreDelta: -8
    },
    {
      id: 'd-4',
      label: 'Heavy Multi-Axle Freight Truck (Overloaded)',
      confidence: 97.4,
      category: 'vehicle',
      severity: 'High',
      box: { topPct: 32, leftPct: 42, widthPct: 20, heightPct: 26 },
      color: '#A855F7',
      impactScoreDelta: -6
    },
    {
      id: 'd-5',
      label: 'Pedestrian on Unpaved Shoulder',
      confidence: 89.6,
      category: 'vulnerable',
      severity: 'High',
      box: { topPct: 44, leftPct: 82, widthPct: 8, heightPct: 22 },
      color: '#EC4899',
      impactScoreDelta: -14
    }
  ];

  // Road Health Score
  const roadHealthScore = 63; // 63 / 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-cyan-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-cyan-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Camera className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>ROAD VISION · COMPUTER VISION INSPECTOR</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 font-bold">
                  YOLOv11 & OPENCV
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Automated Infrastructure Defect & Conflict Bounding Box Detection
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

        {/* Source Selector Strip */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['CCTV', 'DASHCAM', 'DRONE', 'UPLOAD'] as const).map(source => (
              <button
                key={source}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  setActiveSource(source);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeSource === source 
                    ? 'bg-cyan-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {source === 'UPLOAD' ? '📁 UPLOAD IMAGE' : `${source} STREAM`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">ROAD HEALTH:</span>
            <span className="font-extrabold text-amber-400">{roadHealthScore} / 100</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Simulated Visual Frame with Bounding Boxes */}
          <div className="relative w-full h-64 sm:h-72 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Background Graphic representing road perspective */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0E1A2B] via-[#0B1522] to-[#060B12]">
              {/* Perspective Road Surface */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />
              
              {/* Converging highway lane lines */}
              <svg className="w-full h-full absolute inset-0 opacity-40">
                <line x1="30%" y1="100%" x2="48%" y2="35%" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="12,12" />
                <line x1="70%" y1="100%" x2="52%" y2="35%" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="12,12" />
                <line x1="50%" y1="100%" x2="50%" y2="35%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8,8" />
              </svg>
            </div>

            {/* Bounding Box Overlays */}
            {detections.map(det => (
              <div
                key={det.id}
                className="absolute border-2 transition-transform hover:scale-105"
                style={{
                  top: `${det.box.topPct}%`,
                  left: `${det.box.leftPct}%`,
                  width: `${det.box.widthPct}%`,
                  height: `${det.box.heightPct}%`,
                  borderColor: det.color,
                  backgroundColor: `${det.color}15`
                }}
              >
                {/* Tag label */}
                <div 
                  className="absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-bold text-black whitespace-nowrap rounded-t"
                  style={{ backgroundColor: det.color }}
                >
                  {det.label.split('(')[0].trim()} · {det.confidence}%
                </div>
              </div>
            ))}

            {/* Top Telemetry Stamp */}
            <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE CAM #44-TN-118 · 1080p 30FPS · YOLOv11 INFERENCE (14ms)</span>
            </div>
          </div>

          {/* Detections Breakdown List */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Detected Surface Anomalies & Hazard Items</span>
              <span className="text-cyan-400">{detections.length} ANOMALIES IDENTIFIED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {detections.map(det => (
                <div key={det.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: det.color }}></span>
                      <span>{det.label}</span>
                    </span>
                    <span className="font-extrabold text-red-400">{det.impactScoreDelta} PTS</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Confidence: <strong className="text-slate-200">{det.confidence}%</strong></span>
                    <span>Severity: <strong className="text-amber-400">{det.severity}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Civil Engineering Repair Directive */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 text-[11px] leading-relaxed flex items-center justify-between">
            <div>
              <div className="font-bold text-cyan-300">RECOMMENDED CIVIL INTERVENTION</div>
              <div>Cold-mix asphalt patch for pothole #d-1 + thermoplastic re-striping restores Road Health to <strong>84/100</strong>.</div>
            </div>
            <button
              onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors cursor-pointer shrink-0"
            >
              Dispatch Ticket
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
