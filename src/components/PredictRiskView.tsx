import React, { useState } from 'react';
import { 
  PredictionInput, 
  PredictionResult, 
  HotspotCluster, 
  WeatherCondition, 
  RoadSurface, 
  TrafficDensity, 
  RoadType, 
  JunctionType, 
  LightingCondition 
} from '../types/accident';
import { predictAccidentRisk } from '../services/mlRiskModel';
import { KNOWN_HUBS } from '../data/mockAccidentData';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Compass, 
  TrendingUp, 
  Info, 
  Sparkles,
  ArrowRight,
  Sliders,
  Car
} from 'lucide-react';

interface PredictRiskViewProps {
  hotspots: HotspotCluster[];
  prefilledInput?: Partial<PredictionInput> | null;
}

export const PredictRiskView: React.FC<PredictRiskViewProps> = ({ hotspots, prefilledInput }) => {
  // Form State
  const [selectedHub, setSelectedHub] = useState<string>(prefilledInput?.locationName || KNOWN_HUBS[0].name);
  const [date, setDate] = useState<string>(prefilledInput?.date || '2026-10-02');
  const [time, setTime] = useState<string>(prefilledInput?.time || '18:30');
  const [weather, setWeather] = useState<WeatherCondition>(prefilledInput?.weather || 'Rain');
  const [roadSurface, setRoadSurface] = useState<RoadSurface>(prefilledInput?.roadSurface || 'Wet');
  const [trafficLevel, setTrafficLevel] = useState<TrafficDensity>(prefilledInput?.trafficLevel || 'Heavy');
  const [roadType, setRoadType] = useState<RoadType>(prefilledInput?.roadType || 'Urban Arterial');
  const [junctionType, setJunctionType] = useState<JunctionType>(prefilledInput?.junctionType || 'Flyover Ramp');
  const [speedLimit, setSpeedLimit] = useState<number>(prefilledInput?.speedLimit || 60);
  const [visibilityKm, setVisibilityKm] = useState<number>(prefilledInput?.visibilityKm || 4.0);
  const [lanes, setLanes] = useState<number>(prefilledInput?.lanes || 4);
  const [lighting, setLighting] = useState<LightingCondition>(prefilledInput?.lighting || 'Dusk/Dawn');
  const [selectedModel, setSelectedModel] = useState<string>('XGBoost (Gradient Boosted Trees)');

  // Coordinates
  const currentHubObj = KNOWN_HUBS.find(h => h.name === selectedHub) || KNOWN_HUBS[0];
  const [lat, setLat] = useState<number>(prefilledInput?.latitude || currentHubObj.lat);
  const [lng, setLng] = useState<number>(prefilledInput?.longitude || currentHubObj.lng);

  // Prediction Result
  const [result, setResult] = useState<PredictionResult | null>(() => {
    // Initial default prediction
    const hour = 18;
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    return predictAccidentRisk(
      {
        locationName: currentHubObj.name,
        latitude: currentHubObj.lat,
        longitude: currentHubObj.lng,
        date: '2026-10-02',
        time: '18:30',
        weather: 'Rain',
        roadSurface: 'Wet',
        trafficLevel: 'Heavy',
        roadType: 'Urban Arterial',
        junctionType: 'Flyover Ramp',
        speedLimit: 60,
        visibilityKm: 4.0,
        lanes: 4,
        lighting: 'Dusk/Dawn',
        isPeakHour: isPeak,
        isWeekend: false
      },
      hotspots,
      'XGBoost (Gradient Boosted Trees)'
    );
  });

  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  // When hub changes, update coordinates and road defaults
  const handleHubSelect = (hubName: string) => {
    setSelectedHub(hubName);
    const hub = KNOWN_HUBS.find(h => h.name === hubName);
    if (hub) {
      setLat(hub.lat);
      setLng(hub.lng);
      setRoadType(hub.roadType);
      setSpeedLimit(hub.speedLimit);
      setJunctionType(hub.junctionType);
    }
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);

    const hour = parseInt(time.split(':')[0] || '12', 10);
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    setTimeout(() => {
      const pred = predictAccidentRisk(
        {
          locationName: selectedHub,
          latitude: lat,
          longitude: lng,
          date,
          time,
          weather,
          roadSurface,
          trafficLevel,
          roadType,
          junctionType,
          speedLimit,
          visibilityKm,
          lanes,
          lighting,
          isPeakHour,
          isWeekend
        },
        hotspots,
        selectedModel
      );
      setResult(pred);
      setIsPredicting(false);
    }, 280);
  };

  // Generate 24-hour projected risk curve for this location
  const hourlyRiskCurve = Array.from({ length: 24 }, (_, h) => {
    const isPeak = (h >= 8 && h <= 10) || (h >= 17 && hourRiskFactor(h));
    function hourRiskFactor(hr: number) { return hr <= 20; }
    let lightCondition: LightingCondition = 'Daylight';
    if (h >= 6 && h < 18) lightCondition = 'Daylight';
    else if (h === 18 || h === 5) lightCondition = 'Dusk/Dawn';
    else lightCondition = lighting.includes('No Street Lights') ? 'Dark - No Street Lights' : 'Dark - Street Lights On';

    let traffic: TrafficDensity = trafficLevel;
    if (isPeak) traffic = 'Heavy';
    else if (h >= 23 || h <= 5) traffic = 'Low';

    const p = predictAccidentRisk(
      {
        locationName: selectedHub,
        latitude: lat,
        longitude: lng,
        date,
        time: `${h.toString().padStart(2, '0')}:00`,
        weather,
        roadSurface,
        trafficLevel: traffic,
        roadType,
        junctionType,
        speedLimit,
        visibilityKm,
        lanes,
        lighting: lightCondition,
        isPeakHour: isPeak,
        isWeekend: false
      },
      hotspots,
      selectedModel
    );
    return { hour: h, score: p.riskScore, level: p.riskLevel };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            Predict Accident Risk & Explain Factors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Machine-learning risk evaluation engine calibrated with historical crash datasets, spatial clustering, and SHAP feature attribution.
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">ML Model:</span>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="bg-transparent font-medium text-indigo-300 focus:outline-hidden cursor-pointer"
          >
            <option value="XGBoost (Gradient Boosted Trees)" className="bg-slate-900 text-white">XGBoost (ROC-AUC 0.948)</option>
            <option value="Random Forest Classifier" className="bg-slate-900 text-white">Random Forest (ROC-AUC 0.932)</option>
            <option value="LightGBM" className="bg-slate-900 text-white">LightGBM (ROC-AUC 0.942)</option>
            <option value="Logistic Regression (L2 Baseline)" className="bg-slate-900 text-white">Logistic Regression (ROC-AUC 0.865)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Input Risk Context & Parameters
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">11 Features</span>
          </div>

          <form onSubmit={handlePredict} className="space-y-3.5 text-xs">
            
            {/* Location Corridor Preset */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Location / Study Corridor</label>
              <select
                value={selectedHub}
                onChange={e => handleHubSelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-hidden"
              >
                {KNOWN_HUBS.map(hub => (
                  <option key={hub.name} value={hub.name}>
                    {hub.name} ({hub.baseRisk} baseline)
                  </option>
                ))}
              </select>
            </div>

            {/* Coordinates Lat / Lng */}
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div>
                <label className="block text-[11px] mb-0.5">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={e => setLat(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] mb-0.5">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={e => setLng(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Time (24h)</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Weather & Road Surface */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Weather Condition</label>
                <select
                  value={weather}
                  onChange={e => setWeather(e.target.value as WeatherCondition)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Clear">Clear</option>
                  <option value="Rain">Rain</option>
                  <option value="Fog/Mist">Fog / Mist</option>
                  <option value="Storm">Storm</option>
                  <option value="Snow">Snow</option>
                  <option value="Windy">Windy</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Road Surface</label>
                <select
                  value={roadSurface}
                  onChange={e => setRoadSurface(e.target.value as RoadSurface)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Dry">Dry Pavement</option>
                  <option value="Wet">Wet Asphalt</option>
                  <option value="Flooded">Flooded / Standing Water</option>
                  <option value="Loose Gravel">Loose Gravel</option>
                </select>
              </div>
            </div>

            {/* Traffic Level & Lighting */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Traffic Density</label>
                <select
                  value={trafficLevel}
                  onChange={e => setTrafficLevel(e.target.value as TrafficDensity)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Low">Low (Free Flow)</option>
                  <option value="Moderate">Moderate (Steady)</option>
                  <option value="Heavy">Heavy (Congested)</option>
                  <option value="Gridlock">Gridlock (Stop-and-Go)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Lighting Condition</label>
                <select
                  value={lighting}
                  onChange={e => setLighting(e.target.value as LightingCondition)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Daylight">Daylight</option>
                  <option value="Dusk/Dawn">Dusk / Dawn</option>
                  <option value="Dark - Street Lights On">Dark (Street Lights On)</option>
                  <option value="Dark - No Street Lights">Dark (No Street Lights)</option>
                </select>
              </div>
            </div>

            {/* Road Type & Junction Type */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Road Classification</label>
                <select
                  value={roadType}
                  onChange={e => setRoadType(e.target.value as RoadType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Expressway">Expressway</option>
                  <option value="National Highway">National Highway</option>
                  <option value="State Highway">State Highway</option>
                  <option value="Urban Arterial">Urban Arterial</option>
                  <option value="Commercial Collector">Commercial Collector</option>
                  <option value="Residential Street">Residential Street</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Junction Geometry</label>
                <select
                  value={junctionType}
                  onChange={e => setJunctionType(e.target.value as JunctionType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Straight Highway">Straight Road</option>
                  <option value="T-Junction">T-Junction</option>
                  <option value="Crossroad">Crossroad Intersection</option>
                  <option value="Roundabout">Roundabout</option>
                  <option value="Flyover Ramp">Flyover Ramp / Merge</option>
                  <option value="Blind Curve">Blind Curve</option>
                </select>
              </div>
            </div>

            {/* Speed Limit & Visibility */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Speed Limit</span>
                  <span className="font-mono text-indigo-400">{speedLimit} km/h</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="5"
                  value={speedLimit}
                  onChange={e => setSpeedLimit(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Visibility</span>
                  <span className="font-mono text-indigo-400">{visibilityKm} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={visibilityKm}
                  onChange={e => setVisibilityKm(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPredicting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isPredicting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Feature Attributions...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Predict Accident Risk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Score & Explainable AI (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {result && (
            <>
              {/* Primary Score KPI Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">Predicted Accident Risk</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5 flex items-baseline gap-2">
                      <span className={`font-mono ${
                        result.riskScore >= 80 ? 'text-red-400' :
                        result.riskScore >= 60 ? 'text-orange-400' :
                        result.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {result.riskScore}
                      </span>
                      <span className="text-slate-500 text-xl font-normal font-sans">/ 100</span>
                    </h2>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                      result.riskScore >= 81 ? 'bg-red-600 shadow-red-600/30' :
                      result.riskScore >= 61 ? 'bg-orange-600 shadow-orange-600/30' :
                      result.riskScore >= 31 ? 'bg-amber-600 shadow-amber-600/30' : 'bg-emerald-600 shadow-emerald-600/30'
                    }`}>
                      {result.riskLevel} Risk Level
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 font-mono">
                      Model Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Hotspot Proximity Callout if detected */}
                {result.closestHotspot && (
                  <div className="mt-3 py-2 px-3 bg-red-950/40 border border-red-800/40 rounded-lg text-xs flex items-center gap-2 text-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>
                      High spatial correlation: Located <strong>{result.closestHotspot.distanceMeters}m</strong> from cluster <strong>{result.closestHotspot.name}</strong> (Historical score {result.closestHotspot.riskScore}/100).
                    </span>
                  </div>
                )}

                {/* Progress bar gauge */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                    <span>0 Low (0–30)</span>
                    <span>31 Moderate (31–60)</span>
                    <span>61 High (61–80)</span>
                    <span>81 Very High (81–100)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500/80 w-[30%]" />
                    <div className="h-full bg-amber-500/80 w-[30%]" />
                    <div className="h-full bg-orange-500/80 w-[20%]" />
                    <div className="h-full bg-red-500/80 w-[20%]" />
                  </div>
                  {/* Indicator pin */}
                  <div 
                    className="relative w-0 h-0 transition-all duration-500" 
                    style={{ left: `${Math.min(98, Math.max(2, result.riskScore))}%` }}
                  >
                    <div className="w-3 h-3 -mt-1 -ml-1.5 bg-white border-2 border-slate-900 rounded-full shadow-md" />
                  </div>
                </div>

                {/* Digital AI Risk Fingerprint Sub-Scores */}
                {result.fingerprint && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                      Digital AI Risk Fingerprint
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Accident History</span>
                        <span className="text-red-400 font-bold">
                          {'█'.repeat(Math.round(result.fingerprint.accidentHistory / 10))}{'░'.repeat(10 - Math.round(result.fingerprint.accidentHistory / 10))} {result.fingerprint.accidentHistory}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Traffic Density</span>
                        <span className="text-orange-400 font-bold">
                          {'█'.repeat(Math.round(result.fingerprint.traffic / 10))}{'░'.repeat(10 - Math.round(result.fingerprint.traffic / 10))} {result.fingerprint.traffic}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Infrastructure</span>
                        <span className="text-amber-400 font-bold">
                          {'█'.repeat(Math.round(result.fingerprint.infrastructure / 10))}{'░'.repeat(10 - Math.round(result.fingerprint.infrastructure / 10))} {result.fingerprint.infrastructure}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Weather Risk</span>
                        <span className="text-blue-400 font-bold">
                          {'█'.repeat(Math.round(result.fingerprint.weather / 10))}{'░'.repeat(10 - Math.round(result.fingerprint.weather / 10))} {result.fingerprint.weather}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Visibility</span>
                        <span className="text-purple-400 font-bold">
                          {'█'.repeat(Math.round(result.fingerprint.visibility / 10))}{'░'.repeat(10 - Math.round(result.fingerprint.visibility / 10))} {result.fingerprint.visibility}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Severity Pattern</span>
                        <span className="text-red-400 font-bold">
                          {'█'.repeat(Math.round(result.fingerprint.severityPattern / 10))}{'░'.repeat(10 - Math.round(result.fingerprint.severityPattern / 10))} {result.fingerprint.severityPattern}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Explainable AI: SHAP Feature Contributions */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Explainable AI: Feature Attribution (SHAP)</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Baseline Prior: +{result.baseRate} pts</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Individual feature impacts calculated via Shapley additive attributions on {result.modelUsed}. Green bars reduce risk; red bars increase hazard probability.
                </p>

                {/* Waterfall-style Feature Bars */}
                <div className="space-y-2 pt-1">
                  {result.contributions.map((c, i) => {
                    const isPositive = c.direction === 'increase';
                    const barWidth = Math.min(100, Math.abs(c.impactScore) * 4);

                    return (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-200 font-medium">{c.feature}</span>
                          <span className={`font-mono font-bold ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isPositive ? `+${c.impactScore}` : c.impactScore} pts
                          </span>
                        </div>
                        
                        {/* Two-way directional bar */}
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                          {isPositive ? (
                            <>
                              <div className="w-1/2" />
                              <div 
                                className="h-full bg-red-500 rounded-r-full transition-all duration-300"
                                style={{ width: `${barWidth / 2}%` }}
                              />
                            </>
                          ) : (
                            <>
                              <div className="w-1/2 flex justify-end">
                                <div 
                                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
                                  style={{ width: `${barWidth / 2}%` }}
                                />
                              </div>
                              <div className="w-1/2" />
                            </>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 pl-1">{c.explanation}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Causation vs Correlation Academic Disclaimer */}
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5 italic">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Note: Contributing factors are derived mathematically from trained statistical weights and Shapley values; they indicate probabilistic association, not legal or singular physical causation.
                  </span>
                </div>
              </div>

              {/* Recommended Precautions & Engineering Observations */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Recommended Preventive Precautions</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {result.recommendedPrecautions.map((prec, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-300">{prec}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  General preventive guidance derived from model risk factors. Intended for analytical decision support, not replacing statutory traffic management manuals.
                </div>
              </div>

              {/* Advanced Feature 1: Time-Based 24-Hour Projected Risk Curve */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">24-Hour Dynamic Temporal Risk Horizon</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Location: {selectedHub}</span>
                </div>

                <p className="text-xs text-slate-400">
                  Hourly risk progression under forecasted diurnal traffic peaks and daylight transitions for this corridor.
                </p>

                {/* 24-column bar graph */}
                <div className="h-28 flex items-end gap-1 pt-4 pb-2 border-b border-slate-800">
                  {hourlyRiskCurve.map(hr => {
                    const isSelectedHour = parseInt(time.split(':')[0], 10) === hr.hour;
                    const heightPercent = Math.max(10, hr.score);
                    const color =
                      hr.score >= 80 ? 'bg-red-500' :
                      hr.score >= 60 ? 'bg-orange-500' :
                      hr.score >= 35 ? 'bg-amber-500' : 'bg-emerald-500';

                    return (
                      <div
                        key={hr.hour}
                        onClick={() => setTime(`${hr.hour.toString().padStart(2, '0')}:00`)}
                        title={`Hour ${hr.hour}:00 - Risk ${hr.score}/100 (${hr.level})`}
                        className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                      >
                        <div
                          className={`w-full rounded-t-xs transition-all ${color} ${
                            isSelectedHour ? 'ring-2 ring-white opacity-100 scale-y-105' : 'opacity-70 group-hover:opacity-100'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>00:00 (Midnight)</span>
                  <span>06:00 (Dawn)</span>
                  <span>12:00 (Noon)</span>
                  <span>18:00 (Dusk)</span>
                  <span>23:00</span>
                </div>
              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};
