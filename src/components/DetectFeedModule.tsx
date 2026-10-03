import React, { useState } from 'react';
import { EMERGING_ANOMALIES, DETECTED_PATTERNS } from '../data/roadGuardData';
import { Radar, AlertTriangle, Clock, Flame, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FeedEvent {
  id: string;
  timestamp: string;
  type: 'EMERGING RISK PATTERN' | 'HOTSPOT CLUSTER DETECTED' | 'ANOMALOUS RISK CHANGE' | 'REPEATED SEVERITY PATTERN';
  roadId: string;
  roadName: string;
  summary: string;
  details: string;
  status: 'CRITICAL' | 'ELEVATED' | 'OBSERVED';
  metric?: string;
}

export const DetectFeedModule: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const intelligenceFeed: FeedEvent[] = [
    {
      id: 'EVT-1042',
      timestamp: '10:42:18',
      type: 'EMERGING RISK PATTERN',
      roadId: 'ROAD R-204',
      roadName: 'Metropolitan Central Expressway',
      summary: 'Evening traffic + low visibility show repeated high-risk association.',
      details: 'Statistical clustering highlights consecutive 18:00–22:00 commute windows with elevated rear-end deceleration conflicts.',
      status: 'CRITICAL',
      metric: 'Risk 82/100'
    },
    {
      id: 'EVT-1039',
      timestamp: '10:39:04',
      type: 'HOTSPOT CLUSTER DETECTED',
      roadId: 'ZONE-07',
      roadName: 'Kathipara Multi-Grade Cloverleaf Egress',
      summary: 'DBSCAN spatial concentration identifies 400m density perimeter.',
      details: '58 collisions registered within 650m radius. Core point density exceeds statistical background noise by 3.2x.',
      status: 'CRITICAL',
      metric: '58 Crashes'
    },
    {
      id: 'EVT-1031',
      timestamp: '10:31:12',
      type: 'ANOMALOUS RISK CHANGE',
      roadId: 'ROAD R-118',
      roadName: 'Logistics Bypass Ring',
      summary: 'Abnormal velocity variance surge: 64 → 76 risk shift.',
      details: 'Recent freight rerouting induced +2.8σ speed differential between commercial trucks and passenger vehicles.',
      status: 'ELEVATED',
      metric: '64 → 76 (+12)'
    },
    {
      id: 'EVT-1024',
      timestamp: '10:24:50',
      type: 'REPEATED SEVERITY PATTERN',
      roadId: 'ROAD R-204',
      roadName: 'Central Expressway Curve Approach',
      summary: 'Severe hospitalization index over-represented during dusk transitions.',
      details: '9 fatal casualties and 22 severe injuries documented across past 36 months, concentrated around unlit flyover approaches.',
      status: 'ELEVATED',
      metric: '9 Fatalities'
    },
    {
      id: 'EVT-1015',
      timestamp: '10:15:33',
      type: 'EMERGING RISK PATTERN',
      roadId: 'ROAD R-106',
      roadName: 'Akkarai Maritime Coast Boulevard',
      summary: 'Maritime humidity film induces dynamic friction loss (<0.28 coeff).',
      details: 'Precipitation combined with sea mist increases hydroplaning vulnerability during late night weekend speeds.',
      status: 'CRITICAL',
      metric: 'Skid Coeff 0.24'
    }
  ];

  const filtered = filterType === 'ALL' 
    ? intelligenceFeed 
    : intelligenceFeed.filter(e => e.type === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-[#E6E3DC] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
            STAGE 3: DETECT
          </span>
          <h2 className="text-xl font-black text-[#1C1E21] uppercase tracking-tight mt-1">
            Real-Time AI Intelligence Feed
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Continuous autonomous stream identifying anomalies, spatial hotspot clusters, and systemic recurring risk patterns.
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-[#E6E3DC] text-xs font-mono">
          {['ALL', 'EMERGING RISK PATTERN', 'HOTSPOT CLUSTER DETECTED', 'ANOMALOUS RISK CHANGE'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filterType === t 
                  ? 'bg-[#1C1E21] text-white shadow-xs' 
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              {t === 'ALL' ? 'ALL EVENTS' : t.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List (Monospace terminal + digital twin styling) */}
      <div className="space-y-3 font-mono">
        {filtered.map(evt => {
          const isCritical = evt.status === 'CRITICAL';
          const statusColor = isCritical ? 'text-[#DC2626]' : 'text-[#F97316]';
          const dotColor = isCritical ? 'bg-[#DC2626]' : 'bg-[#F97316]';

          return (
            <div
              key={evt.id}
              className="bg-white border border-[#E6E3DC] rounded-xl p-5 shadow-xs hover:border-zinc-400 transition-all space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E3DC] pb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
                  <span className="font-bold text-zinc-500 text-[11px]">{evt.timestamp}</span>
                  <span className="text-zinc-300">|</span>
                  <span className={`font-black tracking-wider text-[11px] ${statusColor}`}>
                    {evt.type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-violet-700 font-mono">{evt.roadId}</span>
                  {evt.metric && (
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 text-[11px] font-bold">
                      {evt.metric}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <div className="text-sm font-sans font-bold text-[#1C1E21]">
                  {evt.summary}
                </div>
                <div className="text-zinc-600 font-sans text-xs mt-1 leading-relaxed">
                  {evt.details}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F4F2EC] flex items-center justify-between text-[11px] text-zinc-500 font-sans">
                <span>Location: <strong>{evt.roadName}</strong></span>
                <span className="text-violet-700 font-mono font-semibold flex items-center gap-1">
                  <span>Diagnostic Verified</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
