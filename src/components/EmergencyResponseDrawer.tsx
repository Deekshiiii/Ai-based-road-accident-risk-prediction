import React, { useState } from 'react';
import { X, Ambulance, Shield, Flame, MapPin, Clock, AlertTriangle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { RoadSegmentProfile } from '../types/accident';
import { tacticalAudio } from '../services/tacticalAudio';

interface EmergencyResponseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegmentProfile;
  isEmergencyActive: boolean;
  onToggleEmergency: () => void;
}

export const EmergencyResponseDrawer: React.FC<EmergencyResponseDrawerProps> = ({
  isOpen,
  onClose,
  selectedRoad,
  isEmergencyActive,
  onToggleEmergency
}) => {
  if (!isOpen) return null;

  const facilities = [
    {
      type: 'TRAUMA HOSPITAL',
      name: 'Apollo Metropolitan Trauma Center',
      distance: `${selectedRoad.nearestHospitalDistanceKm} km`,
      eta: '04:32',
      status: 'PRIMARY DISPATCH ACTIVE',
      icon: '🏥',
      color: 'text-red-400 border-red-800 bg-red-950/40'
    },
    {
      type: 'AMBULANCE SQUAD',
      name: 'Rapid EMS Paramedic Unit 02',
      distance: '1.4 km',
      eta: '02:18',
      status: 'EN ROUTE (SIRENS ON)',
      icon: '🚑',
      color: 'text-amber-400 border-amber-800 bg-amber-950/40'
    },
    {
      type: 'POLICE INTERCEPTOR',
      name: 'Central Traffic Command Unit',
      distance: '2.1 km',
      eta: '03:40',
      status: 'PERIMETER CORDON READY',
      icon: '🚓',
      color: 'text-blue-400 border-blue-800 bg-blue-950/40'
    },
    {
      type: 'FIRE & RESCUE',
      name: 'Metro Rescue Depot 04',
      distance: '3.6 km',
      eta: '05:45',
      status: 'HYDRAULIC CUTTERS EQUIPPED',
      icon: '🚒',
      color: 'text-orange-400 border-orange-800 bg-orange-950/40'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl font-mono text-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                  EMERGENCY RESPONSE SIMULATION
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  isEmergencyActive ? 'bg-red-950 text-red-300 border border-red-700/60 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isEmergencyActive ? 'ANIMATING SIREN ROUTE' : 'READY TO DISPATCH'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                Target Incident Zone: <strong>{selectedRoad.id} ({selectedRoad.name})</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Telemetry KPI Banner */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ESTIMATED RESPONSE TIME</span>
            <div className="text-3xl font-black text-red-400 mt-0.5 font-mono">04:32</div>
            <span className="text-[9px] text-slate-500">SIREN PRIORITY ROUTE</span>
          </div>

          <div className="border-x border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">BLOCKED ROADS</span>
            <div className="text-3xl font-black text-amber-400 mt-0.5 font-mono">02</div>
            <span className="text-[9px] text-amber-400/80 font-bold uppercase">CONGESTION DETOURS</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ALTERNATIVE ROUTE</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">AVAILABLE</div>
            <span className="text-[9px] text-emerald-400/80">GREEN CORRIDOR ACTIVE</span>
          </div>
        </div>

        {/* 3D Dispatch Animation Trigger */}
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span>Animate Siren Route Through 3D Digital City</span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Displays red pulsating emergency trajectory from Apollo Hospital directly to {selectedRoad.id}.
            </p>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playAlertChime();
              onToggleEmergency();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer whitespace-nowrap ${
              isEmergencyActive
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-700/50'
            }`}
          >
            {isEmergencyActive ? 'STOP SIREN ROUTE' : 'DISPATCH & ANIMATE ROUTE'}
          </button>
        </div>

        {/* 4 Emergency Facilities Breakdown */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
            NEAREST EMERGENCY FACILITIES IDENTIFIED
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facilities.map(fac => (
              <div key={fac.type} className={`p-4 rounded-2xl border ${fac.color} space-y-1.5`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{fac.icon}</span>
                    <span className="font-bold text-white text-xs">{fac.type}</span>
                  </div>
                  <span className="font-mono font-black text-sm text-white">{fac.eta}</span>
                </div>

                <div className="text-slate-200 font-bold text-xs">{fac.name}</div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Distance: <strong className="text-white font-mono">{fac.distance}</strong></span>
                  <span className="font-mono font-bold text-[10px] uppercase text-emerald-400">{fac.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-slate-400 text-xs font-sans">
            Automatic traffic light green-wave override triggered along Corridor B.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
