import React, { useState } from 'react';
import { 
  X, 
  Route, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Compass
} from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudio';

interface RouteSafetyAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRouteOnMap?: (routeId: string) => void;
}

export const RouteSafetyAnalyzerModal: React.FC<RouteSafetyAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onSelectRouteOnMap
}) => {
  if (!isOpen) return null;

  const [origin, setOrigin] = useState('Chennai');
  const [destination, setDestination] = useState('Bengaluru');
  const [selectedRouteId, setSelectedRouteId] = useState<'ROUTE_B' | 'ROUTE_A' | 'ROUTE_C'>('ROUTE_B');

  const routes = [
    {
      id: 'ROUTE_B',
      name: 'Route B · Chittoor Bypass Expressway (SAFETY-FIRST ROUTE)',
      isSafetyFirst: true,
      distanceKm: 362,
      travelTime: '6h 58m',
      riskScore: 43,
      riskLevel: 'Moderate',
      weatherRisk: 38,
      accidentHistoryScore: 41,
      trafficRiskScore: 44,
      roadConditionScore: 35,
      highlights: 'Separated grade bypass around Sriperumbudur industrial freight queue; 42% lower heavy-truck intermixing.',
      badgeColor: 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
    },
    {
      id: 'ROUTE_A',
      name: 'Route A · Direct NH-48 via Vellore & Sriperumbudur (FASTEST ROUTE)',
      isSafetyFirst: false,
      distanceKm: 347,
      travelTime: '6h 42m',
      riskScore: 61,
      riskLevel: 'High',
      weatherRisk: 62,
      accidentHistoryScore: 74,
      trafficRiskScore: 79,
      roadConditionScore: 56,
      highlights: 'Chronic bottleneck at Krishnagiri flyover merge with active evening monsoonal hydroplaning warnings.',
      badgeColor: 'border-amber-500 bg-amber-950/30 text-amber-300'
    },
    {
      id: 'ROUTE_C',
      name: 'Route C · Southern Kanchipuram - Tiruvannamalai Trunk',
      isSafetyFirst: false,
      distanceKm: 351,
      travelTime: '6h 51m',
      riskScore: 55,
      riskLevel: 'Moderate',
      weatherRisk: 48,
      accidentHistoryScore: 59,
      trafficRiskScore: 52,
      roadConditionScore: 68,
      highlights: 'Single-lane undivided segments with high two-wheeler density through temple towns.',
      badgeColor: 'border-blue-500 bg-blue-950/30 text-blue-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-emerald-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <Route className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-2">
                <span>INTERSTATE ROUTE SAFETY ANALYZER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-bold">
                  MULTI-CRITERIA AI
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Evaluating Historical Crash Density, Live Weather Fronts & Infrastructure Friction
              </div>
            </div>
          </div>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Origin / Destination Selector */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-2 w-full">
            <span className="text-slate-500 text-[10px] uppercase w-12">FROM:</span>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs font-mono"
            />
          </div>

          <div className="flex-1 flex items-center gap-2 w-full">
            <span className="text-slate-500 text-[10px] uppercase w-12">TO:</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* Route Alternatives */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh]">
          {routes.map(route => {
            const isSelected = selectedRouteId === route.id;
            return (
              <div
                key={route.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  setSelectedRouteId(route.id as any);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900/90 border-emerald-500 shadow-xl' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{route.name}</span>
                      {route.isSafetyFirst && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                          AI RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">{route.highlights}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-500 uppercase">Risk Index</div>
                    <div className={`text-xl font-black ${route.riskScore < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {route.riskScore} <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Submetrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px]">
                  <div>Distance: <strong className="text-white">{route.distanceKm} km</strong></div>
                  <div>Travel Time: <strong className="text-white">{route.travelTime}</strong></div>
                  <div>Weather Risk: <strong className={route.weatherRisk < 50 ? 'text-emerald-400' : 'text-amber-400'}>{route.weatherRisk}%</strong></div>
                  <div>Traffic Score: <strong className={route.trafficRiskScore < 50 ? 'text-emerald-400' : 'text-amber-400'}>{route.trafficRiskScore}%</strong></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Recommendation Summary */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Route B trades <strong className="text-white">+16 mins</strong> for a <strong className="text-emerald-400">29.5% reduction</strong> in collision probability.</span>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              if (onSelectRouteOnMap) onSelectRouteOnMap(selectedRouteId);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shrink-0"
          >
            Apply to Digital Twin
          </button>
        </div>

      </div>
    </div>
  );
};
