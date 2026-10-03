import React from 'react';
import { X, User, ShieldCheck, Activity, Award, Clock, MapPin, Building, LogOut, CheckCircle2 } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#E6E3DC] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-sans text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E3DC] bg-[#F8F7F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <span>KR</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Operator Profile & Credentials
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">Digital Twin Command Center</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Identity Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E3DC]">
            <div className="w-12 h-12 rounded-xl bg-[#1C1E21] text-violet-300 flex items-center justify-center font-bold text-lg shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-zinc-900">Dr. K. Ramanathan</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-zinc-600 font-medium text-[11px]">
                Chief Transportation Analyst & AI Safety Officer
              </p>
              <div className="text-[10px] font-mono text-zinc-400">
                CREDENTIAL ID: <span className="text-zinc-700 font-bold">RG-OP-8921-A</span>
              </div>
            </div>
          </div>

          {/* Role Badges & Permissions */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              AUTHORITY & CLEARANCES
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-900">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Tier-1 Policy Access
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Speed Cap & Lane Control</div>
              </div>
              <div className="p-2.5 rounded-lg border border-violet-200 bg-violet-50/70 text-violet-900">
                <div className="font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-violet-600" />
                  Model Retraining
                </div>
                <div className="text-[10px] text-violet-700 mt-0.5">XGBoost & SHAP Tuner</div>
              </div>
            </div>
          </div>

          {/* Command Metrics */}
          <div className="space-y-2 pt-2 border-t border-[#E6E3DC]">
            <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              COMMAND SECTOR OVERVIEW
            </span>
            <div className="space-y-2 text-zinc-700">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#E6E3DC]">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Deployment Agency</span>
                </div>
                <span className="font-bold font-mono text-zinc-900">Metro Transport & Safety Corp</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#E6E3DC]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Active Live Shift</span>
                </div>
                <span className="font-bold font-mono text-emerald-700">08:00 – 20:00 (On-Duty)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#E6E3DC]">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Audits Certified</span>
                </div>
                <span className="font-bold font-mono text-violet-700">38 Completed (This Quarter)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8F7F4] border-t border-[#E6E3DC] flex items-center justify-between">
          <div className="text-[10px] font-mono text-zinc-500">
            SYSTEM STATUS: <strong className="text-emerald-700">ONLINE</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#1C1E21] hover:bg-zinc-800 text-white font-bold transition-all text-xs cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
