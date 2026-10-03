import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  INDIA_COASTLINE_CONTOUR, 
  INDIAN_STATES, 
  HIGHWAY_CORRIDORS, 
  METRO_HUBS, 
  AI_BLACKSPOTS, 
  EMERGENCY_FACILITIES,
  HighwayCorridor,
  IndianState,
  MetroHub,
  BlackspotCluster,
  EmergencyAsset
} from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Sun, 
  CloudFog, 
  Layers, 
  ShieldAlert, 
  Crosshair,
  Compass,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';

export type CameraViewMode = 'MAP' | 'SATELLITE' | '3D ISOMETRIC' | 'AERIAL' | 'ROAD VISION';
export type ZoomHierarchy = 'INDIA' | 'STATE' | 'DISTRICT' | 'CITY' | 'HIGHWAY' | 'SEGMENT' | 'INTERSECTION';

interface IndiaDigitalTwinCanvasProps {
  selectedHighway: HighwayCorridor;
  onSelectHighway: (highway: HighwayCorridor) => void;
  selectedState: IndianState | null;
  onSelectState: (state: IndianState | null) => void;
  selectedMetro: MetroHub | null;
  onSelectMetro: (metro: MetroHub | null) => void;
  selectedBlackspot: BlackspotCluster | null;
  onSelectBlackspot: (blackspot: BlackspotCluster | null) => void;
  viewMode: CameraViewMode;
  setViewMode: (mode: CameraViewMode) => void;
  weatherOverlay: 'clear' | 'monsoon' | 'fog';
  setWeatherOverlay: (weather: 'clear' | 'monsoon' | 'fog') => void;
  futureTimeOffsetHours: number;
  scenarioDelta: number;
  isEmergencyMode: boolean;
  isRiskPropagationActive: boolean;
  onOpenForensics: () => void;
  onOpenNearMiss: () => void;
  onOpenIntersection: () => void;
}

interface Particle {
  id: string;
  highwayId: string;
  segmentIdx: number;
  t: number; // 0..1 along segment
  speed: number;
  color: string;
  laneOffset: number;
  type: 'car' | 'truck' | 'bus' | 'emergency';
}

interface RainParticle {
  x: number;
  y: number;
  speed: number;
  len: number;
  opacity: number;
}

export const IndiaDigitalTwinCanvas: React.FC<IndiaDigitalTwinCanvasProps> = ({
  selectedHighway,
  onSelectHighway,
  selectedState,
  onSelectState,
  selectedMetro,
  onSelectMetro,
  selectedBlackspot,
  onSelectBlackspot,
  viewMode,
  setViewMode,
  weatherOverlay,
  setWeatherOverlay,
  futureTimeOffsetHours,
  scenarioDelta,
  isEmergencyMode,
  isRiskPropagationActive,
  onOpenForensics,
  onOpenNearMiss,
  onOpenIntersection
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera & Viewport Transformation (Pan & Zoom)
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Vehicle Simulation State
  const vehiclesRef = useRef<Particle[]>([]);
  // Weather particles
  const rainParticlesRef = useRef<RainParticle[]>([]);

  // Calculate Zoom Hierarchy
  const currentHierarchy: ZoomHierarchy = useMemo(() => {
    if (zoom < 1.35) return 'INDIA';
    if (zoom < 2.2) return 'STATE';
    if (zoom < 3.2) return 'CITY';
    if (zoom < 4.5) return 'HIGHWAY';
    if (zoom < 6.0) return 'SEGMENT';
    return 'INTERSECTION';
  }, [zoom]);

  // Aggregate National Risk Index
  const nationalRiskIndex = useMemo(() => {
    const base = 68;
    const delta = scenarioDelta;
    const weatherImpact = weatherOverlay === 'monsoon' ? 12 : (weatherOverlay === 'fog' ? 9 : 0);
    const timeImpact = futureTimeOffsetHours > 0 ? Math.min(20, futureTimeOffsetHours * 3.5) : 0;
    return Math.min(99, Math.max(15, Math.round(base + delta + weatherImpact + timeImpact)));
  }, [scenarioDelta, weatherOverlay, futureTimeOffsetHours]);

  // Selected Region's Aggregate Risk Index for City-Wide Risk Pulse
  const selectedRegionRisk = useMemo(() => {
    const raw = selectedState 
      ? selectedState.riskIndex 
      : (selectedHighway.riskScore + scenarioDelta);
    return Math.min(99, Math.max(15, Math.round(raw)));
  }, [selectedState, selectedHighway, scenarioDelta]);

  // Initialize Traffic Particles along Highway routes
  useEffect(() => {
    const list: Particle[] = [];
    const colors = ['#E2E8F0', '#94A3B8', '#38BDF8', '#F59E0B', '#EF4444', '#10B981', '#A855F7'];

    HIGHWAY_CORRIDORS.forEach((hwy) => {
      // 10 to 18 vehicles per highway
      const count = Math.round(12 * (hwy.trafficDensityScore / 60));
      for (let i = 0; i < count; i++) {
        const isEmergency = isEmergencyMode && hwy.code === 'NH-44' && i === 0;
        list.push({
          id: `veh-${hwy.id}-${i}`,
          highwayId: hwy.id,
          segmentIdx: 0,
          t: Math.random(),
          speed: isEmergency ? 0.0035 : 0.0008 + Math.random() * 0.0016,
          color: isEmergency ? '#EF4444' : colors[i % colors.length],
          laneOffset: (Math.random() - 0.5) * 6,
          type: isEmergency ? 'emergency' : (i % 4 === 0 ? 'truck' : (i % 7 === 0 ? 'bus' : 'car'))
        });
      }
    });

    vehiclesRef.current = list;

    // Initialize Rain Particles
    const rain: RainParticle[] = [];
    for (let i = 0; i < 180; i++) {
      rain.push({
        x: Math.random() * 1200,
        y: Math.random() * 1000,
        speed: 12 + Math.random() * 14,
        len: 15 + Math.random() * 20,
        opacity: 0.15 + Math.random() * 0.4
      });
    }
    rainParticlesRef.current = rain;
  }, [isEmergencyMode]);

  // Focus Camera on specific location
  const focusOnPoint = useCallback((worldX: number, worldY: number, targetZoom: number = 2.4) => {
    setZoom(targetZoom);
    // Center worldX, worldY
    setPan({
      x: (500 - worldX) * targetZoom,
      y: (550 - worldY) * targetZoom
    });
    tacticalAudio.playRadarPing();
  }, []);

  // Sync focus if selected highway changes
  useEffect(() => {
    if (selectedHighway.waypoints.length > 0) {
      const midWp = selectedHighway.waypoints[Math.floor(selectedHighway.waypoints.length / 2)];
      if (zoom < 1.8) {
        focusOnPoint(midWp.x, midWp.y, 2.3);
      }
    }
  }, [selectedHighway, focusOnPoint, zoom]);

  // Color mapping based on risk score
  const getRiskColor = (score: number, alpha: number = 1): string => {
    if (score >= 80) return `rgba(239, 68, 68, ${alpha})`; // Red Critical
    if (score >= 65) return `rgba(249, 115, 22, ${alpha})`; // Orange High
    if (score >= 45) return `rgba(245, 158, 11, ${alpha})`; // Yellow Moderate
    return `rgba(16, 185, 129, ${alpha})`; // Green Safe
  };

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Clear with Deep Midnight Navy
      ctx.fillStyle = viewMode === 'SATELLITE' ? '#060B12' : '#070B14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply Camera Center + Pan + Zoom
      ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
      ctx.scale(zoom, zoom);
      
      // If 3D Isometric or Aerial Drone perspective, apply slight isometric shear/tilt
      if (viewMode === '3D ISOMETRIC' || viewMode === 'AERIAL') {
        ctx.transform(1, 0, -0.08, 0.94, 0, 0);
      }

      ctx.translate(-500, -550); // Center around India's midpoint (approx Nagpur/Bhopal center)

      const timeSec = performance.now() / 1000;

      // -------------------------------------------------------------
      // 1. CITY-WIDE / REGIONAL RISK PULSE (Low-Frequency City Breathing Animation)
      // Modulates in opacity based on the currently selected region's aggregate risk index
      // -------------------------------------------------------------
      const focalX = selectedState?.center.x || (selectedHighway.waypoints[0]?.x || 480);
      const focalY = selectedState?.center.y || (selectedHighway.waypoints[0]?.y || 580);
      const rawRegionRisk = selectedState ? selectedState.riskIndex : (selectedHighway.riskScore + scenarioDelta);
      const normalizedRegionRisk = Math.min(99, Math.max(15, rawRegionRisk));

      // Low-frequency harmonic sine oscillation (~0.35 Hz breathing cycle)
      const breathingPulse = 0.5 + 0.5 * Math.sin(timeSec * 2.2);
      // Opacity directly modulated by the currently selected region's aggregate risk index
      const cityPulseOpacity = (normalizedRegionRisk / 100) * 0.22 + breathingPulse * ((normalizedRegionRisk / 100) * 0.18);

      const cityPulseGrad = ctx.createRadialGradient(focalX, focalY, 30, focalX, focalY, 480);
      if (normalizedRegionRisk >= 75) {
        cityPulseGrad.addColorStop(0, `rgba(239, 68, 68, ${cityPulseOpacity * 1.5})`);
        cityPulseGrad.addColorStop(0.35, `rgba(220, 38, 38, ${cityPulseOpacity * 0.75})`);
        cityPulseGrad.addColorStop(0.75, `rgba(185, 28, 28, ${cityPulseOpacity * 0.2})`);
        cityPulseGrad.addColorStop(1, 'rgba(7, 11, 20, 0)');
      } else if (normalizedRegionRisk >= 55) {
        cityPulseGrad.addColorStop(0, `rgba(249, 115, 22, ${cityPulseOpacity * 1.3})`);
        cityPulseGrad.addColorStop(0.35, `rgba(217, 119, 6, ${cityPulseOpacity * 0.65})`);
        cityPulseGrad.addColorStop(0.75, `rgba(180, 83, 9, ${cityPulseOpacity * 0.15})`);
        cityPulseGrad.addColorStop(1, 'rgba(7, 11, 20, 0)');
      } else {
        cityPulseGrad.addColorStop(0, `rgba(16, 185, 129, ${cityPulseOpacity * 1.1})`);
        cityPulseGrad.addColorStop(0.35, `rgba(5, 150, 105, ${cityPulseOpacity * 0.55})`);
        cityPulseGrad.addColorStop(0.75, `rgba(4, 120, 87, ${cityPulseOpacity * 0.12})`);
        cityPulseGrad.addColorStop(1, 'rgba(7, 11, 20, 0)');
      }

      ctx.save();
      ctx.fillStyle = cityPulseGrad;
      ctx.beginPath();
      ctx.arc(focalX, focalY, 520, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Breathing Wavefront Shockwave Rings (Dual continuous phase wave)
      const waveCycle1 = (timeSec * 0.35) % 1; // 0 to 1
      const waveRadius1 = 60 + waveCycle1 * 440;
      const waveAlpha1 = (1 - waveCycle1) * (normalizedRegionRisk / 100) * 0.38;

      const waveCycle2 = (timeSec * 0.35 + 0.5) % 1; // 0.5 phase offset for continuous breathing flow
      const waveRadius2 = 60 + waveCycle2 * 440;
      const waveAlpha2 = (1 - waveCycle2) * (normalizedRegionRisk / 100) * 0.28;

      const strokeRgb = normalizedRegionRisk >= 75 
        ? '239, 68, 68' 
        : (normalizedRegionRisk >= 55 ? '249, 115, 22' : '16, 185, 129');

      ctx.lineWidth = 1.8;
      ctx.setLineDash([8, 12]);
      
      // Wave 1
      ctx.strokeStyle = `rgba(${strokeRgb}, ${waveAlpha1})`;
      ctx.beginPath();
      ctx.arc(focalX, focalY, waveRadius1, 0, Math.PI * 2);
      ctx.stroke();

      // Wave 2
      ctx.strokeStyle = `rgba(${strokeRgb}, ${waveAlpha2})`;
      ctx.beginPath();
      ctx.arc(focalX, focalY, waveRadius2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.restore();

      // -------------------------------------------------------------
      // 2. INDIA CONTINENTAL LANDMASS & SATELLITE TERRAIN RELIEF
      // -------------------------------------------------------------
      ctx.save();
      ctx.beginPath();
      INDIA_COASTLINE_CONTOUR.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();

      // Terrain Fill
      if (viewMode === 'SATELLITE') {
        const satGrad = ctx.createLinearGradient(300, 100, 600, 900);
        satGrad.addColorStop(0, '#101C2B'); // Northern plains / Himalayas
        satGrad.addColorStop(0.35, '#0E1726'); // Central plateau
        satGrad.addColorStop(0.7, '#0C1B26'); // Deccan plateau
        satGrad.addColorStop(1, '#0A1520'); // Southern peninsular
        ctx.fillStyle = satGrad;
      } else {
        ctx.fillStyle = '#0B1323';
      }
      ctx.fill();

      // Subtle Outer Edge Glow
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Continental Grid Overlay
      ctx.save();
      ctx.strokeStyle = '#0F1A2E';
      ctx.lineWidth = 0.5;
      for (let gx = 150; gx <= 900; gx += 50) {
        ctx.beginPath();
        ctx.moveTo(gx, 50);
        ctx.lineTo(gx, 1020);
        ctx.stroke();
      }
      for (let gy = 50; gy <= 1020; gy += 50) {
        ctx.beginPath();
        ctx.moveTo(150, gy);
        ctx.lineTo(900, gy);
        ctx.stroke();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 3. STATE BOUNDARIES & PROVINCIAL RISK FIELD
      // -------------------------------------------------------------
      INDIAN_STATES.forEach(st => {
        const isSelectedState = selectedState?.id === st.id;
        ctx.save();
        ctx.beginPath();
        st.polygon.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();

        // Fill with subtle risk state tint
        if (isSelectedState) {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.18)';
          ctx.strokeStyle = '#8B5CF6';
          ctx.lineWidth = 2.0;
        } else {
          ctx.fillStyle = st.riskIndex >= 75 
            ? 'rgba(239, 68, 68, 0.04)' 
            : (st.riskIndex >= 65 ? 'rgba(249, 115, 22, 0.03)' : 'rgba(16, 185, 129, 0.02)');
          ctx.strokeStyle = '#1E2C44';
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 4]);
        }
        ctx.fill();
        ctx.stroke();

        // State Center Label (Visible when zoom >= 1.2)
        if (zoom >= 1.25) {
          ctx.font = '10px monospace';
          ctx.fillStyle = isSelectedState ? '#A78BFA' : '#64748B';
          ctx.fillText(st.name, st.center.x - 24, st.center.y);
          ctx.font = '9px monospace';
          ctx.fillStyle = getRiskColor(st.riskIndex, 0.85);
          ctx.fillText(`RISK ${st.riskIndex}`, st.center.x - 16, st.center.y + 12);
        }
        ctx.restore();
      });

      // -------------------------------------------------------------
      // 4. RISK PROPAGATION & CORRIDOR FIELD GLOW (Dynamic AI Risk Waves)
      // -------------------------------------------------------------
      HIGHWAY_CORRIDORS.forEach(hwy => {
        const isSel = selectedHighway.id === hwy.id;
        let effectiveRisk = hwy.riskScore + scenarioDelta;
        if (futureTimeOffsetHours > 0) effectiveRisk += Math.min(20, futureTimeOffsetHours * 3.5);
        if (weatherOverlay === 'monsoon') effectiveRisk += 12;
        effectiveRisk = Math.min(99, Math.max(15, effectiveRisk));

        ctx.save();
        ctx.beginPath();
        hwy.waypoints.forEach((wp, idx) => {
          if (idx === 0) ctx.moveTo(wp.x, wp.y);
          else ctx.lineTo(wp.x, wp.y);
        });

        // Dynamic Glow radius based on risk and selection
        const glowWidth = isSel ? 24 : (effectiveRisk >= 80 ? 18 : 12);
        ctx.lineWidth = glowWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isSel) {
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 22;
        } else {
          ctx.strokeStyle = getRiskColor(effectiveRisk, 0.35);
          ctx.shadowColor = getRiskColor(effectiveRisk, 0.7);
          ctx.shadowBlur = effectiveRisk >= 75 ? 16 : 8;
        }
        ctx.stroke();
        ctx.restore();

        // If Risk Propagation Mode is active, draw animated secondary wave traveling to connected roads
        if (isRiskPropagationActive && isSel) {
          const propCycle = (timeSec * 0.8) % 1;
          const firstWp = hwy.waypoints[0];
          const lastWp = hwy.waypoints[hwy.waypoints.length - 1];
          const propX = firstWp.x + (lastWp.x - firstWp.x) * propCycle;
          const propY = firstWp.y + (lastWp.y - firstWp.y) * propCycle;

          ctx.save();
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(propX, propY, 20 + propCycle * 30, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // -------------------------------------------------------------
      // 5. ROAD ASPHALT SURFACES & HIGHWAY CORES
      // -------------------------------------------------------------
      HIGHWAY_CORRIDORS.forEach(hwy => {
        const isSel = selectedHighway.id === hwy.id;
        const effectiveRisk = Math.min(99, hwy.riskScore + scenarioDelta);

        ctx.save();
        ctx.beginPath();
        hwy.waypoints.forEach((wp, idx) => {
          if (idx === 0) ctx.moveTo(wp.x, wp.y);
          else ctx.lineTo(wp.x, wp.y);
        });

        // Road base
        ctx.lineWidth = hwy.lanes >= 6 ? 6 : 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = isSel ? '#581C87' : '#1E293B';
        ctx.stroke();

        // Inner glowing traffic vein
        ctx.lineWidth = hwy.lanes >= 6 ? 3.5 : 2.5;
        if (isSel) {
          ctx.strokeStyle = '#C084FC';
        } else {
          ctx.strokeStyle = getRiskColor(effectiveRisk, 0.9);
        }
        ctx.stroke();
        ctx.restore();
      });

      // -------------------------------------------------------------
      // 6. ANIMATED TRAFFIC PARTICLES (Streaming Flow along Highways)
      // -------------------------------------------------------------
      vehiclesRef.current.forEach(v => {
        const hwy = HIGHWAY_CORRIDORS.find(h => h.id === v.highwayId);
        if (!hwy || hwy.waypoints.length < 2) return;

        // Advance progress
        v.t += v.speed;
        if (v.t > 1) v.t = 0;

        // Interpolate along waypoints
        const totalSegments = hwy.waypoints.length - 1;
        const segFloat = v.t * totalSegments;
        const segIdx = Math.min(totalSegments - 1, Math.floor(segFloat));
        const segT = segFloat - segIdx;

        const pA = hwy.waypoints[segIdx];
        const pB = hwy.waypoints[segIdx + 1];

        // Linear interpolation + lane offset
        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const vx = pA.x + dx * segT + nx * v.laneOffset;
        const vy = pA.y + dy * segT + ny * v.laneOffset;

        ctx.save();
        if (v.type === 'emergency') {
          // Flashing emergency siren vehicle
          const sirenFlash = Math.sin(timeSec * 16) > 0;
          ctx.fillStyle = sirenFlash ? '#EF4444' : '#3B82F6';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = v.color;
          ctx.shadowColor = v.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(vx, vy, v.type === 'truck' ? 2.8 : 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // -------------------------------------------------------------
      // 7. AI DETECTED BLACKSPOTS (Pulsing DBSCAN Hotspot Rings)
      // -------------------------------------------------------------
      AI_BLACKSPOTS.forEach(bs => {
        const isSel = selectedBlackspot?.id === bs.id;
        const pulse = 0.5 + 0.5 * Math.sin(timeSec * 3.5);
        const radius = isSel ? 16 + pulse * 8 : 10 + pulse * 5;

        ctx.save();
        // Pulsing radar ring
        ctx.strokeStyle = isSel ? '#F43F5E' : 'rgba(239, 68, 68, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(bs.x, bs.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Core dot
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(bs.x, bs.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label if zoomed in
        if (zoom >= 1.6) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#FDA4AF';
          ctx.fillText(`⚠ ${bs.name.split('(')[0].trim()}`, bs.x + 14, bs.y - 4);
          ctx.font = '8px monospace';
          ctx.fillStyle = '#EF4444';
          ctx.fillText(`SEVERITY ${bs.severityIndex} · ${bs.fatalitiesPast3Years} FATAL`, bs.x + 14, bs.y + 7);
        }
        ctx.restore();
      });

      // -------------------------------------------------------------
      // 8. EMERGENCY FACILITIES & AMBULANCE NODES
      // -------------------------------------------------------------
      if (isEmergencyMode || zoom >= 2.0) {
        EMERGENCY_FACILITIES.forEach(ef => {
          ctx.save();
          ctx.fillStyle = ef.type === 'Trauma Hospital' ? '#10B981' : '#38BDF8';
          ctx.shadowColor = ef.type === 'Trauma Hospital' ? '#10B981' : '#38BDF8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(ef.x, ef.y, 4.5, 0, Math.PI * 2);
          ctx.fill();

          if (zoom >= 2.2) {
            ctx.font = '9px monospace';
            ctx.fillStyle = '#E2E8F0';
            ctx.fillText(ef.name.split('-')[0].trim(), ef.x + 10, ef.y + 3);
          }
          ctx.restore();
        });

        // Animate Emergency Siren Route from Hospital to Namakkal Incident on NH-44
        if (isEmergencyMode) {
          const hosp = EMERGENCY_FACILITIES[0]; // Salem hospital
          const incident = AI_BLACKSPOTS[0]; // Namakkal incident

          ctx.save();
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 3.5;
          ctx.setLineDash([8, 6]);
          ctx.lineDashOffset = -timeSec * 24;
          ctx.beginPath();
          ctx.moveTo(hosp.x, hosp.y);
          ctx.lineTo((hosp.x + incident.x) / 2 + 8, (hosp.y + incident.y) / 2);
          ctx.lineTo(incident.x, incident.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 9. METRO CITIES & REGIONAL HUBS
      // -------------------------------------------------------------
      METRO_HUBS.forEach(metro => {
        const isSel = selectedMetro?.id === metro.id;
        ctx.save();
        ctx.fillStyle = isSel ? '#C084FC' : '#F8FAFC';
        ctx.beginPath();
        ctx.arc(metro.x, metro.y, isSel ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = isSel ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isSel ? '#E9D5FF' : '#E2E8F0';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(metro.name, metro.x + 8, metro.y - 4);
        ctx.restore();
      });

      // -------------------------------------------------------------
      // 10. CLIMATE WEATHER LAYER (Monsoon Precipitation / Winter Fog)
      // -------------------------------------------------------------
      if (weatherOverlay === 'monsoon') {
        ctx.save();
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.2;
        rainParticlesRef.current.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 3, p.y + p.len);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 1.5;
          if (p.y > 1050) {
            p.y = 50;
            p.x = Math.random() * 1000;
          }
        });
        ctx.restore();
      } else if (weatherOverlay === 'fog') {
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
        ctx.fillRect(100, 100, 800, 450); // Indo-gangetic plain fog envelope
        ctx.restore();
      }

      ctx.restore(); // Restore Camera Transform

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [
    zoom,
    pan,
    selectedHighway,
    selectedState,
    selectedMetro,
    selectedBlackspot,
    viewMode,
    weatherOverlay,
    futureTimeOffsetHours,
    scenarioDelta,
    isEmergencyMode,
    isRiskPropagationActive,
    nationalRiskIndex
  ]);

  // Mouse Interaction: Drag to Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    // Proximity hover detection
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldX = (clickX - (canvas.width / 2 + pan.x)) / zoom + 500;
    const worldY = (clickY - (canvas.height / 2 + pan.y)) / zoom + 550;

    // Check blackspots
    let found = false;
    AI_BLACKSPOTS.forEach(bs => {
      if (Math.hypot(bs.x - worldX, bs.y - worldY) < 16) {
        setHoveredEntity(`Blackspot: ${bs.name}`);
        found = true;
      }
    });

    if (!found) {
      HIGHWAY_CORRIDORS.forEach(hwy => {
        hwy.waypoints.forEach(wp => {
          if (Math.hypot(wp.x - worldX, wp.y - worldY) < 18) {
            setHoveredEntity(`Corridor: ${hwy.name} (${hwy.riskScore}/100 Risk)`);
            found = true;
          }
        });
      });
    }

    if (!found) setHoveredEntity(null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom(prev => Math.min(7.5, Math.max(0.65, prev + delta)));
  };

  // Click on Canvas to Pick Highway or Blackspot
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldX = (clickX - (canvas.width / 2 + pan.x)) / zoom + 500;
    const worldY = (clickY - (canvas.height / 2 + pan.y)) / zoom + 550;

    // 1. Check Blackspot hit
    for (const bs of AI_BLACKSPOTS) {
      if (Math.hypot(bs.x - worldX, bs.y - worldY) < 22) {
        tacticalAudio.playRadarPing();
        onSelectBlackspot(bs);
        const matchHwy = HIGHWAY_CORRIDORS.find(h => h.code === bs.highwayCode);
        if (matchHwy) onSelectHighway(matchHwy);
        return;
      }
    }

    // 2. Check Highway corridor hit
    for (const hwy of HIGHWAY_CORRIDORS) {
      for (const wp of hwy.waypoints) {
        if (Math.hypot(wp.x - worldX, wp.y - worldY) < 26) {
          tacticalAudio.playRadarPing();
          onSelectHighway(hwy);
          onOpenForensics();
          return;
        }
      }
    }

    // 3. Check State hit
    for (const st of INDIAN_STATES) {
      if (Math.hypot(st.center.x - worldX, st.center.y - worldY) < 45) {
        tacticalAudio.playRadarPing();
        onSelectState(st);
        const stHwy = HIGHWAY_CORRIDORS.find(h => h.state.includes(st.name));
        if (stHwy) onSelectHighway(stHwy);
        return;
      }
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] min-h-[640px] bg-[#070B14] overflow-hidden select-none">
      
      {/* 3D WebGL / HTML5 Canvas Viewport */}
      <canvas
        ref={canvasRef}
        width={1600}
        height={1000}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Top-Left Micro Telemetry Badge */}
      <div className="absolute top-4 left-6 z-20 flex flex-wrap items-center gap-2 text-xs font-mono">
        
        {/* National Risk Pulse Pill */}
        <div className="bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 text-slate-200 px-3.5 py-1.5 rounded-lg shadow-xl flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              nationalRiskIndex >= 75 ? 'bg-red-400' : (nationalRiskIndex >= 55 ? 'bg-amber-400' : 'bg-emerald-400')
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              nationalRiskIndex >= 75 ? 'bg-red-500' : (nationalRiskIndex >= 55 ? 'bg-amber-500' : 'bg-emerald-500')
            }`}></span>
          </span>
          <span className="font-extrabold text-white tracking-wide">INDIA DIGITAL TWIN</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">PULSE:</span>
          <span className={`font-black ${
            nationalRiskIndex >= 75 ? 'text-red-400' : (nationalRiskIndex >= 55 ? 'text-amber-400' : 'text-emerald-400')
          }`}>
            {nationalRiskIndex} / 100
          </span>
        </div>

        {/* City-Wide / Regional Risk Pulse Indicator */}
        <div className="bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
          <Activity className={`w-3.5 h-3.5 animate-pulse ${
            selectedRegionRisk >= 75 ? 'text-red-400' : (selectedRegionRisk >= 55 ? 'text-amber-400' : 'text-emerald-400')
          }`} />
          <span className="text-slate-400 text-[11px]">CITY RISK PULSE:</span>
          <span className="text-slate-200 font-semibold truncate max-w-[130px]">
            {selectedState ? selectedState.name : selectedHighway.name}
          </span>
          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
            selectedRegionRisk >= 75 ? 'bg-red-950/80 text-red-300 border border-red-800/60' :
            selectedRegionRisk >= 55 ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' :
            'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
          }`}>
            {selectedRegionRisk}/100
          </span>
          <span className="text-[10px] text-cyan-400 font-mono tracking-tighter hidden sm:inline">
            BREATHING 0.35Hz
          </span>
        </div>

        {/* Current Hierarchical Level Indicator */}
        <div className="bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-slate-400 text-[11px]">LEVEL:</span>
          <span className="text-violet-300 font-bold uppercase tracking-wider">{currentHierarchy}</span>
        </div>

        {/* Weather Controls */}
        <div className="flex items-center bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setWeatherOverlay('clear')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              weatherOverlay === 'clear' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Clear Satellite Sky"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWeatherOverlay('monsoon')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              weatherOverlay === 'monsoon' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Monsoon Precipitation Front"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWeatherOverlay('fog')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              weatherOverlay === 'fog' ? 'bg-slate-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Winter Radiation Fog"
          >
            <CloudFog className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Floating Top-Right View Mode Presets & Zoom Controls */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2 font-mono text-xs">
        
        {/* View Mode Switcher */}
        <div className="hidden lg:flex items-center bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5">
          {(['MAP', 'SATELLITE', '3D ISOMETRIC', 'AERIAL'] as CameraViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                tacticalAudio.playRadarPing();
                setViewMode(mode);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === mode ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            const next = !isAudioMuted;
            setIsAudioMuted(next);
            tacticalAudio.setMuted(next);
            if (!next) tacticalAudio.playRadarPing();
          }}
          className="p-1.5 rounded-lg bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isAudioMuted ? 'Unmute Tactical Audio' : 'Mute Tactical Audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
        </button>

        {/* Zoom Steppers & Reset */}
        <div className="flex items-center bg-[#0B1323]/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setZoom(prev => Math.min(7.5, prev + 0.35))}
            className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.65, prev - 0.35))}
            className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1.0);
              setPan({ x: 0, y: 0 });
              tacticalAudio.playRadarPing();
            }}
            className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Floating Tactical Hover Tooltip */}
      {hoveredEntity && (
        <div className="absolute bottom-20 left-6 z-20 pointer-events-none bg-[#0B1323]/90 backdrop-blur-md border border-violet-500/40 text-violet-200 px-3 py-1.5 rounded-md shadow-2xl font-mono text-xs flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-violet-400 animate-spin" />
          <span>{hoveredEntity}</span>
          <span className="text-slate-500">· CLICK TO INVESTIGATE</span>
        </div>
      )}

      {/* Bottom Minimal Guidance Watermark */}
      <div className="absolute bottom-4 left-6 z-10 pointer-events-none text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        <span>DRAG TO PAN · SCROLL TO ZOOM (INDIA → STATE → CITY → HIGHWAY → INTERSECTION) · CLICK TO INVESTIGATE</span>
      </div>

    </div>
  );
};
