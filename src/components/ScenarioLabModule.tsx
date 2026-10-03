import React, { useState } from 'react';
import { RoadSegmentProfile, WeatherCondition, RoadSurface, TrafficDensity } from '../types/accident';
import { ROAD_SEGMENTS } from '../data/roadGuardData';
import { SlidersHorizontal, Play, Sparkles, TrendingUp, TrendingDown, ArrowRight, RotateCcw, Info } from 'lucide-react';

interface ScenarioLabModuleProps {
  selectedRoad: RoadSegmentProfile;
  onApplyScenarioToNetwork: (delta: number, active: boolean) => void;
}

export const ScenarioLabModule: React.FC<ScenarioLabModuleProps> = ({
  selectedRoad,
  onApplyScenarioToNetwork
}) => {
  // Current Baseline State (e.g. 72 / 100)
  const baseTraffic: TrafficDensity = 'Moderate';
  const baseWeather: WeatherCondition = 'Clear';
  const baseVisibility: string = 'High';
  const baseSurface: RoadSurface = 'Dry';
  const baseTime: string = '16:00';
  const currentOutputScore = 72;

  // Interactive Scenario Controls
  const [traffic, setTraffic] = useState<TrafficDensity>('Heavy');
  const [weather, setWeather] = useState<WeatherCondition>('Rain');
  const [visibility, setVisibility] = useState<string>('Low');
  const [surface, setSurface] = useState<RoadSurface>('Wet');
  const [time, setTime] = useState<string>('20:30');
  const [hasSimulated, setHasSimulated] = useState<boolean>(true);

  // Compute Simulated Output (e.g. 84 / 100 with +12 delta)
  let simulatedScore = currentOutputScore;
  if (traffic === 'Heavy' || traffic === 'Gridlock') simulatedScore += 5;
  if (weather === 'Rain') simulatedScore += 3;
  else if (weather === 'Storm') simulatedScore += 6;
  if (visibility === 'Low') simulatedScore += 2;
  if (surface === 'Wet' || surface === 'Flooded') simulatedScore += 2;

  const delta = simulatedScore - currentOutputScore; // +12

  const handleRunSimulation = () => {
    setHasSimulated(true);
    onApplyScenarioToNetwork(delta, true);
  };

  const handleResetSimulation = () => {
    setTraffic('Moderate');
    setWeather('Clear');
    setVisibility('High');
    setSurface('Dry');
    setTime('16:00');
    setHasSimulated(false);
    onApplyScenarioToNetwork(0, false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-[#E6E3DC] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
            STAGE 4: SIMULATE
          </span>
          <h2 className="text-xl font-black text-[#1C1E21] uppercase tracking-tight mt-1">
            ROAD SCENARIO LAB
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Test counterfactual and stress-test variables. Modify ambient conditions to observe predicted risk shifts across the network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E6E3DC] hover:bg-zinc-50 text-zinc-700 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Futuristic Scenario Controls Box (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E6E3DC] rounded-xl p-6 shadow-xs space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E3DC]">
            <span className="font-bold text-zinc-900 uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-700" />
              SCENARIO EXPERIMENT CONTROLS
            </span>
            <span className="text-[10px] text-zinc-500">CORRIDOR {selectedRoad.id}</span>
          </div>

          <div className="space-y-4">
            {/* Traffic Level */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-sans font-medium">Traffic</span>
              <div className="flex gap-1">
                {(['Low', 'Moderate', 'Heavy', 'Gridlock'] as TrafficDensity[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTraffic(t)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      traffic === t
                        ? 'bg-[#1C1E21] text-white'
                        : 'bg-[#F4F2EC] text-zinc-600 hover:text-black'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-sans font-medium">Weather</span>
              <div className="flex gap-1">
                {(['Clear', 'Rain', 'Fog/Mist', 'Storm'] as WeatherCondition[]).map(w => (
                  <button
                    key={w}
                    onClick={() => setWeather(w)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      weather === w
                        ? 'bg-[#1C1E21] text-white'
                        : 'bg-[#F4F2EC] text-zinc-600 hover:text-black'
                    }`}
                  >
                    {w === 'Fog/Mist' ? 'FOG' : w.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-sans font-medium">Visibility</span>
              <div className="flex gap-1">
                {['High', 'Moderate', 'Low'].map(v => (
                  <button
                    key={v}
                    onClick={() => setVisibility(v)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      visibility === v
                        ? 'bg-[#1C1E21] text-white'
                        : 'bg-[#F4F2EC] text-zinc-600 hover:text-black'
                    }`}
                  >
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Surface */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-sans font-medium">Road Surface</span>
              <div className="flex gap-1">
                {(['Dry', 'Wet', 'Flooded'] as RoadSurface[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSurface(s)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      surface === s
                        ? 'bg-[#1C1E21] text-white'
                        : 'bg-[#F4F2EC] text-zinc-600 hover:text-black'
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-sans font-medium">Time</span>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="bg-[#F4F2EC] border border-[#E6E3DC] rounded px-3 py-1 font-bold text-zinc-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E6E3DC]">
            <button
              onClick={handleRunSimulation}
              className="w-full py-2.5 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer tracking-wider uppercase text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN SIMULATION</span>
            </button>
          </div>
        </div>

        {/* Right: Simulation Output Card (Current 72 ↓ Simulated 84 [+12]) (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E6E3DC] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6 font-mono">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DC]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                MODEL INFERENCE COMPARISON
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                SCENARIO BENCHMARK
              </span>
            </div>

            {/* Step-down Comparison Box per Prompt */}
            <div className="py-4 space-y-4 text-center">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">
                  CURRENT MODEL OUTPUT
                </span>
                <div className="text-3xl font-black text-zinc-700 mt-0.5">
                  {currentOutputScore} <span className="text-sm font-normal text-zinc-400">/ 100</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-zinc-400 text-xl">
                <span>&darr;</span>
              </div>

              <div>
                <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">
                  SIMULATED OUTPUT
                </span>
                <div className="text-4xl font-black text-[#DC2626] mt-0.5 flex items-center justify-center gap-2">
                  <span>{simulatedScore}</span>
                  <span className="text-sm font-normal text-zinc-400">/ 100</span>
                  <span className="text-xs px-2 py-0.5 rounded font-black text-white bg-[#DC2626]">
                    +{delta}
                  </span>
                </div>
              </div>
            </div>

            {/* Changed Variables Matrix */}
            <div className="p-3 bg-[#F8F7F4] rounded-lg border border-[#E6E3DC] text-[11px] space-y-1.5 font-sans">
              <span className="font-mono font-bold text-zinc-700 block uppercase text-[10px]">
                VARIANCE AUDIT:
              </span>
              <div className="flex justify-between text-zinc-600">
                <span>Traffic Condition:</span>
                <strong className="text-zinc-900">{baseTraffic} &rarr; {traffic}</strong>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Weather State:</span>
                <strong className="text-zinc-900">{baseWeather} &rarr; {weather}</strong>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Photopic Visibility:</span>
                <strong className="text-zinc-900">{baseVisibility} &rarr; {visibility}</strong>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Road Surface Film:</span>
                <strong className="text-zinc-900">{baseSurface} &rarr; {surface}</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] text-zinc-500 font-sans italic flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
            <span>Scenario Lab Protocol: Model simulation under user-specified hypothetical states, not an authoritative physical forecast or causal statement.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
