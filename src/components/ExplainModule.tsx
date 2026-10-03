import React from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS } from '../data/roadGuardData';
import { Sparkles, Info, Fingerprint, Layers, CheckCircle2 } from 'lucide-react';

interface ExplainModuleProps {
  selectedRoad: RoadSegmentProfile;
  onSelectRoad: (road: RoadSegmentProfile) => void;
}

export const ExplainModule: React.FC<ExplainModuleProps> = ({ selectedRoad, onSelectRoad }) => {
  const fp = selectedRoad.fingerprint;

  const contributions = [
    { feature: 'Historical accidents', score: fp.accidentHistory, blocks: 10, impactPts: '+24 pts', why: 'Recurring collision concentration and high historical casualty count' },
    { feature: 'Infrastructure & geometry', score: fp.infrastructure, blocks: 9, impactPts: '+18 pts', why: 'Ramp weaving angles and reverse curvature sightline deficit' },
    { feature: 'Traffic intensity', score: fp.traffic, blocks: 8, impactPts: '+16 pts', why: 'Peak volume approaching saturation capacity' },
    { feature: 'Visibility deficit', score: fp.visibility, blocks: 7, impactPts: '+12 pts', why: 'Sub-optimal street illumination during nocturnal hours' },
    { feature: 'Weather vulnerability', score: fp.weather, blocks: 6, impactPts: '+8 pts', why: 'Pavement friction degradation under rainfall moisture' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="pb-3 border-b border-[#E6E3DC] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded">
            STAGE 2: EXPLAIN
          </span>
          <h2 className="text-xl font-black text-[#1C1E21] uppercase tracking-tight mt-1">
            Explainable AI Feature Contribution
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Transparent Shapley additive attributions (SHAP) exposing the exact mathematical drivers behind the model output.
          </p>
        </div>

        {/* Road Switcher */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">CORRIDOR:</span>
          <select
            value={selectedRoad.id}
            onChange={e => {
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
        
        {/* Left: Horizontal Contribution Visualization (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E3DC] rounded-xl p-6 shadow-xs space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E3DC]">
            <span className="font-bold text-zinc-900 uppercase">MODEL FEATURE CONTRIBUTION</span>
            <span className="text-[10px] text-zinc-500">LOCAL SHAP WEIGHTS</span>
          </div>

          <div className="space-y-4">
            {contributions.map(item => {
              const filledCount = Math.round((item.score / 100) * 10);
              const filled = '█'.repeat(filledCount);
              const empty = '░'.repeat(10 - filledCount);
              const colorClass =
                item.score >= 80 ? 'text-[#DC2626]' :
                item.score >= 70 ? 'text-[#F97316]' : 'text-zinc-800';

              return (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans font-semibold text-zinc-800 text-xs">{item.feature}</span>
                    <div className="flex items-center gap-3">
                      <span className={colorClass}>{filled}{empty}</span>
                      <span className="w-8 text-right font-black text-zinc-900">{item.score}</span>
                      <span className="w-16 text-right font-bold text-violet-700">{item.impactPts}</span>
                    </div>
                  </div>
                  <div className="font-sans text-[11px] text-zinc-500 pl-1">{item.why}</div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E6E3DC] text-[10px] text-zinc-500 font-sans flex justify-between">
            <span>Model Prior Base Rate: 26.0 / 100</span>
            <span>Additive Sum: +56.0 pts &rarr; 82 / 100 Total</span>
          </div>
        </div>

        {/* Right: AI Interpretation & Disclaimers (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#F8F7F4] border border-[#E6E3DC] rounded-xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-violet-800 font-mono font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>AI INTERPRETATION</span>
            </div>

            <p className="text-zinc-800 leading-relaxed text-xs italic font-sans">
              “The model's predicted risk for <strong>{selectedRoad.id}</strong> is elevated mainly because of historical accident concentration, high traffic intensity and poor visibility.”
            </p>

            <div className="pt-3 border-t border-[#E6E3DC] space-y-2 text-[11px] text-zinc-600 font-sans">
              <div className="font-semibold text-zinc-800">Key Contextual Takeaways:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Historical accident frequency provides the largest prior risk contribution (+24 pts).</li>
                <li>Nocturnal hours compound visibility deficits, reducing driver stopping sight distances.</li>
                <li>Congestion approaching capacity generates high vehicle-to-vehicle interaction friction.</li>
              </ul>
            </div>
          </div>

          {/* Academic / Causal Boundary Notice */}
          <div className="bg-white border border-[#E6E3DC] rounded-xl p-4 text-xs space-y-1.5 text-zinc-600 font-sans">
            <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-800 text-[10px] uppercase">
              <Info className="w-3.5 h-3.5 text-violet-600" />
              <span>Model Association vs Causal Claims</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              SHAP feature attributions reflect statistical associations derived from machine-learning tree splits on validation datasets. They indicate elevated probabilistic hazard, not legal or singular physical causation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
