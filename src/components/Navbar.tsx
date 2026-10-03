import React from 'react';
import { 
  ShieldAlert, 
  Compass, 
  Activity, 
  Fingerprint, 
  Radar, 
  SlidersHorizontal, 
  TrendingUp, 
  FileText, 
  Settings2, 
  Download 
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'map' 
  | 'predict' 
  | 'fingerprint' 
  | 'detect' 
  | 'simulator' 
  | 'forecast' 
  | 'reports' 
  | 'admin';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRole: 'user' | 'admin';
  setUserRole: (role: 'user' | 'admin') => void;
  onExportReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onExportReport
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'map', label: 'Risk Map', icon: <Compass className="w-4 h-4" /> },
    { id: 'predict', label: 'Predict', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'fingerprint', label: 'Risk Fingerprint', icon: <Fingerprint className="w-4 h-4" /> },
    { id: 'detect', label: 'Detect', icon: <Radar className="w-4 h-4" />, badge: '3 Alerts' },
    { id: 'simulator', label: 'Simulator', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'forecast', label: 'Forecast', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <Settings2 className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white block">
                  ROADGUARD AI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase bg-indigo-950 border border-indigo-800/80 text-indigo-300 rounded font-semibold">
                  v3.2
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Predict · Explain · Detect · Simulate · Prevent
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-red-500/20 text-red-300 border border-red-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Role Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setUserRole('user')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  userRole === 'user'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Analyst
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  userRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Quick Export Report */}
            <button
              onClick={onExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Generate printable AI Safety Intelligence Report"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Horizontal Nav Scroll */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
