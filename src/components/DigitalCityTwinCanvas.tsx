import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RoadSegmentProfile, Building3D } from '../types/accident';
import { DIGITAL_TWIN_BUILDINGS, DIGITAL_TWIN_ROADS, Road3DGeometry } from '../data/digitalTwinCityData';
import { tacticalAudio } from '../services/tacticalAudio';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Camera, 
  CloudRain, 
  Sun, 
  CloudFog, 
  Volume2, 
  VolumeX, 
  Layers, 
  Sparkles,
  ShieldAlert,
  Ambulance,
  Sliders,
  Play,
  Pause
} from 'lucide-react';

interface DigitalCityTwinCanvasProps {
  selectedRoad: RoadSegmentProfile;
  onSelectRoad: (road: RoadSegmentProfile) => void;
  allSegments: RoadSegmentProfile[];
  futureTimeOffsetHours: number; // 0, 0.25, 0.5, 1, 3, 6
  scenarioDelta: number;
  isScenarioActive: boolean;
  isPreventionModeActive: boolean;
  isEmergencyModeActive: boolean;
  emergencyTargetRoadId?: string;
  isClimateLayerActive: boolean;
  weatherType: 'clear' | 'rain' | 'fog';
  setWeatherType: (w: 'clear' | 'rain' | 'fog') => void;
  onRoadClick?: (roadId: string) => void;
  onOpenVisionAI?: () => void;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export const DigitalCityTwinCanvas: React.FC<DigitalCityTwinCanvasProps> = ({
  selectedRoad,
  onSelectRoad,
  allSegments,
  futureTimeOffsetHours,
  scenarioDelta,
  isScenarioActive,
  isPreventionModeActive,
  isEmergencyModeActive,
  emergencyTargetRoadId,
  isClimateLayerActive,
  weatherType,
  setWeatherType,
  onRoadClick,
  onOpenVisionAI
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera & Viewport Transformation (Isometric 3D Camera)
  const [zoom, setZoom] = useState<number>(1.05);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Compute Aggregate City Risk Index for City-Wide Risk Pulse
  const aggRiskIndex = useMemo(() => {
    const rawRiskSum = allSegments.reduce((acc, s) => {
      let r = s.currentRiskScore + scenarioDelta;
      if (futureTimeOffsetHours > 0) r += Math.min(24, futureTimeOffsetHours * 4.2);
      if (isPreventionModeActive) r = Math.max(12, r - 30);
      if (weatherType === 'rain') r += 14;
      if (weatherType === 'fog') r += 8;
      return acc + Math.min(99, Math.max(10, r));
    }, 0);
    return Math.min(99, Math.max(12, Math.round(rawRiskSum / (allSegments.length || 1))));
  }, [allSegments, scenarioDelta, futureTimeOffsetHours, isPreventionModeActive, weatherType]);

  // Vehicle Simulation State
  const vehiclesRef = useRef<Array<{
    id: string;
    roadId: string;
    t: number; // progress 0..1
    speed: number;
    color: string;
    type: 'car' | 'truck' | 'bus' | 'ambulance';
    laneOffset: number;
  }>>([]);

  // Rain / Weather Particle System
  const weatherParticlesRef = useRef<Particle[]>([]);

  // Initialize Vehicles
  useEffect(() => {
    const list: typeof vehiclesRef.current = [];
    const colors = ['#E2E8F0', '#94A3B8', '#38BDF8', '#F59E0B', '#EF4444', '#10B981'];
    
    DIGITAL_TWIN_ROADS.forEach((road, rIdx) => {
      // 3 to 5 vehicles per road
      const count = 4;
      for (let i = 0; i < count; i++) {
        const isAmb = rIdx === 0 && i === 0;
        list.push({
          id: `veh-${road.id}-${i}`,
          roadId: road.id,
          t: Math.random(),
          speed: isAmb ? 0.0035 : 0.0012 + Math.random() * 0.0018,
          color: isAmb ? '#FFFFFF' : colors[Math.floor(Math.random() * colors.length)],
          type: isAmb ? 'ambulance' : (i === 1 ? 'truck' : (i === 2 ? 'bus' : 'car')),
          laneOffset: (Math.random() - 0.5) * 6
        });
      }
    });

    vehiclesRef.current = list;

    // Weather Particles
    const parts: Particle[] = [];
    for (let p = 0; p < 180; p++) {
      parts.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        speed: 8 + Math.random() * 12,
        length: 12 + Math.random() * 16,
        opacity: 0.2 + Math.random() * 0.4
      });
    }
    weatherParticlesRef.current = parts;
  }, []);

  // Compute road dynamic risk score based on future time & scenario
  const getRoadEffectiveRisk = (roadId: string): number => {
    const baseSeg = allSegments.find(s => s.id === roadId) || allSegments[0];
    let score = baseSeg.currentRiskScore;

    // Future Time Scaling
    if (futureTimeOffsetHours === 0.25) score += 3;
    else if (futureTimeOffsetHours === 0.5) score += 6;
    else if (futureTimeOffsetHours === 1.0) score += 11;
    else if (futureTimeOffsetHours === 3.0) score += 16;
    else if (futureTimeOffsetHours === 6.0) score += 4;

    // Scenario lab delta
    if (isScenarioActive && baseSeg.id === selectedRoad.id) {
      score += scenarioDelta;
    }

    // Weather impact
    if (weatherType === 'rain') score += 8;
    else if (weatherType === 'fog') score += 5;

    // Prevention reduction
    if (isPreventionModeActive) {
      score = Math.max(25, score - 15);
    }

    return Math.min(99, Math.max(12, Math.round(score)));
  };

  // Color mapper based on risk state
  const getRiskColor = (score: number, alpha: number = 1): string => {
    if (score >= 80) return `rgba(239, 68, 68, ${alpha})`; // Red Critical
    if (score >= 60) return `rgba(249, 115, 22, ${alpha})`; // Orange High
    if (score >= 40) return `rgba(245, 158, 11, ${alpha})`; // Amber Elevated
    return `rgba(16, 185, 129, ${alpha})`; // Green Safe
  };

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear with Deep Midnight Navy
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply Pan & Zoom
      ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-500, -350); // Center around 3D world origin

      // --- CITY-WIDE RISK PULSE ANIMATION (Low-Frequency City Breathing) ---
      // Harmonic oscillation (approx 0.35 Hz) visualizing the live breathing of the city
      const nowSec = performance.now() / 1000;
      const breathingPhase = 0.5 + 0.5 * Math.sin(nowSec * 2.2);

      // Compute aggregate city risk index dynamically
      const rawRiskSum = allSegments.reduce((acc, s) => {
        let r = s.currentRiskScore + scenarioDelta;
        if (futureTimeOffsetHours > 0) r += Math.min(24, futureTimeOffsetHours * 4.2);
        if (isPreventionModeActive) r = Math.max(12, r - 30);
        if (weatherType === 'rain') r += 14;
        if (weatherType === 'fog') r += 8;
        return acc + Math.min(99, Math.max(10, r));
      }, 0);
      const aggRiskIndex = Math.min(99, Math.max(12, Math.round(rawRiskSum / (allSegments.length || 1))));

      // Opacity dynamically scales with the aggregate risk index
      const basePulseOpacity = (aggRiskIndex / 100) * 0.16;
      const dynamicPulseOpacity = basePulseOpacity + breathingPhase * ((aggRiskIndex / 100) * 0.14);

      // Radial pulsating aura radiating from the city center
      const pulseGrad = ctx.createRadialGradient(500, 350, 40, 500, 350, 720);
      if (aggRiskIndex >= 75) {
        // Critical Crimson Breathing Pulse
        pulseGrad.addColorStop(0, `rgba(239, 68, 68, ${dynamicPulseOpacity * 1.5})`);
        pulseGrad.addColorStop(0.4, `rgba(220, 38, 38, ${dynamicPulseOpacity * 0.75})`);
        pulseGrad.addColorStop(0.8, `rgba(185, 28, 28, ${dynamicPulseOpacity * 0.25})`);
        pulseGrad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      } else if (aggRiskIndex >= 55) {
        // Elevated Amber / Orange Breathing Pulse
        pulseGrad.addColorStop(0, `rgba(249, 115, 22, ${dynamicPulseOpacity * 1.3})`);
        pulseGrad.addColorStop(0.4, `rgba(217, 119, 6, ${dynamicPulseOpacity * 0.65})`);
        pulseGrad.addColorStop(0.8, `rgba(180, 83, 9, ${dynamicPulseOpacity * 0.2})`);
        pulseGrad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      } else {
        // Safe Emerald Calm Pulse
        pulseGrad.addColorStop(0, `rgba(16, 185, 129, ${dynamicPulseOpacity * 1.1})`);
        pulseGrad.addColorStop(0.4, `rgba(5, 150, 105, ${dynamicPulseOpacity * 0.55})`);
        pulseGrad.addColorStop(0.8, `rgba(4, 120, 87, ${dynamicPulseOpacity * 0.15})`);
        pulseGrad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      }

      ctx.save();
      ctx.fillStyle = pulseGrad;
      ctx.beginPath();
      ctx.arc(500, 350, 750, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Breathing Wavefront Shockwave Ring
      const waveCycle = (nowSec * 0.35) % 1; // 0 to 1
      const waveRadius = 90 + waveCycle * 600;
      const waveAlpha = (1 - waveCycle) * (aggRiskIndex / 100) * 0.35;
      ctx.strokeStyle = aggRiskIndex >= 75 
        ? `rgba(239, 68, 68, ${waveAlpha})` 
        : (aggRiskIndex >= 55 ? `rgba(249, 115, 22, ${waveAlpha})` : `rgba(16, 185, 129, ${waveAlpha})`);
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(500, 350, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 1. Isometric Grid & Ground Elevation Contours
      ctx.strokeStyle = '#151D2F';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = -200; x <= 1200; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -200);
        ctx.lineTo(x, 900);
        ctx.stroke();
      }
      for (let y = -200; y <= 900; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-200, y);
        ctx.lineTo(1200, y);
        ctx.stroke();
      }

      // 2. Terrain Districts (Asphalt pavement zones)
      ctx.fillStyle = '#0E1422';
      ctx.beginPath();
      ctx.roundRect(80, 80, 880, 520, 24);
      ctx.fill();

      // Waterfront Creek (Under Coast Highway Bridge)
      ctx.fillStyle = '#08172E';
      ctx.beginPath();
      ctx.moveTo(900, 100);
      ctx.bezierCurveTo(950, 300, 920, 500, 970, 700);
      ctx.lineTo(1050, 700);
      ctx.lineTo(1050, 100);
      ctx.closePath();
      ctx.fill();

      // 3. Render AI Risk Fields (Volumetric Glow around Road Corridors)
      DIGITAL_TWIN_ROADS.forEach(road => {
        const risk = getRoadEffectiveRisk(road.id);
        const isSel = road.id === selectedRoad.id;

        ctx.save();
        ctx.beginPath();
        road.points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y - pt.z);
          else ctx.lineTo(pt.x, pt.y - pt.z);
        });

        // Dynamic Glow radius based on risk
        const glowRadius = isSel ? 38 : (risk >= 80 ? 32 : (risk >= 60 ? 24 : 16));
        ctx.lineWidth = glowRadius;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Electric Violet for Selected, otherwise Risk Color
        if (isSel) {
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 24;
        } else {
          ctx.strokeStyle = getRiskColor(risk, 0.28);
          ctx.shadowColor = getRiskColor(risk, 0.8);
          ctx.shadowBlur = risk >= 80 ? 20 : 10;
        }
        ctx.stroke();
        ctx.restore();
      });

      // 4. Render Roads & Bridges (Support pillars for flyovers)
      // Ground Roads first, then Flyovers
      DIGITAL_TWIN_ROADS.forEach(road => {
        const isFlyover = road.isFlyover || road.isBridge;
        const isSel = road.id === selectedRoad.id;
        const risk = getRoadEffectiveRisk(road.id);

        // If flyover, draw shadow on ground first
        if (isFlyover) {
          ctx.save();
          ctx.beginPath();
          road.points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y + 12);
            else ctx.lineTo(pt.x, pt.y + 12);
          });
          ctx.lineWidth = 14;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.stroke();

          // Draw support pillars
          road.points.forEach(pt => {
            if (pt.z > 5) {
              ctx.strokeStyle = '#334155';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(pt.x, pt.y - pt.z);
              ctx.stroke();
            }
          });
          ctx.restore();
        }

        // Draw Asphalt Road Surface
        ctx.save();
        ctx.beginPath();
        road.points.forEach((pt, i) => {
          const zOffset = pt.z;
          if (i === 0) ctx.moveTo(pt.x, pt.y - zOffset);
          else ctx.lineTo(pt.x, pt.y - zOffset);
        });

        // Road bed outline
        ctx.lineWidth = road.lanes === 6 ? 18 : 13;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = isSel ? '#4C1D95' : '#1E293B';
        ctx.stroke();

        // Asphalt Lane core
        ctx.lineWidth = road.lanes === 6 ? 14 : 10;
        ctx.strokeStyle = '#0F172A';
        ctx.stroke();

        // White/Amber Center Lane Markings
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.strokeStyle = isSel ? '#C4B5FD' : '#64748B';
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Electric Violet Pulse if Selected
        if (isSel) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#A78BFA';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 12;
          ctx.stroke();
        }

        ctx.restore();
      });

      // 5. Render Moving Vehicles along Roads
      vehiclesRef.current.forEach(veh => {
        const road = DIGITAL_TWIN_ROADS.find(r => r.id === veh.roadId);
        if (!road) return;

        // Progress along road
        veh.t += veh.speed;
        if (veh.t > 1) veh.t = 0;

        // Linear interpolation along points
        const numSegments = road.points.length - 1;
        const segIdx = Math.min(numSegments - 1, Math.floor(veh.t * numSegments));
        const subT = (veh.t * numSegments) - segIdx;
        const p1 = road.points[segIdx];
        const p2 = road.points[segIdx + 1];

        const vx = p1.x + (p2.x - p1.x) * subT + veh.laneOffset;
        const vy = (p1.y + (p2.y - p1.y) * subT) - (p1.z + (p2.z - p1.z) * subT);

        ctx.save();
        ctx.translate(vx, vy);

        // Rotation angle
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        ctx.rotate(angle);

        if (veh.type === 'ambulance') {
          // Ambulance Box
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-7, -3.5, 14, 7);
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(-2, -3.5, 4, 7);

          // Strobe Lights (Blinking Blue/Red)
          const blink = Math.floor(Date.now() / 120) % 2 === 0;
          ctx.fillStyle = blink ? '#EF4444' : '#3B82F6';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();

          // Siren Light Flare
          ctx.fillStyle = blink ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.35)';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
        } else if (veh.type === 'truck') {
          // Freight Truck
          ctx.fillStyle = veh.color;
          ctx.fillRect(-9, -4, 18, 8);
          ctx.fillStyle = '#CBD5E1';
          ctx.fillRect(-9, -3, 5, 6); // cab
        } else if (veh.type === 'bus') {
          // City Transit Bus
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(-10, -3.5, 20, 7);
        } else {
          // Passenger Car
          ctx.fillStyle = veh.color;
          ctx.fillRect(-5, -2.5, 10, 5);
        }

        // Headlight Beams
        ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
        ctx.beginPath();
        ctx.moveTo(5, -2);
        ctx.lineTo(16, -6);
        ctx.lineTo(16, 6);
        ctx.lineTo(5, 2);
        ctx.closePath();
        ctx.fill();

        // Taillights
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(-6, -2.5, 1.5, 5);

        ctx.restore();
      });

      // 6. Render 3D Extruded Buildings (Isometric Depth & Shadows)
      DIGITAL_TWIN_BUILDINGS.forEach(bld => {
        ctx.save();
        const isoX = bld.x;
        const isoY = bld.y;
        const w = bld.width;
        const d = bld.depth;
        const h = bld.height;

        // Ground Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.moveTo(isoX, isoY);
        ctx.lineTo(isoX + w, isoY);
        ctx.lineTo(isoX + w + h * 0.35, isoY + d + h * 0.25);
        ctx.lineTo(isoX + h * 0.35, isoY + d + h * 0.25);
        ctx.closePath();
        ctx.fill();

        // Front Face (Lit by ambient city light)
        ctx.fillStyle = bld.color || '#1E293B';
        ctx.beginPath();
        ctx.moveTo(isoX, isoY - h);
        ctx.lineTo(isoX + w, isoY - h);
        ctx.lineTo(isoX + w, isoY);
        ctx.lineTo(isoX, isoY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Side Face (Shadow side)
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.moveTo(isoX + w, isoY - h);
        ctx.lineTo(isoX + w + d * 0.45, isoY - h - d * 0.25);
        ctx.lineTo(isoX + w + d * 0.45, isoY - d * 0.25);
        ctx.lineTo(isoX + w, isoY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top Roof Face
        ctx.fillStyle = bld.roofColor || '#334155';
        ctx.beginPath();
        ctx.moveTo(isoX, isoY - h);
        ctx.lineTo(isoX + d * 0.45, isoY - h - d * 0.25);
        ctx.lineTo(isoX + w + d * 0.45, isoY - h - d * 0.25);
        ctx.lineTo(isoX + w, isoY - h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Building Illuminated Windows (Warm Amber & Cyan Matrix)
        const rows = Math.min(8, Math.floor(h / 14));
        const cols = Math.min(5, Math.floor(w / 12));
        for (let r = 1; r < rows; r++) {
          for (let c = 1; c < cols; c++) {
            const isLit = (isoX + r * 7 + c * 13) % 3 !== 0;
            if (isLit) {
              ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(253, 224, 71, 0.8)' : 'rgba(56, 189, 248, 0.75)';
              ctx.fillRect(isoX + c * 10, isoY - h + r * 14, 4, 6);
            }
          }
        }

        // Special Features: Hospital Helipad or Police Beacons
        if (bld.hasHelipad) {
          // Rooftop Red Cross
          const rx = isoX + w * 0.5 + d * 0.2;
          const ry = isoY - h - d * 0.12;

          ctx.fillStyle = 'rgba(220, 38, 38, 0.85)';
          ctx.beginPath();
          ctx.arc(rx, ry, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('H', rx, ry);

          // Pulsating Helipad beacon
          const beaconAlpha = (Math.sin(Date.now() / 250) + 1) / 2;
          ctx.strokeStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rx, ry, 16, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Building Label
        if (bld.name) {
          ctx.fillStyle = '#94A3B8';
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(bld.name.split(' ')[0], isoX + w / 2, isoY - h - 6);
        }

        ctx.restore();
      });

      // 7. Signature Feature: "ROAD RISK ORBIT" Holographic 3D Overlay around Selected Road
      const selGeometry = DIGITAL_TWIN_ROADS.find(r => r.id === selectedRoad.id) || DIGITAL_TWIN_ROADS[0];
      const midPoint = selGeometry.points[Math.floor(selGeometry.points.length / 2)];
      const orbitX = midPoint.x;
      const orbitY = midPoint.y - midPoint.z;
      const selRisk = getRoadEffectiveRisk(selectedRoad.id);

      ctx.save();
      ctx.translate(orbitX, orbitY);

      // Rotating Holographic Concentric Rings
      const rot = (Date.now() / 3000) % (Math.PI * 2);
      ctx.rotate(rot * 0.2);

      // Outer dashed holographic ring
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Counter-rotating inner ring
      ctx.rotate(-rot * 0.4);
      ctx.strokeStyle = 'rgba(196, 181, 253, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();

      // Reset rotation for text & nodes
      ctx.rotate(rot * 0.2);

      // 8 Orbital Factors Node Spheres
      const orbitFactors = [
        { label: 'ACCIDENT', score: selectedRoad.fingerprint.accidentHistory, angle: 0 },
        { label: 'TRAFFIC', score: selectedRoad.fingerprint.traffic, angle: 45 },
        { label: 'WEATHER', score: selectedRoad.fingerprint.weather, angle: 90 },
        { label: 'VISIBILITY', score: selectedRoad.fingerprint.visibility, angle: 135 },
        { label: 'CONDITION', score: 72, angle: 180 },
        { label: 'GEOMETRY', score: selectedRoad.fingerprint.infrastructure, angle: 225 },
        { label: 'SEVERITY', score: selectedRoad.fingerprint.severityPattern, angle: 270 },
        { label: 'EMERGENCY', score: selectedRoad.isHighRiskLimitedEmergency ? 88 : 45, angle: 315 }
      ];

      orbitFactors.forEach(f => {
        const rad = (f.angle * Math.PI) / 180;
        const fx = Math.cos(rad) * 72;
        const fy = Math.sin(rad) * 72;

        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text label
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(f.label, fx, fy + (fy >= 0 ? 11 : -7));
      });

      // Central Holographic Disk
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center Risk Score Number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'black 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${selRisk}`, 0, -5);

      ctx.fillStyle = getRiskColor(selRisk);
      ctx.font = 'bold 7px monospace';
      ctx.fillText(selRisk >= 80 ? 'CRITICAL' : (selRisk >= 60 ? 'HIGH RISK' : 'ELEVATED'), 0, 10);

      ctx.restore();

      // 8. Emergency Mode Path & Dispatch Siren Line
      if (isEmergencyModeActive) {
        ctx.save();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 18;

        // Path from Hospital to Target Road
        ctx.beginPath();
        ctx.moveTo(520, 160); // Apollo Hospital exit
        ctx.lineTo(470, 230);
        ctx.lineTo(orbitX, orbitY);
        ctx.stroke();

        // Pulsating Destination Target Marker
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 9. Prevention Mode Holographic Interventions in 3D
      if (isPreventionModeActive) {
        ctx.save();
        const interventions = [
          { x: 380, y: 220, icon: '💡', title: 'Smart LED (-14%)' },
          { x: 740, y: 310, icon: '👮', title: 'Radar Patrol (-18%)' },
          { x: 470, y: 210, icon: '🚦', title: 'Adaptive Signals (-12%)' },
          { x: 940, y: 400, icon: '🚧', title: 'Anti-Skid Resin (-16%)' }
        ];

        interventions.forEach(inv => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(inv.x - 30, inv.y - 25, 60, 24, 6);
          ctx.fill();
          ctx.stroke();

          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(inv.icon, inv.x - 18, inv.y - 9);

          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(inv.title, inv.x + 8, inv.y - 9);

          // Indicator pin downward
          ctx.strokeStyle = '#10B981';
          ctx.beginPath();
          ctx.moveTo(inv.x, inv.y - 1);
          ctx.lineTo(inv.x, inv.y + 12);
          ctx.stroke();
        });
        ctx.restore();
      }

      // 10. Climate Layer Particles (Rain Streaks or Fog Layer)
      if (weatherType === 'rain') {
        ctx.save();
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.5;
        weatherParticlesRef.current.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 4, p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 2;
          if (p.y > 700) {
            p.y = 50;
            p.x = Math.random() * 1000;
          }
        });
        ctx.restore();
      } else if (weatherType === 'fog') {
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
        ctx.fillRect(0, 0, 1200, 800);
        ctx.restore();
      }

      ctx.restore(); // Restore pan/zoom

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    zoom,
    pan,
    selectedRoad,
    allSegments,
    futureTimeOffsetHours,
    scenarioDelta,
    isScenarioActive,
    isPreventionModeActive,
    isEmergencyModeActive,
    weatherType
  ]);

  // Mouse Interaction: Pan / Orbit
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.min(1.8, Math.max(0.65, prev + delta)));
  };

  // Click on Canvas to pick road
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen click into world space
    const worldX = (clickX - (canvas.width / 2 + pan.x)) / zoom + 500;
    const worldY = (clickY - (canvas.height / 2 + pan.y)) / zoom + 350;

    // Check proximity to roads
    let closestRoad: Road3DGeometry | null = null;
    let minDist = 38;

    DIGITAL_TWIN_ROADS.forEach(road => {
      road.points.forEach(pt => {
        const d = Math.hypot(pt.x - worldX, (pt.y - pt.z) - worldY);
        if (d < minDist) {
          minDist = d;
          closestRoad = road;
        }
      });
    });

    if (closestRoad) {
      tacticalAudio.playRadarPing();
      const matchedProfile = allSegments.find(s => s.id === (closestRoad as Road3DGeometry).id);
      if (matchedProfile) {
        onSelectRoad(matchedProfile);
      }
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[640px] bg-[#0B0F19] overflow-hidden select-none">
      
      {/* 3D WebGL / Canvas Container */}
      <canvas
        ref={canvasRef}
        width={1600}
        height={950}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-6 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-[#111827]/90 backdrop-blur-md border border-slate-800 text-slate-200 px-3.5 py-1.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></span>
          <span className="font-bold tracking-wider text-white">AI DIGITAL TWIN 3D</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">8 CORRIDORS · 12 SKYLINE TOWERS</span>
        </div>

        {/* City-Wide Risk Pulse HUD Badge */}
        <div className="bg-[#111827]/90 backdrop-blur-md border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              aggRiskIndex >= 75 ? 'bg-red-400' : (aggRiskIndex >= 55 ? 'bg-amber-400' : 'bg-emerald-400')
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              aggRiskIndex >= 75 ? 'bg-red-500' : (aggRiskIndex >= 55 ? 'bg-amber-500' : 'bg-emerald-500')
            }`}></span>
          </span>
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">PULSE:</span>
          <span className={`font-extrabold text-[11px] ${
            aggRiskIndex >= 75 ? 'text-red-400' : (aggRiskIndex >= 55 ? 'text-amber-400' : 'text-emerald-400')
          }`}>
            {aggRiskIndex} INDEX
          </span>
          <span className="text-[10px] text-slate-500 hidden xl:inline">· BREATHING (0.35Hz)</span>
        </div>

        {/* Climate Weather Switcher */}
        <div className="flex items-center bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => setWeatherType('clear')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              weatherType === 'clear' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Clear Skies"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWeatherType('rain')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              weatherType === 'rain' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Monsoon Precipitation"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWeatherType('fog')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              weatherType === 'fog' ? 'bg-slate-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Atmospheric Fog Layer"
          >
            <CloudFog className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CCTV Vision AI Quick Scanner */}
        {onOpenVisionAI && (
          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenVisionAI(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-950/80 hover:bg-violet-900 text-violet-200 hover:text-white border border-violet-500/40 text-xs font-mono font-semibold transition-all cursor-pointer shadow-md"
            title="Open Vision AI Real-time Traffic Camera Hazard Scanner"
          >
            <Camera className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="hidden sm:inline">CCTV VISION</span>
          </button>
        )}
      </div>

      {/* Top Right Camera & Audio Controls */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
        {/* Camera View Presets */}
        <div className="hidden xl:flex items-center bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
          <button
            onClick={() => { setZoom(1.05); setPan({ x: 0, y: 0 }); tacticalAudio.playRadarPing(); }}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Overview Angle"
          >
            OVERVIEW
          </button>
          <button
            onClick={() => { setZoom(1.35); setPan({ x: 50, y: -40 }); tacticalAudio.playRadarPing(); }}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Expressway Spine Focus"
          >
            EXPRESSWAY
          </button>
          <button
            onClick={() => { setZoom(1.4); setPan({ x: -260, y: -160 }); tacticalAudio.playRadarPing(); }}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Harbor Bay Bridge Angle"
          >
            HARBOR
          </button>
          <button
            onClick={() => { setZoom(1.45); setPan({ x: 100, y: 130 }); tacticalAudio.playRadarPing(); }}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Downtown Junction Zoom"
          >
            JUNCTION
          </button>
        </div>

        {/* Audio Mute */}
        <button
          onClick={() => {
            const next = !isAudioMuted;
            setIsAudioMuted(next);
            tacticalAudio.setMuted(next);
            if (!next) tacticalAudio.playRadarPing();
          }}
          className="p-2 rounded-lg bg-[#111827]/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isAudioMuted ? 'Unmute Tactical Radar' : 'Mute Tactical Radar'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
            className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.65, prev - 0.15))}
            className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1.05);
              setPan({ x: 0, y: 0 });
              tacticalAudio.playRadarPing();
            }}
            className="p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Instructions Tooltip */}
      <div className="absolute bottom-20 left-6 z-10 pointer-events-none text-[11px] font-mono text-slate-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        <span>DRAG TO ROTATE/PAN · SCROLL TO ZOOM · CLICK ANY ROAD TO ORBIT</span>
      </div>

    </div>
  );
};
