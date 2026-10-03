import React, { useState } from 'react';
import { 
  TRAFFIC_ANOMALIES, 
  TrafficAnomalyAlert 
} from '../data/operationsData';
import { HIGHWAY_CORRIDORS } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  Sliders, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2,
  Radio
} from 'lucide-react';

interface TrafficViewProps {
  onInvestigateAnomaly: (anomaly: TrafficAnomalyAlert) => void;
}

export const TrafficView: React.FC<TrafficViewProps> = ({
  onInvestigateAnomaly
}) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('NH-44-TN');
  const [flowSpeedFactor, setFlowSpeedFactor] = useState<number>(1.0);

  const selectedCorridor = HIGHWAY_CORRIDORS.find(h => h.id === selectedCorridorId) || HIGHWAY_CORRIDORS[0];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-5 font-mono text-xs text-slate-200">
      
      {/* Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-base font-black text-white uppercase tracking-wide font-sans">
              TRAFFIC OPERATIONS & FLOW INTELLIGENCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
              REAL-TIME SENSOR NETWORK
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Lane Occupancy, Speed Drop Anomaly Detection, Directional Micro-Particle Flow Simulation
          </div>
        </div>

        {/* Speed Flow Control */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400">PARTICLE FLOW VELOCITY:</span>
          <span className="text-amber-400 font-bold">{flowSpeedFactor}x</span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.5"
            value={flowSpeedFactor}
            onChange={(e) => setFlowSpeedFactor(Number(e.target.value))}
            className="w-20 accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Grid: Left Corridor Telemetry / Right Anomaly Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Corridor Traffic Flow & Speed Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Corridor Selector Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {HIGHWAY_CORRIDORS.map(hwy => (
              <button
                key={hwy.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  setSelectedCorridorId(hwy.id);
                }}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCorridorId === hwy.id 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {hwy.code} ({hwy.state.split('/')[0].trim()})
              </button>
            ))}
          </div>

          {/* Traffic Flow Live Status Card */}
          <div className="p-5 rounded-2xl bg-[#070B14]/90 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-sm font-extrabold text-white font-sans">{selectedCorridor.name}</div>
                <div className="text-[10px] text-slate-400">{selectedCorridor.origin} → {selectedCorridor.destination} ({selectedCorridor.totalLengthKm} km)</div>
              </div>

              <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedCorridor.trafficDensityScore >= 80 ? 'bg-red-950 text-red-400 border border-red-500/40' :
                  selectedCorridor.trafficDensityScore >= 60 ? 'bg-orange-950 text-orange-400 border border-orange-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {selectedCorridor.trafficDensityScore >= 80 ? 'SEVERE CONGESTION' : (selectedCorridor.trafficDensityScore >= 60 ? 'HEAVY SATURATION' : 'FREE FLOW')}
                </span>
              </div>
            </div>

            {/* Metric KPI Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">TRAFFIC DENSITY</div>
                <div className="text-xl font-black text-amber-400 mt-1">{selectedCorridor.trafficDensityScore}%</div>
                <div className="text-[9px] text-slate-500">Lane Capacity</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">AVG SPEED</div>
                <div className="text-xl font-black text-white mt-1">
                  {Math.round(selectedCorridor.speedLimitKmh * (1 - selectedCorridor.trafficDensityScore / 180))} km/h
                </div>
                <div className="text-[9px] text-slate-500">Limit: {selectedCorridor.speedLimitKmh} km/h</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">QUEUE BACKLOG</div>
                <div className="text-xl font-black text-red-400 mt-1">4.8 km</div>
                <div className="text-[9px] text-slate-500">Peak Window</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">LANE OCCUPANCY</div>
                <div className="text-xl font-black text-purple-400 mt-1">{selectedCorridor.lanes} Lanes</div>
                <div className="text-[9px] text-slate-500">Dual Carriage</div>
              </div>
            </div>

            {/* Visual Color Legend */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[10px]">
              <span className="text-slate-400 font-bold uppercase">TRAFFIC FLOW LEGEND:</span>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span>Free Flow</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Slow Moving</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /><span>Congested</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /><span>Severe Breakdown</span></div>
            </div>
          </div>

        </div>

        {/* Right: AI Traffic Anomaly Detection Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-extrabold text-white text-xs uppercase tracking-wide">
                AI TRAFFIC ANOMALY STREAM
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold">{TRAFFIC_ANOMALIES.length} DETECTED</span>
          </div>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {TRAFFIC_ANOMALIES.map(anom => (
              <div
                key={anom.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    anom.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-orange-950 text-orange-300 border border-orange-500/40'
                  }`}>
                    {anom.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{anom.detectedTime}</span>
                </div>

                <div>
                  <div className="font-bold text-white text-xs">{anom.title}</div>
                  <div className="text-[10px] text-slate-400">{anom.location} ({anom.highwayCode})</div>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[10px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Speed Drop:</span>
                    <strong className="text-red-400">{anom.baselineSpeedKmh} km/h → {anom.currentSpeedKmh} km/h</strong>
                  </div>
                  <div className="text-slate-400 leading-snug">
                    <span className="text-slate-500">Inference: </span>
                    {anom.causeInference}
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => {
                      tacticalAudio.playRadarPing();
                      onInvestigateAnomaly(anom);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-amber-900/30"
                  >
                    <span>INVESTIGATE ANOMALY</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
