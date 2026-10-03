import React from 'react';
import { 
  X, 
  Download, 
  Share2, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Printer
} from 'lucide-react';
import { HighwayCorridor, MORTH_NATIONAL_STATS } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface FinalAIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  highway: HighwayCorridor;
  onStartNewInvestigation: () => void;
}

export const FinalAIReportModal: React.FC<FinalAIReportModalProps> = ({
  isOpen,
  onClose,
  highway,
  onStartNewInvestigation
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    tacticalAudio.playRadarPing();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none font-mono">
      <div className="bg-[#070B14] border border-violet-500/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-violet-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide">
                ROADGUARD AI · EXECUTIVE INTELLIGENCE REPORT
              </div>
              <div className="text-[10px] text-slate-400">
                Official MoRTH-Aligned Safety Audit & Prevention Docket
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="Print Official Safety Docket"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => { tacticalAudio.playRadarPing(); onClose(); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] bg-[#0A0F1D]/60 text-slate-300 print:text-black print:bg-white">
          
          {/* Document Top Bar */}
          <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-lg font-black text-white tracking-tight font-sans">
                NATIONAL HIGHWAY SAFETY & RISK PREVENTION AUDIT
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Target Corridor: <strong className="text-white">{highway.code}</strong> — {highway.name} ({highway.state})
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="text-[10px] text-slate-500 uppercase">Docket Identifier</div>
              <div className="text-violet-400 font-bold">RGAI-MORTH-2026-094</div>
              <div className="text-[9px] text-slate-500">Classification: Smart City Strategic</div>
            </div>
          </div>

          {/* Core Metric Quadrants */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">Current Risk Score</div>
              <div className="text-2xl font-black text-red-400 mt-1">{highway.riskScore} / 100</div>
              <div className="text-[9px] text-red-400/80 font-bold">HIGH HAZARD</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">Model Confidence</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{highway.confidenceScore}%</div>
              <div className="text-[9px] text-emerald-400/80 font-bold">CALIBRATED</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">Forecast Peak</div>
              <div className="text-2xl font-black text-amber-400 mt-1">92 / 100</div>
              <div className="text-[9px] text-amber-400/80 font-bold">18:00 – 20:00</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">Emergency Latency</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">6m 24s</div>
              <div className="text-[9px] text-cyan-400/80 font-bold">GREEN CORRIDOR</div>
            </div>
          </div>

          {/* Primary Risk Causes Breakdown */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Root Cause & Causal Analysis
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200">
              {highway.causalChain.trigger} combined with commercial freight density ({highway.trafficDensityScore}%) and historical accident frequency ({highway.accidentHistoryScore}%) elevates crash probability. Primary collision mechanism: {highway.causalChain.consequence}.
            </p>
          </div>

          {/* Counterfactual Simulation Results */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Counterfactual Civil Engineering Interventions (Ranked)
            </div>
            <div className="space-y-1.5">
              {highway.recommendations.map((rec, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-950 text-[11px]">
                  <span>{i + 1}. {rec.action}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">₹{rec.costEstimateLakhs}L</span>
                    <span className="text-emerald-400 font-bold">-{rec.expectedReductionPct}% RISK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Transparency Footnote */}
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>Data Authority: MoRTH Transport Research Wing · OpenStreetMap · Open-Meteo</div>
            <div>Generated by ROADGUARD AI · Model v3.8.4 Ensemble</div>
          </div>

        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-[#070B14] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              onStartNewInvestigation();
              onClose();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Investigation</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                navigator.clipboard?.writeText(window.location.href);
                alert('Analysis docket link copied to clipboard!');
              }}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Analysis</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-violet-900/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD DOCKET</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
