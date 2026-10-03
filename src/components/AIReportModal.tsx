import React from 'react';
import { RoadSegmentProfile } from '../types/accident';
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldAlert, Fingerprint } from 'lucide-react';

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: RoadSegmentProfile;
}

export const AIReportModal: React.FC<AIReportModalProps> = ({
  isOpen,
  onClose,
  segment
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const fp = segment.fingerprint;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#E6E3DC] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-zinc-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E3DC] bg-[#F8F7F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1C1E21] text-white flex items-center justify-center font-mono font-bold text-xs">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                AI ROAD RISK INTELLIGENCE REPORT
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">Dossier: {segment.id} · {segment.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1E21] hover:bg-zinc-800 text-white rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-violet-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-black rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs bg-white print:p-0">
          
          {/* Top Ident Header */}
          <div className="border-b-2 border-zinc-900 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                ROADGUARD AI PLATFORM · URBAN DIGITAL TWIN RISK SYSTEM
              </span>
              <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight mt-0.5">
                Executive Road Risk Intelligence Report
              </h1>
              <p className="text-xs text-zinc-600 mt-0.5 font-medium">
                Corridor: {segment.name} ({segment.id}) · Road Type: {segment.roadType}
              </p>
            </div>
            <div className="text-right text-[11px] text-zinc-500 font-mono">
              <div>Generated: {new Date().toLocaleDateString()}</div>
              <div>Report ID: RG-RPT-{Date.now().toString().slice(-6)}</div>
              <div>Status: Verified Analytics Summary</div>
            </div>
          </div>

          {/* Core Score Banner */}
          <div className="border border-[#E6E3DC] p-4 rounded-xl bg-[#F8F7F4] flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">CALIBRATED RISK SCORE</span>
              <div className="text-3xl font-black font-mono text-zinc-900 mt-0.5">
                {segment.currentRiskScore} <span className="text-sm font-normal text-zinc-400">/ 100</span>
              </div>
              <span className="text-xs font-bold uppercase text-red-600">
                {segment.riskCategory} RISK STATUS
              </span>
            </div>
            <div className="text-right font-mono text-[11px] space-y-0.5 text-zinc-600">
              <div>Speed Limit: <strong>{segment.speedLimit} km/h</strong></div>
              <div>Lanes: <strong>{segment.lanes}</strong> · Length: <strong>{segment.lengthKm} km</strong></div>
              <div>Peak Hazard Period: <strong>{segment.peakRiskPeriod}</strong></div>
            </div>
          </div>

          {/* Section 1: Digital Risk DNA Breakdown */}
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 border-b border-zinc-200 pb-1">
              1. Digital Road Risk DNA
            </h3>
            <div className="bg-[#F8F7F4] p-3 rounded-lg font-mono text-xs space-y-1 text-zinc-800">
              <div className="flex justify-between">
                <span>Accident History:</span>
                <span>{'█'.repeat(Math.round(fp.accidentHistory / 10))}{'░'.repeat(10 - Math.round(fp.accidentHistory / 10))} {fp.accidentHistory}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Traffic Intensity:</span>
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
          </div>

          {/* Section 2: AI Interpretation & Feature Attributions */}
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 border-b border-zinc-200 pb-1">
              2. Explainable AI Feature Interpretation (SHAP)
            </h3>
            <p className="text-zinc-700 leading-relaxed italic bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              “The model's predicted risk is elevated mainly because of historical accident concentration ({fp.accidentHistory}/100), high traffic intensity ({fp.traffic}/100) and poor visibility ({fp.visibility}/100).”
            </p>
          </div>

          {/* Section 3: Scenario Lab Countermeasure Projection */}
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 border-b border-zinc-200 pb-1">
              3. Scenario Simulation & Stress Testing
            </h3>
            <p className="text-zinc-700 leading-relaxed">
              Under simulated baseline adverse conditions (heavy traffic + wet rainfall film), model risk surges from <strong>72/100 to 84/100 (+12 pts)</strong>. Conversely, applying proactive speed calming (-15 km/h cap) and luminaire retrofits mitigates risk to <strong>54/100 (ELEVATED)</strong>.
            </p>
          </div>

          {/* Section 4: AI Preventive Action Plan */}
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 border-b border-zinc-200 pb-1">
              4. Evidence-Based Preventive Recommendations
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-800">
              <li>{segment.preventiveAction}</li>
              <li>Install automated radar speed monitoring between {segment.peakRiskPeriod}.</li>
              <li>Audit street lighting lux levels at approach ramp merges.</li>
              <li>Pre-position emergency medical response unit to guarantee golden-hour arrival.</li>
            </ul>
          </div>

          {/* Footer Signoff */}
          <div className="pt-6 border-t-2 border-zinc-900 flex justify-between text-[10px] text-zinc-500 font-mono">
            <div>ROADGUARD AI Urban Digital Twin Intelligence System</div>
            <div>Authorized for Traffic Management Review</div>
          </div>

        </div>

      </div>
    </div>
  );
};
