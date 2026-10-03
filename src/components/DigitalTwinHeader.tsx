import React from 'react';
import { 
  FileText, 
  Settings2, 
  User,
  Sliders,
  Database,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';

export type ActiveModule = 
  | 'digital_twin' 
  | 'risk_engine' 
  | 'ai_explain' 
  | 'scenario_lab' 
  | 'prevention' 
  | 'emergency'
  | 'compare'
  | 'planner_game';

interface DigitalTwinHeaderProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  onOpenReport: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenOfflineCache: () => void;
  isOffline?: boolean;
  selectedRoadId: string;
}

export const DigitalTwinHeader: React.FC<DigitalTwinHeaderProps> = ({
  activeModule,
  setActiveModule,
  onOpenReport,
  onOpenSettings,
  onOpenProfile,
  onOpenOfflineCache,
  isOffline = false,
  selectedRoadId
}) => {
  const navItems: { id: ActiveModule; label: string; number: string }[] = [
    { id: 'digital_twin', label: 'DIGITAL TWIN', number: '01' },
    { id: 'risk_engine', label: 'RISK ENGINE', number: '02' },
    { id: 'ai_explain', label: 'AI EXPLAIN', number: '03' },
    { id: 'scenario_lab', label: 'SCENARIO LAB', number: '04' },
    { id: 'prevention', label: 'PREVENTION', number: '05' },
    { id: 'emergency', label: 'EMERGENCY', number: '06' },
    { id: 'compare', label: 'COMPARE', number: '07' },
    { id: 'planner_game', label: 'PLANNER GAME', number: '08' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* LEFT: Brand & Status Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-950/80 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold text-xs shadow-md">
              <span className="font-mono text-violet-400 font-extrabold text-sm tracking-tighter">RG</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white uppercase font-sans">
                  ROADGUARD AI
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden xl:inline">
                  AI ROAD SAFETY DIGITAL TWIN
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-bold text-[10px] tracking-wider uppercase">LIVE INTELLIGENCE</span>
                </div>

                <span className="text-slate-700">·</span>

                {/* LocalStorage Cache Indicator */}
                <button
                  onClick={onOpenOfflineCache}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer hover:bg-slate-800"
                  title="Manage Offline LocalStorage Cache Layer"
                >
                  {isOffline ? (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-400">OFFLINE CACHE</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">CACHED (READY)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CENTER NAVIGATION: Minimal, Clean, Elegant */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            {navItems.map(item => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`relative px-2.5 sm:px-3 py-1.5 text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap font-mono ${
                    isActive
                      ? 'text-violet-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className="text-[9px] opacity-40 hidden md:inline">{item.number}</span>
                    <span>{item.label}</span>
                  </span>

                  {/* Electric Violet Active Glow Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS: Generate Report, Settings, User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Generate Report */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap font-mono"
              title="Generate Risk Intelligence Report"
            >
              <FileText className="w-3.5 h-3.5 text-violet-200" />
              <span className="hidden sm:inline">Report</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold font-mono"
              title="System & AI Settings"
            >
              <Settings2 className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Settings</span>
            </button>

            {/* User Profile */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-all cursor-pointer text-xs"
              title="User Profile & Clearance"
            >
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                KR
              </div>
              <span className="hidden lg:inline font-mono text-[11px] font-bold text-slate-300">Dr. Ramanathan</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
