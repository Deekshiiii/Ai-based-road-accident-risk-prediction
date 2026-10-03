import React, { useState, useEffect } from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS, EMERGING_ANOMALIES } from '../data/roadGuardData';
import { tacticalAudio } from '../services/tacticalAudio';
import { 
  Compass, 
  Layers, 
  Flame, 
  AlertTriangle, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';

interface RoadNetworkCanvasProps {
  selectedRoad: RoadSegmentProfile;
  onSelectRoad: (road: RoadSegmentProfile) => void;
  simulatedDelta?: number; // e.g. +12 from scenario simulation
  isSimulatedActive?: boolean;
  onOpenVisionAI?: () => void;
}

export const RoadNetworkCanvas: React.FC<RoadNetworkCanvasProps> = ({
  selectedRoad,
  onSelectRoad,
  simulatedDelta = 0,
  isSimulatedActive = false,
  onOpenVisionAI
}) => {
  const [hoveredRoad, setHoveredRoad] = useState<RoadSegmentProfile | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTrafficParticles, setShowTrafficParticles] = useState<boolean>(true);
  const [showAnomalyRings, setShowAnomalyRings] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 24-Hour Citywide Time Scrubbing Simulation
  const [scrubberHour, setScrubberHour] = useState<number>(19.5); // 19:30 default peak
  const [isPlayingTimeLapse, setIsPlayingTimeLapse] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingTimeLapse) {
      timer = setInterval(() => {
        setScrubberHour(prev => {
          const next = (prev + 0.5) % 24;
          tacticalAudio.playTick();
          return next;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlayingTimeLapse]);

  // Compute time factor: morning 8-10 rush (+4), midday 12-15 lull (-6), evening 18-21 peak (+10), night 22-03 high-speed (+3)
  const computeTimeDelta = (hour: number) => {
    if (hour >= 18 && hour <= 21.5) return 10; // Evening peak
    if (hour >= 8 && hour <= 10.5) return 6; // Morning rush
    if (hour >= 12 && hour <= 15.5) return -6; // Midday lull
    if (hour >= 23 || hour <= 4) return 3; // Nocturnal speeding
    return 0;
  };

  const timeDelta = computeTimeDelta(scrubberHour);

  // Geometric coordinates for digital twin vector roads in a 1000x600 viewBox
  // Map our segments to clean, crisp urban arterial corridors
  const segmentVectorCoordinates: Record<string, { x1: number; y1: number; x2: number; y2: number; cx: number; cy: number; curve?: string }> = {
    'R-204': { x1: 220, y1: 260, x2: 680, y2: 240, cx: 450, cy: 250, curve: 'M 220 260 Q 440 230 680 240' },
    'R-102': { x1: 680, y1: 240, x2: 890, y2: 460, cx: 800, cy: 340, curve: 'M 680 240 C 780 250 820 400 890 460' }, // S-curve
    'R-101': { x1: 450, y1: 120, x2: 450, y2: 480, cx: 450, cy: 250, curve: 'M 450 120 L 450 480' }, // Central Spine
    'R-103': { x1: 450, y1: 480, x2: 850, y2: 520, cx: 650, cy: 500, curve: 'M 450 480 Q 640 540 850 520' }, // Southern Tech Corridor
    'R-118': { x1: 120, y1: 140, x2: 220, y2: 260, cx: 170, cy: 200, curve: 'M 120 140 L 220 260' }, // Logistics Bypass
    'R-104': { x1: 220, y1: 260, x2: 340, y2: 490, cx: 280, cy: 375, curve: 'M 220 260 L 340 490' }, // Ring Interchange
    'R-106': { x1: 850, y1: 520, x2: 950, y2: 320, cx: 910, cy: 410, curve: 'M 850 520 C 920 480 970 380 950 320' }, // Coast Bend
    'R-105': { x1: 340, y1: 490, x2: 450, y2: 480, cx: 395, cy: 485, curve: 'M 340 490 L 450 480' },
    'R-107': { x1: 450, y1: 250, x2: 620, y2: 150, cx: 535, cy: 200, curve: 'M 450 250 L 620 150' },
    'R-108': { x1: 320, y1: 140, x2: 450, y2: 120, cx: 385, cy: 130, curve: 'M 320 140 L 450 120' },
    'R-109': { x1: 450, y1: 480, x2: 320, y2: 560, cx: 385, cy: 520, curve: 'M 450 480 L 320 560' }
  };

  const intersections = [
    { id: 'INT-01', x: 220, y: 260, name: 'West Gate Cloverleaf' },
    { id: 'INT-02', x: 450, y: 250, name: 'Central Kathipara Grade Separator' },
    { id: 'INT-03', x: 680, y: 240, name: 'East Spine Interchange' },
    { id: 'INT-04', x: 450, y: 480, name: 'Southern Hub Junction' },
    { id: 'INT-05', x: 850, y: 520, name: 'Coastlink Confluence' },
    { id: 'INT-06', x: 340, y: 490, name: 'Industrial Outer Ring' }
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] min-h-[580px] bg-[#F8F7F4] digital-twin-grid digital-twin-subgrid overflow-hidden flex flex-col justify-between select-none">
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
        <div className="bg-[#1C1E21] text-[#F8F7F4] px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
          <span className="font-bold">URBAN DIGITAL TWIN</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">{ROAD_SEGMENTS.length} ACTIVE CORRIDORS</span>
        </div>

        {isSimulatedActive && (
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>SCENARIO ACTIVE: {simulatedDelta > 0 ? `+${simulatedDelta}` : simulatedDelta} PTS NET RISK SHIFT</span>
          </div>
        )}
      </div>

      {/* Top Right Canvas Mode Toggles */}
      <div className="absolute top-4 right-6 z-20 flex flex-wrap items-center gap-2 text-xs">
        {onOpenVisionAI && (
          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              onOpenVisionAI();
            }}
            className="px-3 py-1.5 rounded-md font-mono transition-all border bg-violet-100/90 text-violet-900 border-violet-300 hover:bg-violet-200 flex items-center gap-1.5 cursor-pointer shadow-xs font-bold"
            title="Open Live CCTV Computer Vision Hazard Stream"
          >
            <Camera className="w-3.5 h-3.5 text-violet-700" />
            <span>CCTV Vision AI</span>
          </button>
        )}

        <button
          onClick={() => setShowTrafficParticles(!showTrafficParticles)}
          className={`px-3 py-1.5 rounded-md font-mono transition-all border cursor-pointer ${
            showTrafficParticles 
              ? 'bg-[#1C1E21] text-[#F8F7F4] border-[#1C1E21]' 
              : 'bg-[#F8F7F4] text-zinc-600 border-zinc-300'
          }`}
        >
          Flow Vectors: {showTrafficParticles ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => setShowAnomalyRings(!showAnomalyRings)}
          className={`px-3 py-1.5 rounded-md font-mono transition-all border cursor-pointer ${
            showAnomalyRings 
              ? 'bg-red-900/10 text-red-700 border-red-300' 
              : 'bg-[#F8F7F4] text-zinc-600 border-zinc-300'
          }`}
        >
          Anomalies ({EMERGING_ANOMALIES.length})
        </button>

        {/* Audio Radar Ping Toggle */}
        <button
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            tacticalAudio.setMuted(next);
            if (!next) tacticalAudio.playRadarPing();
          }}
          className="p-1.5 rounded-md border border-zinc-300 bg-white text-zinc-700 hover:text-black cursor-pointer"
          title={isMuted ? 'Unmute Tactical Radar Pings' : 'Mute Tactical Radar Pings'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-violet-700" />}
        </button>

        <div className="flex items-center bg-[#F8F7F4] border border-zinc-300 rounded-md p-0.5">
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1 text-zinc-700 hover:text-black cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
            className="p-1 text-zinc-700 hover:text-black cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-zinc-700 hover:text-black cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Vector Road Network SVG */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <svg
          viewBox="0 0 1000 620"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredRoad(null)}
          className="w-full h-full max-h-[640px] transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Electric Violet Radial Aura for Selected Road */}
            <filter id="violetGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.45" />
            </filter>

            {/* Red Pulse Glow for Critical Anomaly */}
            <filter id="anomalyGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#DC2626" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background Topographic Rings & Secondary Grid Lines */}
          <g opacity="0.18">
            <circle cx="450" cy="250" r="160" fill="none" stroke="#2B2E33" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="450" cy="250" r="280" fill="none" stroke="#2B2E33" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="800" cy="340" r="110" fill="none" stroke="#2B2E33" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Grid coordinates labels */}
            <text x="50" y="590" className="text-[10px] font-mono fill-zinc-500 font-bold">GRID LOC 13.04°N 80.20°E</text>
            <text x="860" y="590" className="text-[10px] font-mono fill-zinc-500 font-bold">METRO SECTOR 04</text>
          </g>

          {/* Secondary Minor Connector Streets (Faded Charcoal Lines) */}
          <g stroke="#D4D0C8" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <line x1="120" y1="260" x2="220" y2="260" />
            <line x1="220" y1="120" x2="320" y2="140" />
            <line x1="680" y1="240" x2="800" y2="160" />
            <line x1="800" y1="160" x2="950" y2="220" />
            <line x1="340" y1="490" x2="260" y2="560" />
            <line x1="620" y1="150" x2="740" y2="110" />
          </g>

          {/* Primary Road Corridors Base Layer (Dark Charcoal) */}
          {ROAD_SEGMENTS.map(seg => {
            const coords = segmentVectorCoordinates[seg.id];
            if (!coords) return null;
            const isSelected = selectedRoad.id === seg.id;
            const isHovered = hoveredRoad?.id === seg.id;

            return (
              <g key={`base-${seg.id}`}>
                {/* Thick road bed */}
                <path
                  d={coords.curve}
                  fill="none"
                  stroke="#1C1E21"
                  strokeWidth={isSelected ? "14" : isHovered ? "12" : "9"}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />

                {/* Road center asphalt */}
                <path
                  d={coords.curve}
                  fill="none"
                  stroke="#27272A"
                  strokeWidth={isSelected ? "10" : isHovered ? "8" : "6"}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Interactive Risk State Color Layer */}
          {ROAD_SEGMENTS.map(seg => {
            const coords = segmentVectorCoordinates[seg.id];
            if (!coords) return null;
            const isSelected = selectedRoad.id === seg.id;
            const isHovered = hoveredRoad?.id === seg.id;

            // Calculate adjusted score if simulation scenario is running and time lapse is active
            let effectiveScore = seg.currentRiskScore + timeDelta;
            if (isSimulatedActive && isSelected) {
              effectiveScore += simulatedDelta;
            }
            effectiveScore = Math.min(99, Math.max(10, Math.round(effectiveScore)));

            // Risk State Colors per Prompt:
            // 🟢 SAFE: Muted Mint (#10B981)
            // 🟡 ELEVATED: Warm Amber (#F59E0B)
            // 🟠 HIGH: Coral (#F97316)
            // 🔴 CRITICAL: Deep Red (#DC2626)
            let riskColor = '#10B981'; // Safe
            if (effectiveScore >= 80) riskColor = '#DC2626'; // Critical
            else if (effectiveScore >= 60) riskColor = '#F97316'; // High
            else if (effectiveScore >= 40) riskColor = '#F59E0B'; // Elevated

            // If selected, override with Electric Violet Aura (#7C3AED)
            const strokeColor = isSelected ? '#7C3AED' : riskColor;

            return (
              <g 
                key={`interactive-${seg.id}`}
                className="cursor-pointer group"
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  onSelectRoad(seg);
                }}
                onMouseEnter={() => setHoveredRoad(seg)}
              >
                {/* Invisible wide hit area for easy hover / click */}
                <path
                  d={coords.curve}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="28"
                  strokeLinecap="round"
                />

                {/* Electric Violet Aura if Selected */}
                {isSelected && (
                  <path
                    d={coords.curve}
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="16"
                    strokeLinecap="round"
                    filter="url(#violetGlow)"
                    opacity="0.8"
                  />
                )}

                {/* Colored Risk Core Line */}
                <path
                  d={coords.curve}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? "6" : isHovered ? "5" : "3.5"}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />

                {/* Animated Directional Traffic Flow Particles */}
                {showTrafficParticles && (
                  <path
                    d={coords.curve}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="traffic-flow-line opacity-80 pointer-events-none"
                  />
                )}

                {/* Segment Identifier Tag at Center */}
                <g transform={`translate(${coords.cx}, ${coords.cy})`} className="pointer-events-none">
                  <circle
                    r={isSelected ? "9" : "7"}
                    fill={isSelected ? "#7C3AED" : "#1C1E21"}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    textAnchor="middle"
                    dy="3"
                    className="text-[8px] font-mono font-black fill-white pointer-events-none"
                  >
                    {seg.id.split('-')[1]}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Intersections Nodes (Geometric Digital Twin Circles) */}
          {intersections.map(int => (
            <g key={int.id} transform={`translate(${int.x}, ${int.y})`}>
              <circle r="9" fill="#1C1E21" stroke="#F8F7F4" strokeWidth="2" />
              <circle r="4" fill="#E6E3DC" />
            </g>
          ))}

          {/* Emerging Anomaly Pulsing Radar Nodes (Section 3 & 7) */}
          {showAnomalyRings && EMERGING_ANOMALIES.map((anom, idx) => {
            const seg = ROAD_SEGMENTS.find(s => s.id === anom.segmentId);
            if (!seg) return null;
            const coords = segmentVectorCoordinates[seg.id];
            if (!coords) return null;

            return (
              <g key={anom.id} transform={`translate(${coords.cx + (idx * 12 - 6)}, ${coords.cy - 16})`}>
                <circle
                  r="14"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                  className="animate-ping opacity-60"
                />
                <circle
                  r="7"
                  fill="#DC2626"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  filter="url(#anomalyGlow)"
                />
                <text
                  x="12"
                  y="4"
                  className="text-[9px] font-mono font-bold fill-red-700 bg-white"
                >
                  ⚠️ {anom.deviationZScore}σ
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Card (Section 3 Contract) */}
      {hoveredRoad && (
        <div
          className="absolute z-30 pointer-events-none bg-[#1C1E21] text-[#F8F7F4] border border-zinc-700 rounded-lg p-3 text-xs shadow-2xl space-y-1.5 w-60 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${Math.min(window.innerWidth - 260, Math.max(140, mousePos.x))}px`,
            top: `${Math.max(80, mousePos.y - 15)}px`
          }}
        >
          <div className="flex items-center justify-between pb-1 border-b border-zinc-700">
            <span className="font-mono font-bold text-violet-400 uppercase text-[11px]">ROAD {hoveredRoad.id}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{hoveredRoad.roadType}</span>
          </div>

          <div className="flex justify-between items-baseline pt-0.5">
            <span className="text-zinc-400 text-[10px] uppercase">Risk Score</span>
            <span className="text-lg font-black font-mono text-coral-400 text-[#F97316]">
              {hoveredRoad.currentRiskScore} <span className="text-xs font-normal text-zinc-500">/ 100</span>
            </span>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400">Status:</span>
            <span className={`font-bold ${
              hoveredRoad.currentRiskScore >= 80 ? 'text-red-400' :
              hoveredRoad.currentRiskScore >= 60 ? 'text-orange-400' : 'text-amber-400'
            }`}>
              {hoveredRoad.riskCategory.toUpperCase()} RISK
            </span>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400">Peak Risk:</span>
            <span className="font-mono text-zinc-200">{hoveredRoad.peakRiskPeriod}</span>
          </div>

          <div className="pt-1.5 border-t border-zinc-700/80 text-[10px] text-violet-300 font-mono font-semibold flex items-center justify-between">
            <span>Click to inspect</span>
            <span>&rarr;</span>
          </div>
        </div>
      )}

      {/* 24-Hour Citywide Digital Twin Time-Lapse Scrubber Bar */}
      <div className="bg-white/95 backdrop-blur-xs border-t border-[#E6E3DC] px-6 py-2.5 z-20 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              setIsPlayingTimeLapse(!isPlayingTimeLapse);
            }}
            className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              isPlayingTimeLapse
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-[#1C1E21] hover:bg-zinc-800 text-white shadow-xs'
            }`}
          >
            {isPlayingTimeLapse ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlayingTimeLapse ? 'PAUSE TIME-LAPSE' : 'PLAY 24H TIME-LAPSE'}</span>
          </button>

          <div className="flex items-baseline gap-1.5 text-zinc-900 font-bold bg-[#FAF9F6] px-2.5 py-1 rounded border border-[#E6E3DC]">
            <Clock className="w-3.5 h-3.5 text-violet-600 self-center" />
            <span className="text-sm">
              {Math.floor(scrubberHour).toString().padStart(2, '0')}:
              {((scrubberHour % 1) * 60 === 0 ? '00' : '30')}
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">IST</span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase hidden sm:inline ${
            timeDelta > 0 ? 'bg-coral-100 text-red-800' :
            timeDelta < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-700'
          }`}>
            {timeDelta > 0 ? `+${timeDelta} pts Peak Shift` : timeDelta < 0 ? `${timeDelta} pts Lull Discount` : 'Baseline Standard'}
          </span>
        </div>

        {/* Scrubber Range Slider & Presets */}
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <input
            type="range"
            min="0"
            max="23.5"
            step="0.5"
            value={scrubberHour}
            onChange={e => {
              tacticalAudio.playTick();
              setScrubberHour(parseFloat(e.target.value));
            }}
            className="w-full accent-violet-600 cursor-pointer"
          />

          <div className="flex items-center gap-1 shrink-0 text-[10px]">
            <button
              onClick={() => { tacticalAudio.playTick(); setScrubberHour(8.5); }}
              className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
              title="Morning Rush 08:30"
            >
              08:30
            </button>
            <button
              onClick={() => { tacticalAudio.playTick(); setScrubberHour(13); }}
              className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
              title="Midday Lull 13:00"
            >
              13:00
            </button>
            <button
              onClick={() => { tacticalAudio.playTick(); setScrubberHour(19.5); }}
              className="px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 font-bold hover:bg-violet-200 cursor-pointer"
              title="Evening Peak 19:30"
            >
              19:30
            </button>
            <button
              onClick={() => { tacticalAudio.playTick(); setScrubberHour(2); }}
              className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
              title="Midnight Speeding 02:00"
            >
              02:00
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status & Color Matrix Bar */}
      <div className="bg-[#F8F7F4]/95 border-t border-[#E6E3DC] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-5">
          <span className="text-zinc-500 font-semibold uppercase text-[10px]">RISK MATRIX:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span className="text-zinc-700 font-medium">SAFE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-zinc-700 font-medium">ELEVATED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
            <span className="text-zinc-700 font-medium">HIGH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
            <span className="text-zinc-700 font-medium">CRITICAL</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-600 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            <span>Selected: <strong>{selectedRoad.id} ({selectedRoad.name})</strong></span>
          </span>
        </div>
      </div>

    </div>
  );
};
