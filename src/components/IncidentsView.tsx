import React, { useState } from 'react';
import { 
  IncidentRecord, 
  IncidentStatus, 
  OPERATIONAL_INCIDENTS 
} from '../data/operationsData';
import { HighwayCorridor, HIGHWAY_CORRIDORS } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Activity, 
  UserCheck, 
  Navigation, 
  Check, 
  GitBranch, 
  Sparkles, 
  RotateCcw,
  Zap,
  Sliders,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface IncidentsViewProps {
  onOpenWhatIf: () => void;
  onOpenEmergency: () => void;
  onOpenReplay: () => void;
  onOpenCounterfactual: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  onOpenWhatIf,
  onOpenEmergency,
  onOpenReplay,
  onOpenCounterfactual
}) => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>(OPERATIONAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(OPERATIONAL_INCIDENTS[0].id);
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [activeForensicsTab, setActiveForensicsTab] = useState<'OVERVIEW' | 'TIMELINE' | 'CAUSAL_GRAPH' | 'SHAP_EXPLAIN' | 'REPLAY' | 'NEAR_MISS' | 'PREVENTION'>('OVERVIEW');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const matchedHighway = HIGHWAY_CORRIDORS.find(h => h.code === selectedIncident.highwayCode) || HIGHWAY_CORRIDORS[0];

  // Workflow Action Handlers
  const handleUpdateStatus = (newStatus: IncidentStatus) => {
    tacticalAudio.playRadarPing();
    setIncidents(prev => prev.map(inc => {
      if (inc.id === selectedIncident.id) {
        const updated = { ...inc, status: newStatus };
        updated.timeline = [
          ...updated.timeline,
          {
            time: 'Just now (06:30 IST)',
            event: `Status transitioned to ${newStatus}`,
            actor: 'Operational Dispatcher'
          }
        ];
        return updated;
      }
      return inc;
    }));
  };

  const filteredIncidents = incidents.filter(i => {
    if (statusFilter === 'ALL') return true;
    return i.status === statusFilter;
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-5 font-mono text-xs text-slate-200">
      
      {/* Module Title & Workflow Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-base font-black text-white uppercase tracking-wide font-sans">
              INCIDENT MANAGEMENT & FORENSICS WORKSPACE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {incidents.length} TOTAL LOGGED
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Real-Time Collision Intake, Multi-Agency Coordination & Retrospective Causal Attribution
          </div>
        </div>

        {/* Workflow Lifecycle Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] overflow-x-auto">
          {(['ALL', 'DETECTED', 'VERIFIED', 'INVESTIGATING', 'RESPONSE', 'RESOLVED'] as const).map(status => (
            <button
              key={status}
              onClick={() => { tacticalAudio.playRadarPing(); setStatusFilter(status); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-violet-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Left Incident Stream / Right Deep Incident Forensics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Incidents Table / Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[80vh] overflow-y-auto pr-1">
          {filteredIncidents.map(inc => {
            const isSelected = inc.id === selectedIncident.id;
            return (
              <div
                key={inc.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  setSelectedIncidentId(inc.id);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected 
                    ? 'bg-violet-950/30 border-violet-500 shadow-xl' 
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                      inc.severity === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-500/40' : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                    }`}>
                      {inc.severity}
                    </span>
                    <strong className="text-white text-xs">{inc.highwayCode}</strong>
                  </div>

                  <span className="text-[10px] text-slate-500">{inc.id}</span>
                </div>

                <div className="text-white text-[11px] font-sans font-medium line-clamp-2">
                  {inc.title}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>{inc.state} · KP {inc.kmPost}</span>
                  <span className="text-violet-400 font-bold">{inc.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Incident Forensics Workspace (8 Cols) */}
        <div className="lg:col-span-8 bg-[#070B14]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          
          {/* Active Incident Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/40">
                  {selectedIncident.severity}
                </span>
                <span className="text-sm font-extrabold text-white font-sans">{selectedIncident.title}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {selectedIncident.highwayName} ({selectedIncident.highwayCode}) · Kilometer Post {selectedIncident.kmPost} · {selectedIncident.district}, {selectedIncident.state}
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedIncident.status === 'DETECTED' && (
                <button
                  onClick={() => handleUpdateStatus('VERIFIED')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
                >
                  MARK VERIFIED
                </button>
              )}
              {selectedIncident.status === 'VERIFIED' && (
                <button
                  onClick={() => handleUpdateStatus('INVESTIGATING')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer"
                >
                  START INVESTIGATION
                </button>
              )}
              {selectedIncident.status === 'INVESTIGATING' && (
                <button
                  onClick={() => handleUpdateStatus('RESPONSE')}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer"
                >
                  START RESPONSE
                </button>
              )}
              {selectedIncident.status === 'RESPONSE' && (
                <button
                  onClick={() => handleUpdateStatus('RESOLVED')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
                >
                  CLOSE INCIDENT
                </button>
              )}
            </div>
          </div>

          {/* Forensics Sub-Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] overflow-x-auto">
            {(['OVERVIEW', 'TIMELINE', 'CAUSAL_GRAPH', 'SHAP_EXPLAIN', 'REPLAY', 'NEAR_MISS', 'PREVENTION'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { tacticalAudio.playRadarPing(); setActiveForensicsTab(tab); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeForensicsTab === tab ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW METRIC GRID */}
          {activeForensicsTab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] text-slate-500">AFFECTED LANES</div>
                  <div className="text-sm font-bold text-white mt-1">{selectedIncident.affectedLanes}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] text-slate-500">SPEED DROP</div>
                  <div className="text-sm font-bold text-red-400 mt-1">-{selectedIncident.trafficSpeedDropKmh} km/h</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] text-slate-500">EST. CLEARANCE</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">{selectedIncident.estimatedClearanceMins} mins</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] text-slate-500">CORRIDOR RISK</div>
                  <div className="text-sm font-bold text-red-400 mt-1">{matchedHighway.riskScore} / 100</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5 text-[11px]">
                <div>Assigned Unit: <strong className="text-white">{selectedIncident.assignedUnit}</strong></div>
                <div>Verification Authority: <strong className="text-emerald-400">{selectedIncident.verifiedBy}</strong></div>
                <div>Weather Conditions: <strong className="text-blue-300">{selectedIncident.weatherCondition}</strong></div>
              </div>
            </div>
          )}

          {/* TAB 2: INCIDENT TIMELINE */}
          {activeForensicsTab === 'TIMELINE' && (
            <div className="space-y-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Chronological Incident Progression
              </div>
              <div className="relative pl-6 space-y-3 border-l-2 border-slate-800">
                {selectedIncident.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-[#070B14]" />
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="font-bold text-violet-400">{item.time}</span>
                      <span className="text-slate-500">· {item.actor}</span>
                    </div>
                    <div className="text-slate-200 text-xs font-sans">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAUSAL GRAPH */}
          {activeForensicsTab === 'CAUSAL_GRAPH' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-[11px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Causal Mechanism (Causal AI DAG)
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-950/40 border border-blue-500/30 text-blue-200">
                <span>TRIGGER: {matchedHighway.causalChain.trigger}</span>
                <span className="font-bold text-blue-400">Atmospheric Squall</span>
              </div>
              <div className="flex justify-center text-slate-600 font-bold">↓</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">{matchedHighway.causalChain.factor1}</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">{matchedHighway.causalChain.factor2}</div>
              </div>
              <div className="flex justify-center text-slate-600 font-bold">↓</div>
              <div className="p-2 rounded bg-red-950/40 border border-red-500/30 text-red-200 text-center font-bold">
                CONSEQUENCE: {matchedHighway.causalChain.consequence}
              </div>
            </div>
          )}

          {/* TAB 4: SHAP EXPLAIN */}
          {activeForensicsTab === 'SHAP_EXPLAIN' && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                SHAP Feature Attributions (Base Value: 42.0)
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span>Traffic Density Surge</span>
                  <span className="text-red-400 font-bold">+24 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span>Historical Accident Frequency</span>
                  <span className="text-red-400 font-bold">+19 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span>Monsoon Rainfall Surface Friction Loss</span>
                  <span className="text-red-400 font-bold">+14 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span>Photopic Visibility Deficit (&lt;300m)</span>
                  <span className="text-red-400 font-bold">+10 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900">
                  <span>Surface Rutting & Pavement Cracking</span>
                  <span className="text-red-400 font-bold">+8 pts</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPLAY LAUNCHER */}
          {activeForensicsTab === 'REPLAY' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-white text-xs">4-Phase Kinetic Accident Reconstruction</div>
              <p className="text-slate-400 text-xs">
                Launch the forensic digital twin replay examining vehicle trajectories at -10s, -5s, Impact, and +5s.
              </p>
              <button
                onClick={() => { tacticalAudio.playRadarPing(); onOpenReplay(); }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
              >
                OPEN ACCIDENT REPLAY SIMULATOR
              </button>
            </div>
          )}

          {/* TAB 6: NEAR MISS */}
          {activeForensicsTab === 'NEAR_MISS' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">NEAR-MISS CONFLICT PROBABILITY:</span>
                <span className="text-cyan-400 font-black text-sm">87%</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Detects aggressive brake deceleration and lane conflicts prior to impact. 142 sudden braking incidents logged per day on this segment.
              </p>
            </div>
          )}

          {/* TAB 7: PREVENTION */}
          {activeForensicsTab === 'PREVENTION' && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Targeted Civil Interventions
              </div>
              {matchedHighway.recommendations.map((rec, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                  <span>{rec.action}</span>
                  <span className="text-emerald-400 font-bold">-{rec.expectedReductionPct}% RISK</span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
