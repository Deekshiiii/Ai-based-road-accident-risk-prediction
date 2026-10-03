import React, { useState, useEffect } from 'react';
import { X, Camera, Eye, ShieldAlert, Sparkles, Activity, AlertTriangle, Play, Pause, RefreshCw, ZoomIn } from 'lucide-react';
import { RoadSegmentProfile } from '../types/accident';
import { tacticalAudio } from '../services/tacticalAudio';

interface VisionAICameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegmentProfile;
}

export const VisionAICameraModal: React.FC<VisionAICameraModalProps> = ({
  isOpen,
  onClose,
  selectedRoad
}) => {
  const [activeCamIndex, setActiveCamIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [confidenceVariance, setConfidenceVariance] = useState<number>(0);

  const cameras = [
    {
      id: 'CAM-04-NW',
      name: `${selectedRoad.id} Approach Cam #1`,
      location: `${selectedRoad.name} - Inbound Flyover Ramp`,
      resolution: '4K 60FPS HEVC',
      latency: '24ms',
      detections: [
        { label: 'Heavy Axle Truck (Speed: 78 km/h)', bbox: { top: '35%', left: '22%', width: '130px', height: '90px' }, alert: true, conf: 0.94, tag: 'SPEEDING (+18 km/h)' },
        { label: 'Compact Sedan (Speed: 58 km/h)', bbox: { top: '48%', left: '55%', width: '100px', height: '70px' }, alert: false, conf: 0.98, tag: 'IN-LANE' },
        { label: 'Wet Asphalt Friction Film', bbox: { top: '72%', left: '15%', width: '220px', height: '45px' }, alert: true, conf: 0.91, tag: 'SKID VULNERABILITY' }
      ]
    },
    {
      id: 'CAM-09-SE',
      name: `${selectedRoad.id} Mid-Span Weave Cam #2`,
      location: `${selectedRoad.name} - Grade Separator Weave Zone`,
      resolution: '4K 60FPS HEVC',
      latency: '19ms',
      detections: [
        { label: 'Abrupt Lane Deviation (Lateral: 3.2 m/s)', bbox: { top: '40%', left: '38%', width: '110px', height: '80px' }, alert: true, conf: 0.92, tag: 'ERRATIC WEAVE' },
        { label: 'Braking Cascade Shockwave', bbox: { top: '55%', left: '60%', width: '140px', height: '65px' }, alert: true, conf: 0.88, tag: 'DECELERATION WAVE' }
      ]
    }
  ];

  useEffect(() => {
    if (!isOpen || !isScanning) return;
    const interval = setInterval(() => {
      setConfidenceVariance(Math.sin(Date.now() / 800) * 0.03);
    }, 500);
    return () => clearInterval(interval);
  }, [isOpen, isScanning]);

  if (!isOpen) return null;

  const currentCam = cameras[activeCamIndex] || cameras[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#111315] border border-zinc-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden font-mono text-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800 bg-[#16181B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-violet-900/60 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold text-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  EDGE VISION AI — REAL-TIME CCTV HAZARD SCANNER
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-400 font-bold">LIVE STREAM</span>
              </div>
              <span className="text-[10px] text-zinc-400">
                Segment: {selectedRoad.id} ({selectedRoad.name}) · Latency: {currentCam.latency}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setIsScanning(!isScanning);
              }}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isScanning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isScanning ? 'PAUSE AI' : 'RESUME'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Simulation Area */}
        <div className="relative w-full h-[380px] bg-[#0A0B0D] overflow-hidden select-none flex items-center justify-center border-b border-zinc-800">
          
          {/* Simulated CCTV Background Environment */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-900/40 to-black/90 pointer-events-none" />
          
          {/* Simulated road perspective lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 400">
            <line x1="200" y1="400" x2="380" y2="150" stroke="#71717A" strokeWidth="2" strokeDasharray="12 8" />
            <line x1="420" y1="150" x2="600" y2="400" stroke="#71717A" strokeWidth="2" strokeDasharray="12 8" />
            <line x1="400" y1="150" x2="400" y2="400" stroke="#E4E4E7" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="120" y1="400" x2="350" y2="150" stroke="#3F3F46" strokeWidth="4" />
            <line x1="680" y1="400" x2="450" y2="150" stroke="#3F3F46" strokeWidth="4" />
          </svg>

          {/* CCTV Grid & Crosshairs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-6 text-[10px] text-zinc-500 font-mono space-y-0.5">
              <div>REC ● [00:14:32:19]</div>
              <div>ISO 400 · 1/250s · f/2.8</div>
              <div>COORDS: {selectedRoad.startLat.toFixed(4)}°N, {selectedRoad.startLng.toFixed(4)}°E</div>
            </div>

            <div className="absolute top-4 right-6 text-[10px] text-zinc-500 font-mono text-right space-y-0.5">
              <div className="text-violet-400 font-bold">YOLO-v9 TRANSPORT MODEL</div>
              <div>DETECTIONS: {currentCam.detections.length} ACTIVE</div>
              <div>INFERENCE: 14.8ms</div>
            </div>

            {/* Target Crosshair in center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-40">
              <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 -translate-y-1/2" />
              <div className="h-full w-0.5 bg-emerald-400 absolute left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Animated Computer Vision Bounding Boxes */}
          {currentCam.detections.map((d, i) => (
            <div
              key={i}
              className={`absolute transition-all duration-300 pointer-events-auto group cursor-crosshair rounded-xs ${
                d.alert
                  ? 'border-2 border-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'border-2 border-emerald-400 bg-emerald-400/10 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              }`}
              style={{
                top: d.bbox.top,
                left: d.bbox.left,
                width: d.bbox.width,
                height: d.bbox.height
              }}
            >
              {/* Corner Reticles */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

              {/* Tag Header */}
              <div className={`absolute -top-6 left-0 px-1.5 py-0.5 text-[9px] font-bold rounded-t whitespace-nowrap flex items-center gap-1 ${
                d.alert ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                <span>{d.tag}</span>
                <span className="opacity-80">({((d.conf + confidenceVariance) * 100).toFixed(0)}%)</span>
              </div>

              {/* Detail label below on hover */}
              <div className="absolute -bottom-6 left-0 text-[9px] text-zinc-300 whitespace-nowrap bg-black/80 px-1 py-0.5 rounded">
                {d.label}
              </div>
            </div>
          ))}

        </div>

        {/* Bottom Camera Selector & Analytics Footer */}
        <div className="p-4 bg-[#16181B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 uppercase font-bold">ACTIVE ANGLE:</span>
            {cameras.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  tacticalAudio.playTick();
                  setActiveCamIndex(idx);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                  activeCamIndex === idx
                    ? 'bg-violet-600 text-white font-bold shadow-xs'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {c.id} ({c.name})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span>Model: <strong>Edge AI TensorRT</strong></span>
            <span>·</span>
            <span>Zero-packet loss</span>
          </div>

        </div>

      </div>
    </div>
  );
};
