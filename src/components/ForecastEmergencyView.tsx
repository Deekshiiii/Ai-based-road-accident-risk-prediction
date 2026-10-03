import React, { useState } from 'react';
import { ROAD_SEGMENTS, FORECAST_DATA, EMERGENCY_FACILITIES } from '../data/roadGuardData';
import { RoadSegmentProfile } from '../types/accident';
import { 
  TrendingUp, 
  Clock, 
  Ambulance, 
  AlertTriangle, 
  ShieldAlert, 
  Hospital, 
  MapPin, 
  Info,
  Calendar,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const ForecastEmergencyView: React.FC = () => {
  // Diurnal Time Evolution State
  const timeSlices = ['08:00 AM', '12:00 PM', '05:00 PM', '08:00 PM', '11:00 PM'];
  const [selectedTimeSlice, setSelectedTimeSlice] = useState<string>('08:00 PM');

  // Filter high risk + limited emergency
  const emergencyBottlenecks = ROAD_SEGMENTS.filter(s => s.isHighRiskLimitedEmergency);

  // Maximum historical accident count for chart normalization
  const maxForecastAccidents = 70;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-emerald-300 font-semibold">
              DYNAMIC EVOLUTION & FORECASTING
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Risk Evolution, Forecasting & Emergency Accessibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Observe diurnal risk shifts across the 24-hour cycle, examine multi-quarter time-series projections, and audit emergency response bottlenecks.
          </p>
        </div>
      </div>

      {/* SECTION 1: DIURNAL RISK EVOLUTION (08:00 AM -> 11:00 PM) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Diurnal Risk Evolution (Hour-by-Hour Corridor Shift)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select time of day to observe how traffic friction, solar illumination, and driver fatigue transform corridor risk.
            </p>
          </div>

          {/* Time Selector Pills / Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto">
            {timeSlices.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTimeSlice(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTimeSlice === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Diurnal Segments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ROAD_SEGMENTS.map(s => {
            const timeScore = s.diurnalRisk[selectedTimeSlice] || s.currentRiskScore;
            const riskCategory =
              timeScore >= 80 ? 'Very High' :
              timeScore >= 60 ? 'High' :
              timeScore >= 35 ? 'Moderate' : 'Low';

            return (
              <div 
                key={s.id} 
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">{s.id} · {s.roadType}</span>
                    <h4 className="font-bold text-white text-xs truncate max-w-[200px]">{s.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs text-white ${
                    timeScore >= 80 ? 'bg-red-600' :
                    timeScore >= 60 ? 'bg-orange-600' :
                    timeScore >= 35 ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {timeScore}/100
                  </span>
                </div>

                {/* Mini diurnal bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>At {selectedTimeSlice}:</span>
                    <span className="font-semibold text-slate-300">{riskCategory} Risk</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        timeScore >= 80 ? 'bg-red-500' :
                        timeScore >= 60 ? 'bg-orange-500' :
                        timeScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${timeScore}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500">
                  Peak Window: <strong className="text-slate-400">{s.peakRiskPeriod}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: RISK FORECASTING TIME-SERIES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Longitudinal Crash Frequency & Predictive Risk Forecast (2025–2026)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical historical monthly incident series combined with auto-regressive ensemble forward projections (95% confidence bands).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-1 bg-indigo-500 rounded" /> Historical Incidents
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-3 h-1 bg-purple-400 border border-dashed rounded" /> Model Forecast (±CI)
            </span>
          </div>
        </div>

        {/* Time-Series Bar/Line Hybrid Visualizer */}
        <div className="h-56 flex items-end gap-2 pt-6 pb-2 border-b border-slate-800 overflow-x-auto">
          {FORECAST_DATA.map((pt, i) => {
            const isHistorical = pt.historicalAccidents !== null;
            const val = isHistorical ? pt.historicalAccidents! : pt.forecastAccidents!;
            const heightPct = Math.max(10, Math.round((val / maxForecastAccidents) * 100));

            return (
              <div 
                key={pt.monthYear}
                className="flex-1 min-w-[48px] flex flex-col items-center h-full justify-end group text-center"
                title={`${pt.monthYear}: ${val} crashes (Risk Score: ${pt.riskIndex}/100)`}
              >
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                  {val}
                </span>

                {/* Forecast confidence whisker line if forecast */}
                {!isHistorical && pt.upperConfidence && pt.lowerConfidence && (
                  <div 
                    className="w-1 bg-purple-400/40 rounded-full"
                    style={{ height: `${Math.round(((pt.upperConfidence - pt.lowerConfidence) / maxForecastAccidents) * 100)}%` }}
                  />
                )}

                <div 
                  className={`w-full rounded-t-xs transition-all ${
                    isHistorical 
                      ? 'bg-indigo-600 hover:bg-indigo-500' 
                      : 'bg-purple-600/80 hover:bg-purple-500 border border-purple-400/60 border-b-0 border-dashed'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Labels below chart */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-2 overflow-x-auto">
          <span>May 2025</span>
          <span>Aug 2025 (Monsoon)</span>
          <span>Dec 2025 (Peak Rain)</span>
          <span>Mar 2026 (Present)</span>
          <span className="text-purple-400 font-bold">&rarr; Forward Forecast Q2–Q3 2026</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-start gap-1.5 italic pt-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Model Methodology: Projections use seasonal SARIMA with seasonal regressors for monsoon precipitation cycles. Clearly labeled as forward probabilistic model estimates.
          </span>
        </div>
      </div>

      {/* SECTION 3: EMERGENCY ACCESSIBILITY INTELLIGENCE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-red-400" />
              Emergency Accessibility & Trauma Facility Proximity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies acute spatial disconnects where high predicted collision severity intersects limited or delayed emergency dispatch capabilities.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-red-950 border border-red-800 text-red-300 font-mono text-xs font-bold">
            {emergencyBottlenecks.length} Critical Chokepoints
          </span>
        </div>

        {/* Critical Overlap Callout Banners */}
        <div className="space-y-3">
          {emergencyBottlenecks.map(bot => (
            <div 
              key={bot.id}
              className="p-4 rounded-xl bg-red-950/30 border border-red-800/80 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px]">
                    {bot.id}
                  </span>
                  <span className="font-bold text-white text-sm">{bot.name}</span>
                  <span className="text-red-400 font-mono font-bold">({bot.currentRiskScore}/100 Risk)</span>
                </div>
                <p className="text-red-200 text-xs">
                  <strong>High Risk + Limited Emergency Accessibility:</strong> Distance to {bot.nearestTraumaCenter} is <strong>{bot.nearestHospitalDistanceKm} km</strong> through dense freight corridors, yielding average paramedic transit latency exceeding 18+ minutes.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-red-900/60 border border-red-700 font-bold text-white text-xs">
                  {bot.emergencyAccess}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trauma Facilities List */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Designated Metropolitan Emergency Response Network
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {EMERGENCY_FACILITIES.map(fac => (
              <div key={fac.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs">
                  <Hospital className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{fac.name}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Type: <span className="text-slate-300">{fac.type}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Coverage: {(fac.coverageRadiusMeters / 1000).toFixed(1)} km</span>
                  <span className="text-emerald-400">Avg: {fac.averageDispatchMin}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
