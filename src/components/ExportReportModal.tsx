import React, { useState } from 'react';
import { HotspotCluster, AccidentRecord, RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS, EMERGING_ANOMALIES, DETECTED_PATTERNS } from '../data/roadGuardData';
import { X, Printer, Download, ShieldAlert, Fingerprint, Radar, CheckCircle2, FileText, Sparkles } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accidents: AccidentRecord[];
  hotspots: HotspotCluster[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  accidents,
  hotspots
}) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(ROAD_SEGMENTS[1].id); // R-102
  const segment = ROAD_SEGMENTS.find(s => s.id === selectedSegmentId) || ROAD_SEGMENTS[1];

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const fatalCount = accidents.filter(a => a.severity === 'Fatal').length;
  const severeCount = accidents.filter(a => a.severity === 'Severe').length;
  const totalCasualties = accidents.reduce((sum, a) => sum + a.casualties, 0);

  const matchedAnomalies = EMERGING_ANOMALIES.filter(a => a.segmentId === segment.id);
  const fp = segment.fingerprint;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white">ROADGUARD AI — Intelligent Accident Intelligence & Prevention Audit</h2>
              <span className="text-xs text-slate-400">Automated Multi-Source Analytical Dossier</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedSegmentId}
              onChange={e => setSelectedSegmentId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 font-medium"
            >
              {ROAD_SEGMENTS.map(s => (
                <option key={s.id} value={s.id}>{s.id}: {s.name}</option>
              ))}
            </select>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs bg-white text-slate-900 print:text-black print:bg-white print:p-0">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                ROADGUARD AI PLATFORM · SAFETY INTELLIGENCE & PREVENTION DIVISION
              </span>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                Comprehensive Road Risk Audit & Intelligence Report
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Corridor: {segment.name} ({segment.id}) · Model: XGBoost + Geospatial DBSCAN
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Audit Ref: RG-AUD-{Date.now().toString().slice(-6)}</div>
              <div>Status: Automated Official Synthesis</div>
            </div>
          </div>

          {/* Section 1: Segment Profile & Score */}
          <div className="space-y-2 border border-slate-300 p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2">
              <div>
                <span className="font-mono text-indigo-700 font-bold">{segment.id}</span>
                <h3 className="font-bold text-sm text-slate-900">{segment.name}</h3>
                <span className="text-slate-600 text-[11px]">{segment.roadType} · {segment.lengthKm} km · Speed Limit: {segment.speedLimit} km/h</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 block">Overall Road Risk</span>
                <span className="text-2xl font-black font-mono text-red-600">{segment.currentRiskScore} / 100</span>
                <span className="block text-[11px] font-bold text-red-700 uppercase">[{segment.riskCategory} Risk]</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>Accident Frequency: <strong>{segment.accidentFrequency}</strong></div>
              <div>Peak Hazard Window: <strong>{segment.peakRiskPeriod}</strong></div>
              <div>Emergency Access: <strong className={segment.isHighRiskLimitedEmergency ? 'text-red-600' : 'text-slate-900'}>{segment.emergencyAccess} ({segment.nearestHospitalDistanceKm} km)</strong></div>
            </div>
          </div>

          {/* Section 2: AI Risk Fingerprint Meter */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              2. Digital AI Risk Fingerprint
            </h3>
            <div className="bg-slate-100 p-3 rounded-lg font-mono text-xs space-y-1 text-slate-800">
              <div className="flex justify-between">
                <span>Accident History:</span>
                <span>{'█'.repeat(Math.round(fp.accidentHistory / 10))}{'░'.repeat(10 - Math.round(fp.accidentHistory / 10))} {fp.accidentHistory}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Traffic Volume:</span>
                <span>{'█'.repeat(Math.round(fp.traffic / 10))}{'░'.repeat(10 - Math.round(fp.traffic / 10))} {fp.traffic}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Infrastructure:</span>
                <span>{'█'.repeat(Math.round(fp.infrastructure / 10))}{'░'.repeat(10 - Math.round(fp.infrastructure / 10))} {fp.infrastructure}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Weather Vulnerability:</span>
                <span>{'█'.repeat(Math.round(fp.weather / 10))}{'░'.repeat(10 - Math.round(fp.weather / 10))} {fp.weather}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Visibility Deficit:</span>
                <span>{'█'.repeat(Math.round(fp.visibility / 10))}{'░'.repeat(10 - Math.round(fp.visibility / 10))} {fp.visibility}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Severity Pattern:</span>
                <span>{'█'.repeat(Math.round(fp.severityPattern / 10))}{'░'.repeat(10 - Math.round(fp.severityPattern / 10))} {fp.severityPattern}/100</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 italic">
              AI Explanation: “The predicted risk is elevated primarily because of historical accident concentration, high traffic intensity, poor visibility and previous severe incidents in this road segment.”
            </p>
          </div>

          {/* Section 3: Active Emerging Anomalies if any */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              3. Detected Anomalies & Statistical Deviations
            </h3>
            {matchedAnomalies.length > 0 ? (
              <div className="space-y-2">
                {matchedAnomalies.map(a => (
                  <div key={a.id} className="p-3 border border-red-300 bg-red-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-red-700">
                      <span>⚠️ {a.type}</span>
                      <span className="font-mono">{a.deviationZScore}σ deviation</span>
                    </div>
                    <div className="text-slate-800">
                      Observed: <strong>{a.observedValue}</strong> (Baseline: {a.expectedBaseline})
                    </div>
                    <div className="text-slate-600 text-[11px]">{a.supportingData}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-xs">
                No active statistical anomalies exceeding +2.5σ threshold detected for this segment during current 7-day monitoring window.
              </p>
            )}
          </div>

          {/* Section 4: AI Preventive Insights & Recommended Interventions */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              4. AI Preventive Intelligence & Engineering Action Plan
            </h3>
            <div className="space-y-1.5 text-xs text-slate-800">
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700">1.</span>
                <span><strong>Traffic Management:</strong> {segment.preventiveAction}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700">2.</span>
                <span><strong>Speed Calming:</strong> Enforce strict automated speed radar monitoring capped at {segment.speedLimit} km/h between {segment.peakRiskPeriod}.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-700">3.</span>
                <span><strong>Emergency Alignment:</strong> {segment.isHighRiskLimitedEmergency ? 'Critical requirement to pre-position dedicated ambulatory paramedic response unit at nearest highway interchange.' : 'Maintain current nominal paramedic response dispatch times.'}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-1">
              Note: Analytical preventive guidance derived from measurable risk factors. Intended as a decision-support advisory, not an official emergency command.
            </p>
          </div>

          {/* Footer Signoff */}
          <div className="pt-6 border-t-2 border-slate-300 flex justify-between text-[11px] text-slate-500 font-mono">
            <div>ROADGUARD AI Intelligence Engine · Version 3.2</div>
            <div>Approved for Municipal Transport Review</div>
          </div>

        </div>

      </div>
    </div>
  );
};
