import React, { useState } from 'react';
import { 
  IndiaDigitalTwinCanvas, 
  CameraViewMode 
} from './IndiaDigitalTwinCanvas';
import { 
  HighwayCorridor, 
  IndianState, 
  MetroHub, 
  BlackspotCluster,
  HIGHWAY_CORRIDORS 
} from '../data/indiaDigitalTwinData';
import { 
  IncidentRecord, 
  OPERATIONAL_INCIDENTS,
  TRAFFIC_ANOMALIES 
} from '../data/operationsData';
import { TimelineBar } from './TimelineBar';
import { tacticalAudio } from '../services/tacticalAudio';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  ShieldAlert, 
  Activity, 
  Radio, 
  Filter,
  Eye,
  Sliders,
  Ambulance,
  Sparkles
} from 'lucide-react';

interface CommandCenterViewProps {
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
  setWeatherOverlay: (w: 'clear' | 'monsoon' | 'fog') => void;
  futureTimeOffsetHours: number;
  setFutureTimeOffsetHours: (h: number) => void;
  scenarioDelta: number;
  isEmergencyMode: boolean;
  isRiskPropagationActive: boolean;
  onOpenForensics: () => void;
  onOpenIncidentDetail: (incident: IncidentRecord) => void;
  onOpenSimulation: () => void;
  onOpenEmergency: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
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
  setFutureTimeOffsetHours,
  scenarioDelta,
  isEmergencyMode,
  isRiskPropagationActive,
  onOpenForensics,
  onOpenIncidentDetail,
  onOpenSimulation,
  onOpenEmergency
}) => {
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('ALL');
  const [timeHorizon, setTimeHorizon] = useState<'NOW' | '6H' | '24H' | '7D'>('NOW');

  // Filter highways based on risk pulse selection
  const filteredHighways = HIGHWAY_CORRIDORS.filter(hwy => {
    if (riskFilter === 'ALL') return true;
    if (riskFilter === 'CRITICAL') return hwy.riskScore >= 80;
    if (riskFilter === 'HIGH') return hwy.riskScore >= 65 && hwy.riskScore < 80;
    if (riskFilter === 'MODERATE') return hwy.riskScore >= 45 && hwy.riskScore < 65;
    if (riskFilter === 'SAFE') return hwy.riskScore < 45;
    return true;
  });

  return (
    <div className="relative w-full h-[calc(100vh-6.2rem)] bg-[#070B14] overflow-hidden select-none font-mono text-xs">
      
      {/* Primary Visual Centerpiece: Interactive 3D India Digital Twin */}
      <IndiaDigitalTwinCanvas
        selectedHighway={selectedHighway}
        onSelectHighway={onSelectHighway}
        selectedState={selectedState}
        onSelectState={onSelectState}
        selectedMetro={selectedMetro}
        onSelectMetro={onSelectMetro}
        selectedBlackspot={selectedBlackspot}
        onSelectBlackspot={onSelectBlackspot}
        viewMode={viewMode}
        setViewMode={setViewMode}
        weatherOverlay={weatherOverlay}
        setWeatherOverlay={setWeatherOverlay}
        futureTimeOffsetHours={futureTimeOffsetHours}
        scenarioDelta={scenarioDelta}
        isEmergencyMode={isEmergencyMode}
        isRiskPropagationActive={isRiskPropagationActive}
        onOpenForensics={onOpenForensics}
        onOpenNearMiss={onOpenForensics}
        onOpenIntersection={onOpenForensics}
      />

      {/* LEFT COMPACT OPERATIONAL HUD: ACTIVE INCIDENT STREAM */}
      <div className="absolute top-4 left-6 z-20 w-80 max-w-[calc(100vw-3rem)] pointer-events-auto">
        <div className="bg-[#070B14]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3.5 shadow-2xl space-y-2.5">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-extrabold text-white text-xs uppercase tracking-wide">
                ACTIVE INCIDENT STREAM
              </span>
            </div>
            <span className="text-[10px] text-slate-500">LIVE FEED</span>
          </div>

          {/* Incident List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {OPERATIONAL_INCIDENTS.slice(0, 4).map(inc => (
              <div
                key={inc.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  onOpenIncidentDetail(inc);
                }}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/60 hover:bg-slate-900/90 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/40' :
                      inc.severity === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-500/40' : 'bg-blue-950 text-blue-400 border border-blue-500/40'
                    }`}>
                      {inc.severity}
                    </span>
                    <strong className="text-white text-[11px]">{inc.highwayCode}</strong>
                  </div>
                  <span className="text-[10px] text-slate-500">{inc.timestamp.split('(')[0].trim()}</span>
                </div>

                <div className="text-slate-300 text-[11px] font-sans truncate font-medium">
                  {inc.title}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>{inc.state} ({inc.district})</span>
                  <span className="text-amber-400">-{inc.trafficSpeedDropKmh} km/h speed</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT COMPACT OPERATIONAL HUD: NATIONAL RISK PULSE & TREND */}
      <div className="absolute top-4 right-6 z-20 w-80 max-w-[calc(100vw-3rem)] pointer-events-auto space-y-3">
        
        {/* Risk Pulse Card */}
        <div className="bg-[#070B14]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3.5 shadow-2xl space-y-3">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-violet-400" />
              <span className="font-extrabold text-white text-xs uppercase tracking-wide">
                NATIONAL RISK PULSE
              </span>
            </div>
            
            {/* Risk Trend Indicator */}
            <div className="flex items-center gap-1 text-red-400 font-bold text-[10px]">
              <TrendingUp className="w-3 h-3 text-red-400" />
              <span>+4.2% ELEVATED</span>
            </div>
          </div>

          {/* Time Horizon Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 text-[10px]">
            {(['NOW', '6H', '24H', '7D'] as const).map(t => (
              <button
                key={t}
                onClick={() => { tacticalAudio.playRadarPing(); setTimeHorizon(t); }}
                className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  timeHorizon === t ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Risk Level Category Filters (Clickable: automatically filters highways) */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setRiskFilter(riskFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL');
              }}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                riskFilter === 'CRITICAL' 
                  ? 'bg-red-950/80 border-red-500 text-white font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <span>CRITICAL</span>
              <strong className="text-red-400">14 CORRIDORS</strong>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setRiskFilter(riskFilter === 'HIGH' ? 'ALL' : 'HIGH');
              }}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                riskFilter === 'HIGH' 
                  ? 'bg-orange-950/80 border-orange-500 text-white font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <span>HIGH</span>
              <strong className="text-orange-400">28 CORRIDORS</strong>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setRiskFilter(riskFilter === 'MODERATE' ? 'ALL' : 'MODERATE');
              }}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                riskFilter === 'MODERATE' 
                  ? 'bg-amber-950/80 border-amber-500 text-white font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <span>MODERATE</span>
              <strong className="text-amber-400">62 CORRIDORS</strong>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setRiskFilter(riskFilter === 'SAFE' ? 'ALL' : 'SAFE');
              }}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                riskFilter === 'SAFE' 
                  ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <span>SAFE</span>
              <strong className="text-emerald-400">148 CORRIDORS</strong>
            </button>
          </div>

          {/* Quick Contextual Highway Trigger */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Focused: <strong className="text-white">{selectedHighway.code}</strong></span>
            <button
              onClick={() => { tacticalAudio.playRadarPing(); onOpenForensics(); }}
              className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Investigate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Quick Operations Actions Bar */}
        <div className="bg-[#070B14]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-1.5 text-[10px]">
          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenForensics(); }}
            className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold transition-colors cursor-pointer text-center"
          >
            FORENSICS
          </button>
          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenSimulation(); }}
            className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold transition-colors cursor-pointer text-center"
          >
            SIMULATE
          </button>
          <button
            onClick={() => { tacticalAudio.playAlertChime(); onOpenEmergency(); }}
            className="flex-1 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 font-bold transition-colors cursor-pointer text-center"
          >
            DISPATCH
          </button>
        </div>

      </div>

      {/* BOTTOM CENTER: Minimal Timeline Scrub Control */}
      <TimelineBar
        currentOffsetHours={futureTimeOffsetHours}
        onSelectOffsetHours={setFutureTimeOffsetHours}
      />

    </div>
  );
};
