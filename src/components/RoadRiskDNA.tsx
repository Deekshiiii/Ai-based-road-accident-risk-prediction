import React from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { 
  Fingerprint, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Activity, 
  Ambulance, 
  Sparkles,
  Info
} from 'lucide-react';

interface RoadRiskDNAProps {
  segment: RoadSegmentProfile;
}

export const RoadRiskDNA: React.FC<RoadRiskDNAProps> = ({ segment }) => {
  const fp = segment.fingerprint;

  // 6 Radial Dimensions for Risk DNA
  const dimensions = [
    { label: 'ACCIDENT', score: fp.accidentHistory, angle: 0 },
    { label: 'INFRASTRUCTURE', score: fp.infrastructure, angle: 60 },
    { label: 'SEVERITY', score: fp.severityPattern, angle: 120 },
    { label: 'WEATHER', score: fp.weather, angle: 180 },
    { label: 'EMERGENCY', score: segment.isHighRiskLimitedEmergency ? 88 : 45, angle: 240 },
    { label: 'TRAFFIC', score: fp.traffic, angle: 300 }
  ];

  // SVG Radial Math: center at (150, 150), radius 110
  const cx = 150;
  const cy = 150;
  const maxR = 100;

  // Compute polygon vertices
  const pointsString = dimensions.map(d => {
    // rad = (d.angle - 90) * (PI / 180) so angle 0 is at top
    const rad = ((d.angle - 90) * Math.PI) / 180;
    const r = (d.score / 100) * maxR;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const gridCircles = [25, 50, 75, 100];

  return (
    <div className="bg-[#F8F7F4] border border-[#E6E3DC] rounded-xl p-5 shadow-xs text-[#1C1E21] space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E6E3DC] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-800 text-[10px] font-mono font-bold uppercase">
              ROAD RISK DNA
            </span>
            <span className="font-mono text-zinc-500 text-xs">ID: {segment.id}</span>
          </div>
          <h3 className="text-base font-extrabold text-[#1C1E21] mt-0.5">{segment.name}</h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black font-mono text-[#1C1E21]">
            {segment.currentRiskScore}
          </span>
          <span className="text-zinc-400 text-sm">/ 100</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase text-white ${
            segment.currentRiskScore >= 80 ? 'bg-[#DC2626]' :
            segment.currentRiskScore >= 60 ? 'bg-[#F97316]' :
            segment.currentRiskScore >= 35 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
          }`}>
            {segment.riskCategory} RISK
          </span>
        </div>
      </div>

      {/* Radial DNA + ASCII Meter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Geometric Radial SVG Star (6 cols) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-[#E6E3DC] relative">
          <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto">
            {/* Background concentric reference rings */}
            {gridCircles.map(pct => (
              <circle
                key={pct}
                cx={cx}
                cy={cy}
                r={(pct / 100) * maxR}
                fill="none"
                stroke="#E6E3DC"
                strokeWidth="1"
                strokeDasharray={pct === 100 ? undefined : '2 2'}
              />
            ))}

            {/* Radial Spoke Lines */}
            {dimensions.map(d => {
              const rad = ((d.angle - 90) * Math.PI) / 180;
              const x2 = cx + maxR * Math.cos(rad);
              const y2 = cy + maxR * Math.sin(rad);
              return (
                <line
                  key={d.label}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="#D4D0C8"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Risk DNA Polygon in Electric Violet */}
            <polygon
              points={pointsString}
              fill="rgba(124, 58, 237, 0.18)"
              stroke="#7C3AED"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Vertex Data Dots & Text Labels */}
            {dimensions.map(d => {
              const rad = ((d.angle - 90) * Math.PI) / 180;
              const r = (d.score / 100) * maxR;
              const vx = cx + r * Math.cos(rad);
              const vy = cy + r * Math.sin(rad);

              // Label placement slightly beyond maxR
              const labelR = maxR + 24;
              const lx = cx + labelR * Math.cos(rad);
              const ly = cy + labelR * Math.sin(rad);

              return (
                <g key={d.label}>
                  <circle cx={vx} cy={vy} r="4.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    className="text-[9px] font-mono font-bold fill-zinc-700 uppercase"
                  >
                    {d.label}
                  </text>
                  <text
                    x={lx}
                    y={ly + 13}
                    textAnchor="middle"
                    className="text-[8px] font-mono font-black fill-violet-700"
                  >
                    {d.score}
                  </text>
                </g>
              );
            })}

            {/* Central Score Node */}
            <circle cx={cx} cy={cy} r="18" fill="#1C1E21" stroke="#FFFFFF" strokeWidth="2" />
            <text x={cx} y={cy + 4} textAnchor="middle" className="text-[10px] font-mono font-black fill-white">
              {segment.currentRiskScore}
            </text>
          </svg>

          <span className="text-[10px] font-mono text-zinc-600 mt-1 uppercase tracking-wider">
            6-AXIS MULTI-VARIABLE RISK DNA
          </span>
        </div>

        {/* Right: Clean Horizontal Contribution Breakdown (6 cols) */}
        <div className="md:col-span-6 space-y-2.5 font-mono text-xs">
          <div className="text-[11px] text-zinc-600 uppercase tracking-widest pb-1 border-b border-[#E6E3DC] flex justify-between">
            <span>DIMENSION</span>
            <span>DNA SCORE</span>
          </div>

          {[
            { name: 'Accident Risk', val: fp.accidentHistory },
            { name: 'Traffic Intensity', val: fp.traffic },
            { name: 'Infrastructure', val: fp.infrastructure },
            { name: 'Weather Risk', val: fp.weather },
            { name: 'Visibility Deficit', val: fp.visibility },
            { name: 'Severity Pattern', val: fp.severityPattern }
          ].map(row => {
            const blocks = Math.round((row.val / 100) * 10);
            const filled = '█'.repeat(blocks);
            const empty = '░'.repeat(10 - blocks);
            const barColor =
              row.val >= 80 ? 'text-[#DC2626]' :
              row.val >= 60 ? 'text-[#F97316]' : 'text-zinc-700';

            return (
              <div key={row.name} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-zinc-700 font-sans font-medium">{row.name}</span>
                <div className="flex items-center gap-2">
                  <span className={barColor}>{filled}{empty}</span>
                  <span className="w-7 text-right font-bold text-zinc-900">{row.val}</span>
                </div>
              </div>
            );
          })}

          {/* Operational Window Callout */}
          <div className="pt-2 border-t border-[#E6E3DC] flex justify-between text-[11px] font-sans text-zinc-600">
            <span>Peak Risk Window:</span>
            <span className="font-mono font-bold text-zinc-900">{segment.peakRiskPeriod}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
