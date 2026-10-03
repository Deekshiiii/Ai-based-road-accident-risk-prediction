import React, { useState } from 'react';
import { HotspotCluster, PredictionResult } from '../types/accident';
import { KNOWN_HUBS } from '../data/mockAccidentData';
import { predictAccidentRisk } from '../services/mlRiskModel';
import { GitCompare, MapPin, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface CompareRiskViewProps {
  hotspots: HotspotCluster[];
}

export const CompareRiskView: React.FC<CompareRiskViewProps> = ({ hotspots }) => {
  const [hubAName, setHubAName] = useState<string>(KNOWN_HUBS[0].name); // Kathipara
  const [hubBName, setHubBName] = useState<string>(KNOWN_HUBS[2].name); // OMR Sholinganallur

  const hubA = KNOWN_HUBS.find(h => h.name === hubAName) || KNOWN_HUBS[0];
  const hubB = KNOWN_HUBS.find(h => h.name === hubBName) || KNOWN_HUBS[2];

  // Matched clusters
  const clusterA = hotspots.find(h => h.name.includes(hubA.name.split(' ')[0])) || hotspots[0];
  const clusterB = hotspots.find(h => h.name.includes(hubB.name.split(' ')[0])) || hotspots[1];

  // Predictions under standard peak conditions
  const predA: PredictionResult = predictAccidentRisk(
    {
      locationName: hubA.name,
      latitude: hubA.lat,
      longitude: hubA.lng,
      date: '2026-10-02',
      time: '18:30',
      weather: 'Rain',
      roadSurface: 'Wet',
      trafficLevel: 'Heavy',
      roadType: hubA.roadType,
      junctionType: hubA.junctionType,
      speedLimit: hubA.speedLimit,
      visibilityKm: 5.0,
      lanes: 4,
      lighting: 'Dusk/Dawn',
      isPeakHour: true,
      isWeekend: false
    },
    hotspots
  );

  const predB: PredictionResult = predictAccidentRisk(
    {
      locationName: hubB.name,
      latitude: hubB.lat,
      longitude: hubB.lng,
      date: '2026-10-02',
      time: '18:30',
      weather: 'Rain',
      roadSurface: 'Wet',
      trafficLevel: 'Heavy',
      roadType: hubB.roadType,
      junctionType: hubB.junctionType,
      speedLimit: hubB.speedLimit,
      visibilityKm: 5.0,
      lanes: 4,
      lighting: 'Dusk/Dawn',
      isPeakHour: true,
      isWeekend: false
    },
    hotspots
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-indigo-400" />
            Comparative Corridor Risk Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Side-by-side diagnostic evaluation comparing historical collision frequency, severity indices, and primary hazards across two locations.
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-xs">
        <div>
          <label className="block text-slate-400 font-medium mb-1">Corridor Location A</label>
          <select
            value={hubAName}
            onChange={e => setHubAName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium"
          >
            {KNOWN_HUBS.map(h => (
              <option key={h.name} value={h.name}>{h.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1">Corridor Location B</label>
          <select
            value={hubBName}
            onChange={e => setHubBName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium"
          >
            {KNOWN_HUBS.map(h => (
              <option key={h.name} value={h.name}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card A */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Profile Corridor A</span>
              <h2 className="text-base font-bold text-white">{hubA.name}</h2>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold text-white ${
              predA.riskScore >= 80 ? 'bg-red-600' :
              predA.riskScore >= 60 ? 'bg-orange-600' : 'bg-amber-600'
            }`}>
              {predA.riskScore}/100 Risk
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Accidents</span>
              <span className="text-white font-mono font-bold text-base">{clusterA?.accidentCount || 42}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Fatalities</span>
              <span className="text-red-400 font-mono font-bold text-base">{clusterA?.fatalCount || 8}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Severe Injuries</span>
              <span className="text-orange-400 font-mono font-bold text-base">{clusterA?.severeCount || 19}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Road Classification:</span>
              <span className="font-semibold text-white">{hubA.roadType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Junction Geometry:</span>
              <span className="font-semibold text-white">{hubA.junctionType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Speed Limit:</span>
              <span className="font-mono text-indigo-400">{hubA.speedLimit} km/h</span>
            </div>
            <div className="py-1">
              <span className="text-slate-400 block mb-1">Key Contributing Hazards:</span>
              <div className="space-y-1">
                {predA.topContributingFactors.map((f, i) => (
                  <div key={i} className="bg-slate-950 px-2.5 py-1 rounded text-[11px] text-slate-300 border border-slate-800/60">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Profile Corridor B</span>
              <h2 className="text-base font-bold text-white">{hubB.name}</h2>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold text-white ${
              predB.riskScore >= 80 ? 'bg-red-600' :
              predB.riskScore >= 60 ? 'bg-orange-600' : 'bg-amber-600'
            }`}>
              {predB.riskScore}/100 Risk
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Accidents</span>
              <span className="text-white font-mono font-bold text-base">{clusterB?.accidentCount || 35}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Fatalities</span>
              <span className="text-red-400 font-mono font-bold text-base">{clusterB?.fatalCount || 5}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Severe Injuries</span>
              <span className="text-orange-400 font-mono font-bold text-base">{clusterB?.severeCount || 14}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Road Classification:</span>
              <span className="font-semibold text-white">{hubB.roadType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Junction Geometry:</span>
              <span className="font-semibold text-white">{hubB.junctionType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Speed Limit:</span>
              <span className="font-mono text-indigo-400">{hubB.speedLimit} km/h</span>
            </div>
            <div className="py-1">
              <span className="text-slate-400 block mb-1">Key Contributing Hazards:</span>
              <div className="space-y-1">
                {predB.topContributingFactors.map((f, i) => (
                  <div key={i} className="bg-slate-950 px-2.5 py-1 rounded text-[11px] text-slate-300 border border-slate-800/60">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
