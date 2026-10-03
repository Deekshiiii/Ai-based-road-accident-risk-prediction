import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AccidentRecord, HotspotCluster, WeatherCondition, RoadType, AccidentSeverity, RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS, EMERGING_ANOMALIES, EMERGENCY_FACILITIES } from '../data/roadGuardData';
import { 
  Search, 
  Layers, 
  Filter, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Crosshair, 
  Ambulance, 
  Clock, 
  Fingerprint,
  Hospital
} from 'lucide-react';

interface HotspotMapViewProps {
  accidents: AccidentRecord[];
  hotspots: HotspotCluster[];
  onSelectHotspotForPrediction: (hotspot: HotspotCluster) => void;
  onSelectSegmentForFingerprint?: (segment: RoadSegmentProfile) => void;
}

export const HotspotMapView: React.FC<HotspotMapViewProps> = ({
  accidents,
  hotspots,
  onSelectHotspotForPrediction,
  onSelectSegmentForFingerprint
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Filters & Layer Toggles
  const [severityFilter, setSeverityFilter] = useState<'All' | AccidentSeverity>('All');
  const [weatherFilter, setWeatherFilter] = useState<'All' | WeatherCondition>('All');
  const [showHotspotZones, setShowHotspotZones] = useState(true);
  const [showRoadSegments, setShowRoadSegments] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [showEmergencyCenters, setShowEmergencyCenters] = useState(true);
  const [showAccidentPoints, setShowAccidentPoints] = useState(false);
  const [selectedTimeSlice, setSelectedTimeSlice] = useState<string>('08:00 PM');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<RoadSegmentProfile | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.99, 80.20],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true
    });

    // Dark cartographic tiles for high-contrast GIS
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when toggles, time, or data change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Road Segments with dynamic diurnal score
    if (showRoadSegments) {
      ROAD_SEGMENTS.forEach(seg => {
        const timeScore = seg.diurnalRisk[selectedTimeSlice] || seg.currentRiskScore;
        const color =
          timeScore >= 80 ? '#ef4444' :
          timeScore >= 60 ? '#f97316' :
          timeScore >= 35 ? '#eab308' : '#22c55e';

        // Road segment line
        const polyline = L.polyline(
          [
            [seg.startLat, seg.startLng],
            [seg.centerLat, seg.centerLng],
            [seg.endLat, seg.endLng]
          ],
          {
            color: color,
            weight: 6,
            opacity: 0.85
          }
        );

        // Segment Center Dot
        const marker = L.circleMarker([seg.centerLat, seg.centerLng], {
          radius: 6,
          color: '#ffffff',
          weight: 1.5,
          fillColor: color,
          fillOpacity: 1
        });

        // Popup Content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-slate-100 min-w-[280px] font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between pb-2 border-b border-slate-700/80 mb-2">
            <div>
              <span class="text-[10px] font-mono font-bold text-indigo-400 uppercase">${seg.id}</span>
              <div class="text-xs font-bold text-white">${seg.name}</div>
            </div>
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded text-white ${
              timeScore >= 80 ? 'bg-red-600' :
              timeScore >= 60 ? 'bg-orange-600' :
              timeScore >= 35 ? 'bg-amber-600' : 'bg-emerald-600'
            }">${timeScore}/100</span>
          </div>
          <div class="space-y-1 text-xs text-slate-300">
            <div class="flex justify-between">
              <span>Road Type:</span>
              <span class="font-medium text-slate-200">${seg.roadType}</span>
            </div>
            <div class="flex justify-between">
              <span>Speed Limit:</span>
              <span class="font-mono text-indigo-300">${seg.speedLimit} km/h</span>
            </div>
            <div class="flex justify-between">
              <span>Diurnal Window:</span>
              <span class="font-mono text-white font-semibold">${selectedTimeSlice}</span>
            </div>
            <div class="flex justify-between">
              <span>Emergency Access:</span>
              <span class="font-bold ${seg.isHighRiskLimitedEmergency ? 'text-red-400' : 'text-emerald-400'}">${seg.emergencyAccess}</span>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-700/80 flex gap-2">
            <button id="btn-fp-${seg.id}" class="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded text-xs transition-colors">
              Risk Fingerprint
            </button>
          </div>
        `;

        polyline.bindPopup(popupContent);
        marker.bindPopup(popupContent);

        polyline.on('popupopen', () => {
          setSelectedSegment(seg);
          const btn = document.getElementById(`btn-fp-${seg.id}`);
          if (btn && onSelectSegmentForFingerprint) {
            btn.onclick = () => onSelectSegmentForFingerprint(seg);
          }
        });

        layerGroup.addLayer(polyline);
        layerGroup.addLayer(marker);
      });
    }

    // 2. Render DBSCAN Hotspot Zones
    if (showHotspotZones) {
      hotspots.forEach(h => {
        const color =
          h.riskScore >= 80 ? '#ef4444' :
          h.riskScore >= 60 ? '#f97316' :
          h.riskScore >= 35 ? '#eab308' : '#22c55e';

        const circle = L.circle([h.centerLat, h.centerLng], {
          radius: h.radiusMeters,
          color: color,
          weight: 1.5,
          opacity: 0.6,
          fillColor: color,
          fillOpacity: 0.15,
          dashArray: '3, 4'
        });

        circle.bindPopup(`
          <div class="p-2.5 text-xs text-white min-w-[210px]">
            <div class="font-bold text-white pb-1 border-b border-slate-700 mb-1 flex justify-between">
              <span>${h.name}</span>
              <span class="text-amber-400 font-mono">${h.riskScore}/100</span>
            </div>
            <div class="text-slate-300">
              <div>Accidents: <strong>${h.accidentCount}</strong> (Fatal: ${h.fatalCount})</div>
              <div>Primary: ${h.primaryRiskFactor}</div>
            </div>
          </div>
        `);

        layerGroup.addLayer(circle);
      });
    }

    // 3. Render Emerging Anomalies (Pulsing radar points)
    if (showAnomalies) {
      EMERGING_ANOMALIES.forEach(anom => {
        const matchedSeg = ROAD_SEGMENTS.find(s => s.id === anom.segmentId);
        if (!matchedSeg) return;

        const anomalyMarker = L.circleMarker([matchedSeg.centerLat, matchedSeg.centerLng], {
          radius: 12,
          color: '#ef4444',
          weight: 2,
          fillColor: '#dc2626',
          fillOpacity: 0.6
        });

        anomalyMarker.bindPopup(`
          <div class="p-3 text-xs text-white min-w-[240px]">
            <div class="text-red-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-700 mb-1.5">
              <span>⚠️ Emerging Anomaly Detected</span>
              <span class="ml-auto font-mono text-[10px] bg-red-900 px-1.5 rounded">${anom.deviationZScore}σ</span>
            </div>
            <div class="font-bold text-white mb-1">${anom.segmentName}</div>
            <div class="text-slate-300 space-y-1">
              <div>Type: ${anom.type}</div>
              <div>Observed: <strong class="text-red-300">${anom.observedValue}</strong></div>
              <div>Action: ${anom.preventiveAdvisory}</div>
            </div>
          </div>
        `);

        layerGroup.addLayer(anomalyMarker);
      });
    }

    // 4. Render Emergency Facilities
    if (showEmergencyCenters) {
      EMERGENCY_FACILITIES.forEach(fac => {
        const marker = L.circleMarker([fac.lat, fac.lng], {
          radius: 7,
          color: '#38bdf8',
          weight: 2,
          fillColor: '#0284c7',
          fillOpacity: 0.9
        });

        const coverage = L.circle([fac.lat, fac.lng], {
          radius: fac.coverageRadiusMeters,
          color: '#38bdf8',
          weight: 1,
          opacity: 0.35,
          fillColor: '#0284c7',
          fillOpacity: 0.05,
          dashArray: '2, 4'
        });

        marker.bindPopup(`
          <div class="p-2.5 text-xs text-white min-w-[220px]">
            <div class="font-bold text-sky-400 pb-1 border-b border-slate-700 mb-1 flex items-center gap-1.5">
              <span>🚑 ${fac.name}</span>
            </div>
            <div class="text-slate-300 text-[11px] space-y-1">
              <div>Type: ${fac.type}</div>
              <div>Coverage Radius: ${(fac.coverageRadiusMeters / 1000).toFixed(1)} km</div>
              <div>Avg Paramedic Dispatch: <strong class="text-emerald-400">${fac.averageDispatchMin} min</strong></div>
            </div>
          </div>
        `);

        layerGroup.addLayer(coverage);
        layerGroup.addLayer(marker);
      });
    }

    // 5. Render Individual Accident Points (Optional toggle)
    if (showAccidentPoints) {
      accidents.slice(0, 200).forEach(acc => {
        const pt = L.circleMarker([acc.latitude, acc.longitude], {
          radius: 3,
          color: acc.severity === 'Fatal' ? '#ef4444' : acc.severity === 'Severe' ? '#f97316' : '#eab308',
          weight: 1,
          fillOpacity: 0.7
        });
        layerGroup.addLayer(pt);
      });
    }

  }, [accidents, hotspots, showRoadSegments, showHotspotZones, showAnomalies, showEmergencyCenters, showAccidentPoints, selectedTimeSlice, onSelectSegmentForFingerprint]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const matchedSeg = ROAD_SEGMENTS.find(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase() === searchQuery.toLowerCase()
    );

    if (matchedSeg) {
      mapInstanceRef.current.flyTo([matchedSeg.centerLat, matchedSeg.centerLng], 14, { duration: 1.2 });
      setSelectedSegment(matchedSeg);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-3">
      
      {/* Top Filter and Diurnal Time Slider Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[220px] max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search segment (e.g., R-102, Kathipara, GST)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Locate
          </button>
        </form>

        {/* Diurnal Time Slider Bar (8 AM to 11 PM) */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-medium hidden sm:inline">Diurnal Shift:</span>
          {['08:00 AM', '12:00 PM', '05:00 PM', '08:00 PM', '11:00 PM'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTimeSlice(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                selectedTimeSlice === t
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowRoadSegments(!showRoadSegments)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showRoadSegments ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            Segments
          </button>

          <button
            onClick={() => setShowHotspotZones(!showHotspotZones)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showHotspotZones ? 'bg-amber-500/15 border-amber-500/50 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            Hotspots
          </button>

          <button
            onClick={() => setShowAnomalies(!showAnomalies)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showAnomalies ? 'bg-red-500/15 border-red-500/50 text-red-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            ⚠️ Anomalies
          </button>

          <button
            onClick={() => setShowEmergencyCenters(!showEmergencyCenters)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showEmergencyCenters ? 'bg-sky-500/15 border-sky-500/50 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            🚑 Trauma Units
          </button>
        </div>

      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg p-3 text-xs shadow-xl space-y-2 pointer-events-auto">
          <div className="font-semibold text-slate-200 flex items-center justify-between pb-1 border-b border-slate-800">
            <span>ROADGUARD Risk Matrix</span>
            <span className="font-mono text-[10px] text-indigo-400">{selectedTimeSlice}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-300">Very High (81–100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-slate-300">High (61–80)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Moderate (31–60)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">Low (0–30)</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800 flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Anomaly Point
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Trauma Unit
            </span>
          </div>
        </div>

        {/* Selected Segment Inspection Card */}
        {selectedSegment && (
          <div className="absolute top-4 right-4 z-10 max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 text-xs shadow-2xl space-y-2.5">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <span className="text-indigo-400 text-[10px] font-mono font-bold uppercase">{selectedSegment.id}</span>
                <h4 className="text-sm font-bold text-white">{selectedSegment.name}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-white font-bold text-xs ${
                selectedSegment.currentRiskScore >= 80 ? 'bg-red-600' :
                selectedSegment.currentRiskScore >= 60 ? 'bg-orange-600' :
                selectedSegment.currentRiskScore >= 35 ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {selectedSegment.currentRiskScore}/100
              </span>
            </div>

            <div className="space-y-1 text-slate-300 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Period:</span>
                <span className="font-semibold text-amber-400">{selectedSegment.peakRiskPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Access:</span>
                <span className={`font-bold ${selectedSegment.isHighRiskLimitedEmergency ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedSegment.emergencyAccess} ({selectedSegment.nearestHospitalDistanceKm} km)
                </span>
              </div>
            </div>

            {onSelectSegmentForFingerprint && (
              <button
                onClick={() => onSelectSegmentForFingerprint(selectedSegment)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/30 cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Open Digital Risk Fingerprint</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
