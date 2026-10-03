import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sliders, 
  Eye, 
  Ambulance, 
  Route, 
  Database, 
  Sparkles, 
  Play, 
  Activity,
  Layers,
  HelpCircle,
  FileText,
  Code
} from 'lucide-react';
import { HighwayCorridor, IndianState, MetroHub } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface FloatingCommandBarProps {
  onSearchSelect: (item: { type: 'highway' | 'state' | 'metro'; id: string }) => void;
  onOpenWhatIf: () => void;
  onOpenRoadVision: () => void;
  onOpenEmergencyMode: () => void;
  isEmergencyActive: boolean;
  onOpenRouteAnalyzer: () => void;
  onOpenDataMLOps: () => void;
  onOpenCopilot: () => void;
  onStartDemo: () => void;
  onOpenReport: () => void;
  onOpenGitHubPrototype?: () => void;
  isDemoMode: boolean;
  highways: HighwayCorridor[];
  states: IndianState[];
  metros: MetroHub[];
}

export const FloatingCommandBar: React.FC<FloatingCommandBarProps> = ({
  onSearchSelect,
  onOpenWhatIf,
  onOpenRoadVision,
  onOpenEmergencyMode,
  isEmergencyActive,
  onOpenRouteAnalyzer,
  onOpenDataMLOps,
  onOpenCopilot,
  onStartDemo,
  onOpenReport,
  onOpenGitHubPrototype,
  isDemoMode,
  highways,
  states,
  metros
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter matching highways, states, metros
  const matchingHighways = highways.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.state.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const matchingStates = states.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 2);

  const matchingMetros = metros.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 2);

  return (
    <header className="fixed top-3 left-4 right-4 z-40 flex items-center justify-between gap-2 pointer-events-none select-none">
      
      {/* LEFT: Branding & Live Data Status Tag */}
      <div className="flex items-center gap-3 pointer-events-auto bg-[#070B14]/90 backdrop-blur-md border border-slate-800/90 py-1.5 px-3 rounded-xl shadow-2xl">
        <div className="w-8 h-8 rounded-lg bg-violet-950/90 border border-violet-500/50 flex items-center justify-center font-bold font-mono text-violet-300 text-xs shadow-[0_0_12px_rgba(139,92,246,0.3)]">
          RG
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white uppercase font-sans">
              ROADGUARD AI
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden xl:inline">
              INDIA ROAD RISK OPERATING SYSTEM
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            {/* Live Data / Demo Data Honesty Indicator */}
            <button
              onClick={() => { tacticalAudio.playRadarPing(); onOpenDataMLOps(); }}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Click to view MoRTH Open Data & MLOps transparency"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wider uppercase">
                {isDemoMode ? '● DEMO DATA' : '● LIVE DATA (MoRTH)'}
              </span>
            </button>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 hidden sm:inline">15 DATA STREAMS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* CENTER: Smart Search Box */}
      <div className="relative pointer-events-auto w-48 sm:w-64 md:w-80">
        <div className="flex items-center bg-[#070B14]/90 backdrop-blur-md border border-slate-800/90 rounded-xl px-2.5 py-1.5 shadow-2xl focus-within:border-violet-500 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search NH-44, Tamil Nadu, Chennai..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        {/* Dropdown Results */}
        {isSearchOpen && searchQuery.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-[#070B14]/95 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-2xl text-xs font-mono z-50">
            {matchingHighways.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] text-slate-500 px-2 py-0.5 uppercase">Highways</div>
                {matchingHighways.map(h => (
                  <button
                    key={h.id}
                    onClick={() => {
                      onSearchSelect({ type: 'highway', id: h.id });
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span>{h.name}</span>
                    <span className="text-[10px] text-violet-400">{h.riskScore} Risk</span>
                  </button>
                ))}
              </div>
            )}

            {matchingStates.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] text-slate-500 px-2 py-0.5 uppercase">States</div>
                {matchingStates.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSearchSelect({ type: 'state', id: s.id });
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-amber-400">{s.riskIndex} Index</span>
                  </button>
                ))}
              </div>
            )}

            {matchingMetros.length > 0 && (
              <div>
                <div className="text-[10px] text-slate-500 px-2 py-0.5 uppercase">Cities</div>
                {matchingMetros.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSearchSelect({ type: 'metro', id: m.id });
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] text-emerald-400">{m.activeRiskScore} Risk</span>
                  </button>
                ))}
              </div>
            )}

            {matchingHighways.length === 0 && matchingStates.length === 0 && matchingMetros.length === 0 && (
              <div className="text-center py-2 text-slate-500 text-xs">No matching corridor or state</div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Quick Floating Action Controls */}
      <div className="flex items-center gap-1.5 pointer-events-auto bg-[#070B14]/90 backdrop-blur-md border border-slate-800/90 py-1 px-2 rounded-xl shadow-2xl font-mono text-xs">
        
        {/* START 3-MINUTE PLACEMENT DEMO BUTTON */}
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onStartDemo(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all cursor-pointer shadow-md shadow-violet-900/40"
          title="Start 3-Minute Automated Placement Demo Walkthrough"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span className="hidden sm:inline">START DEMO</span>
        </button>

        {/* WHAT IF? SCENARIO LAB BUTTON */}
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onOpenWhatIf(); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 transition-colors cursor-pointer"
          title="Open What-If Digital Twin Scenario Simulation"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">WHAT IF?</span>
        </button>

        {/* ROAD VISION (COMPUTER VISION) BUTTON */}
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onOpenRoadVision(); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors cursor-pointer"
          title="Inspect Road Photography with Computer Vision Bounding Boxes"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">ROAD VISION</span>
        </button>

        {/* ROUTE SAFETY ANALYZER BUTTON */}
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onOpenRouteAnalyzer(); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white border border-emerald-500/30 transition-colors cursor-pointer"
          title="Compute Safety-First Interstate Route (e.g. Chennai → Bengaluru)"
        >
          <Route className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">SAFETY ROUTE</span>
        </button>

        {/* EMERGENCY MODE TOGGLE */}
        <button
          onClick={() => { 
            tacticalAudio.playAlertChime(); 
            onOpenEmergencyMode(); 
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isEmergencyActive 
              ? 'bg-red-600 text-white border-red-400 animate-pulse' 
              : 'bg-slate-900 hover:bg-slate-800 text-red-300 hover:text-white border-red-500/30'
          }`}
          title="Dispatch Emergency Ambulance & Animate Safe Route"
        >
          <Ambulance className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden lg:inline">EMERGENCY</span>
        </button>

        {/* GITHUB PROTOTYPE BUTTON */}
        <button
          onClick={() => { 
            tacticalAudio.playRadarPing(); 
            onOpenGitHubPrototype?.(); 
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-violet-300 hover:text-white border border-violet-500/40 transition-colors cursor-pointer"
          title="Inspect & Test GitHub Sample ML Prototype (Python / FastAPI)"
        >
          <Code className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden xl:inline font-bold">PROTOTYPE</span>
        </button>

        {/* MLOps & Data Transparency */}
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onOpenDataMLOps(); }}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="MoRTH Data Sources & MLOps Health"
        >
          <Database className="w-3.5 h-3.5" />
        </button>

        {/* Report Preview */}
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onOpenReport(); }}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Generate Executive Road Safety Intelligence Report"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>

      </div>

    </header>
  );
};
