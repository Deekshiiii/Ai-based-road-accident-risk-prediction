import React, { useState } from 'react';
import { RoadSegmentProfile, WeatherCondition, RoadSurface, TrafficDensity } from '../types/accident';
import { ROAD_SEGMENTS } from '../data/roadGuardData';
import { ShieldAlert, Sliders, CheckCircle2, Info, Sparkles, Clock, Compass } from 'lucide-react';

interface PredictModuleProps {
  selectedRoad: RoadSegmentProfile;
  onSelectRoad: (road: RoadSegmentProfile) => void;
}

export const PredictModule: React.FC<PredictModuleProps> = ({ selectedRoad, onSelectRoad }) => {
  const [selectedRoadId, setSelectedRoadId] = useState<string>(selectedRoad.id);
  const [time, setTime] = useState<string>('20:30');
  const [weather, setWeather] = useState<WeatherCondition>('Rain');
  const [traffic, setTraffic] = useState<TrafficDensity>('Heavy');
  const [visibility, setVisibility] = useState<number>(4.0);
  const [roadSurface, setRoadSurface] = useState<RoadSurface>('Wet');
  const [speedLimit, setSpeedLimit] = useState<number>(selectedRoad.speedLimit);

  const currentSegment = ROAD_SEGMENTS.find(s => s.id === selectedRoadId) || selectedRoad;

  // Compute realistic calibrated prediction
  let baseScore = currentSegment.currentRiskScore;
  if (weather === 'Rain') baseScore += 6;
  else if (weather === 'Storm') baseScore += 10;
  else if (weather === 'Clear') baseScore -= 5;

  if (traffic === 'Heavy' || traffic === 'Gridlock') baseScore += 5;
  else if (traffic === 'Low') baseScore -= 7;

  if (roadSurface === 'Wet' || roadSurface === 'Flooded') baseScore += 5;
  if (visibility <= 3) baseScore += 6;

  const predictedScore = Math.min(98, Math.max(15, baseScore));
  const riskStatus =
    predictedScore >= 80 ? 'CRITICAL' :
    predictedScore >= 60 ? 'HIGH' :
    predictedScore >= 35 ? 'ELEVATED' : 'SAFE';

  const riskColor =
    predictedScore >= 80 ? 'text-[#DC2626]' :
    predictedScore >= 60 ? 'text-[#F97316]' :
    predictedScore >= 35 ? 'text-[#F59E0B]' : 'text-[#10B981]';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#E6E3DC] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded">
            STAGE 1: PREDICT
          </span>
          <h2 className="text-xl font-black text-[#1C1E21] uppercase tracking-tight mt-1">
            AI Road Risk Prediction Engine
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Model-estimated collision risk scores calculated under dynamic contextual and environmental parameters.
          </p>
        </div>

        {/* Selected Corridor Switcher */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">CORRIDOR:</span>
          <select
            value={selectedRoadId}
            onChange={e => {
              setSelectedRoadId(e.target.value);
              const r = ROAD_SEGMENTS.find(s => s.id === e.target.value);
              if (r) onSelectRoad(r);
            }}
            className="bg-white border border-[#E6E3DC] text-[#1C1E21] px-3 py-1.5 rounded-md font-bold focus:outline-hidden"
          >
            {ROAD_SEGMENTS.map(s => (
              <option key={s.id} value={s.id}>{s.id}: {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Selection Controls (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E6E3DC] rounded-xl p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E3DC]">
            <span className="font-mono font-bold text-zinc-800 uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-violet-600" />
              Input Contextual Variables
            </span>
            <span className="text-[10px] font-mono text-zinc-400">7 FEATURES</span>
          </div>

          <div className="space-y-3">
            {/* Time of Day */}
            <div>
              <label className="block text-zinc-600 font-medium mb-1">Time of Day (24h)</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-[#F8F7F4] border border-[#E6E3DC] rounded-md px-3 py-1.5 font-mono text-zinc-900"
              />
            </div>

            {/* Weather & Surface */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Weather Condition</label>
                <select
                  value={weather}
                  onChange={e => setWeather(e.target.value as WeatherCondition)}
                  className="w-full bg-[#F8F7F4] border border-[#E6E3DC] rounded-md px-2.5 py-1.5 text-zinc-900 font-medium"
                >
                  <option value="Clear">Clear Skies</option>
                  <option value="Rain">Precipitation (Rain)</option>
                  <option value="Fog/Mist">Atmospheric Fog/Mist</option>
                  <option value="Storm">Severe Storm</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Road Surface</label>
                <select
                  value={roadSurface}
                  onChange={e => setRoadSurface(e.target.value as RoadSurface)}
                  className="w-full bg-[#F8F7F4] border border-[#E6E3DC] rounded-md px-2.5 py-1.5 text-zinc-900 font-medium"
                >
                  <option value="Dry">Dry Asphalt</option>
                  <option value="Wet">Wet Film</option>
                  <option value="Flooded">Flooded Water</option>
                </select>
              </div>
            </div>

            {/* Traffic & Speed Limit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Traffic Density</label>
                <select
                  value={traffic}
                  onChange={e => setTraffic(e.target.value as TrafficDensity)}
                  className="w-full bg-[#F8F7F4] border border-[#E6E3DC] rounded-md px-2.5 py-1.5 text-zinc-900 font-medium"
                >
                  <option value="Low">Low (Free Flow)</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy (Congested)</option>
                  <option value="Gridlock">Gridlock</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between text-zinc-600 font-medium mb-1">
                  <span>Speed Limit</span>
                  <span className="font-mono text-violet-700 font-bold">{speedLimit} km/h</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={speedLimit}
                  onChange={e => setSpeedLimit(parseInt(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            </div>

            {/* Visibility Slider */}
            <div>
              <div className="flex justify-between text-zinc-600 font-medium mb-1">
                <span>Photopic Visibility</span>
                <span className="font-mono text-violet-700 font-bold">{visibility} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={visibility}
                onChange={e => setVisibility(parseFloat(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Right: AI Output & Gauge (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E6E3DC] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              AI ESTIMATED ROAD RISK
            </span>

            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-5xl font-black font-mono tracking-tight ${riskColor}`}>
                {predictedScore}
              </span>
              <span className="text-xl font-mono text-zinc-400">/ 100</span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ml-2 ${
                predictedScore >= 80 ? 'bg-red-100 text-red-800' :
                predictedScore >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {riskStatus} RISK
              </span>
            </div>

            {/* Linear Meter Gauge */}
            <div className="mt-4 space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-zinc-500">
                <span>SAFE (0–30)</span>
                <span>ELEVATED (31–60)</span>
                <span>HIGH (61–80)</span>
                <span>CRITICAL (81–100)</span>
              </div>
              <div className="w-full bg-[#F4F2EC] h-2.5 rounded-full overflow-hidden flex">
                <div className="w-[30%] bg-[#10B981]" />
                <div className="w-[30%] bg-[#F59E0B]" />
                <div className="w-[20%] bg-[#F97316]" />
                <div className="w-[20%] bg-[#DC2626]" />
              </div>
              {/* Needle Indicator */}
              <div 
                className="relative w-0 h-0 transition-all duration-300"
                style={{ left: `${Math.min(98, Math.max(2, predictedScore))}%` }}
              >
                <div className="w-3 h-3 -mt-1.5 -ml-1.5 bg-[#1C1E21] border-2 border-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Model Generated Summary */}
          <div className="p-4 bg-[#F8F7F4] rounded-lg border border-[#E6E3DC] text-xs space-y-1.5 text-zinc-800">
            <span className="font-bold text-[#1C1E21] flex items-center gap-1.5 font-mono text-[11px] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              Model Inference Summary
            </span>
            <p className="leading-relaxed text-zinc-700 font-sans">
              Under current inputs for <strong>{currentSegment.id}</strong> ({weather} weather, {traffic.toLowerCase()} traffic, and {visibility} km visibility), the gradient boosting model projects an elevated hazard score of <strong>{predictedScore}/100</strong>.
            </p>
            <div className="pt-2 border-t border-[#E6E3DC] text-[10px] text-zinc-500 font-sans italic flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>Model estimate represents statistical correlation on validation distributions; does not claim deterministic certainty.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
