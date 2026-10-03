import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Database, 
  Cpu, 
  Settings, 
  Sparkles, 
  Play, 
  User, 
  AlertTriangle, 
  ChevronDown,
  Activity,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import { UserRole, SYSTEM_NOTIFICATIONS } from '../data/operationsData';
import { tacticalAudio } from '../services/tacticalAudio';

export type EnterpriseModule = 
  | 'command_center' 
  | 'incidents' 
  | 'traffic' 
  | 'road_assets' 
  | 'weather' 
  | 'ai_risk' 
  | 'inspection' 
  | 'emergency' 
  | 'simulation' 
  | 'reports';

interface EnterpriseNavbarProps {
  activeModule: EnterpriseModule;
  onSelectModule: (module: EnterpriseModule) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenDataCenter: () => void;
  onOpenModelCenter: () => void;
  onOpenCopilot: () => void;
  onOpenSettings: () => void;
  onStartDemo: () => void;
  onGlobalSearch: (query: string) => void;
}

export const EnterpriseNavbar: React.FC<EnterpriseNavbarProps> = ({
  activeModule,
  onSelectModule,
  userRole,
  onSelectRole,
  onOpenDataCenter,
  onOpenModelCenter,
  onOpenCopilot,
  onOpenSettings,
  onStartDemo,
  onGlobalSearch
}) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navModules: { id: EnterpriseModule; label: string }[] = [
    { id: 'command_center', label: 'COMMAND CENTER' },
    { id: 'incidents', label: 'INCIDENTS' },
    { id: 'traffic', label: 'TRAFFIC' },
    { id: 'road_assets', label: 'ROAD ASSETS' },
    { id: 'weather', label: 'WEATHER' },
    { id: 'ai_risk', label: 'AI RISK' },
    { id: 'inspection', label: 'INSPECTION' },
    { id: 'emergency', label: 'EMERGENCY' },
    { id: 'simulation', label: 'SIMULATION' },
    { id: 'reports', label: 'REPORTS' }
  ];

  const roles: UserRole[] = [
    'ADMIN',
    'ROAD SAFETY ANALYST',
    'TRAFFIC OPERATOR',
    'EMERGENCY OPERATOR',
    'FIELD INSPECTOR',
    'VIEWER'
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070B14]/95 backdrop-blur-md border-b border-slate-800 text-slate-200 select-none font-mono text-xs">
      
      {/* Top Operations Header Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-800/60">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-950/80 border border-violet-500/50 flex items-center justify-center font-bold text-violet-300 text-sm shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            RG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm tracking-tight font-sans">ROADGUARD AI</span>
              <span className="text-[10px] text-slate-500 uppercase hidden xl:inline">
                AI ROAD SAFETY OPERATIONS & INTELLIGENCE PLATFORM
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold tracking-wider">SYSTEM OPERATIONAL</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 italic font-sans text-[10px] hidden lg:inline">
                Predict Risk. Understand It. Simulate It. Prevent It.
              </span>
            </div>
          </div>
        </div>

        {/* Compact Operational Status Strip */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">DATA STREAMS</span>
            <strong className="text-emerald-400 font-extrabold">15+</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">INCIDENTS</span>
            <strong className="text-amber-400 font-extrabold">27</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">CRITICAL</span>
            <strong className="text-red-400 font-extrabold">14</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">AI ALERTS</span>
            <strong className="text-violet-400 font-extrabold">63</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">EMERGENCY</span>
            <strong className="text-red-400 font-extrabold">8</strong>
          </div>
        </div>

        {/* Right Search, Role & Utility Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Universal Search Input */}
          <div className="relative w-40 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search highway, incident, asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  tacticalAudio.playRadarPing();
                  onGlobalSearch(searchQuery);
                }
              }}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Role-Based Access Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
              title="Change Operational Role clearance"
            >
              <User className="w-3 h-3 text-violet-400" />
              <span className="hidden sm:inline">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-[#070B14] border border-slate-800 rounded-xl p-1 shadow-2xl z-50">
                <div className="text-[9px] text-slate-500 px-2 py-1 uppercase">Switch Clearance Role</div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      tacticalAudio.playRadarPing();
                      onSelectRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between ${
                      userRole === r ? 'bg-violet-950 text-violet-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <CheckCircle2 className="w-3 h-3 text-violet-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Alert Center Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                tacticalAudio.playRadarPing();
                setIsAlertsOpen(!isAlertsOpen);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer relative"
              title="Alert Notifications Center"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </button>

            {isAlertsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-[#070B14] border border-slate-800 rounded-xl p-2.5 shadow-2xl z-50 text-[11px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="font-bold text-white uppercase text-[10px]">OPERATIONAL NOTIFICATIONS</span>
                  <button onClick={() => setIsAlertsOpen(false)} className="text-slate-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5 mt-2">
                  {SYSTEM_NOTIFICATIONS.map(n => (
                    <div key={n.id} className="p-1.5 rounded bg-slate-900/60 border border-slate-800/80 flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        n.severity === 'CRITICAL' ? 'bg-red-400' : (n.severity === 'HIGH' ? 'bg-amber-400' : 'bg-blue-400')
                      }`} />
                      <div className="flex-1">
                        <div className="font-bold text-slate-200">{n.title}</div>
                        <div className="text-[9px] text-slate-500">{n.time} · {n.module}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Placement 3-Minute Demo Trigger */}
          <button
            onClick={() => { tacticalAudio.playRadarPing(); onStartDemo(); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all cursor-pointer shadow-md shadow-violet-900/30 text-[10px]"
            title="Start 3-Minute Automated Placement Demo"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">DEMO</span>
          </button>

          {/* Secondary Utilities */}
          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenDataCenter(); }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Data Center & MoRTH Open Data"
          >
            <Database className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenModelCenter(); }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="AI Model Center & MLOps Health"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenCopilot(); }}
            className="p-1.5 rounded-lg bg-slate-900 border border-violet-500/40 text-violet-300 hover:text-white transition-colors cursor-pointer"
            title="Open ROADGUARD Copilot"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { tacticalAudio.playRadarPing(); onOpenSettings(); }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Platform Settings & Clearance"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* Main Global Navigation Tabs */}
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
        {navModules.map(item => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                tacticalAudio.playRadarPing();
                onSelectModule(item.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

    </header>
  );
};
