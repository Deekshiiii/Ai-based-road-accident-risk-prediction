import React, { useState, useEffect } from 'react';
import { X, Database, Wifi, WifiOff, RefreshCw, Trash2, Check, HardDrive, Cpu, ShieldCheck } from 'lucide-react';
import { offlineCache, CacheMetadata } from '../services/offlineCacheService';
import { ROAD_SEGMENTS } from '../data/roadGuardData';

interface OfflineCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineCacheModal: React.FC<OfflineCacheModalProps> = ({ isOpen, onClose }) => {
  const [meta, setMeta] = useState<CacheMetadata>(offlineCache.getMetadata());
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(offlineCache.isOffline());
  const [syncToast, setSyncToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMeta(offlineCache.getMetadata());
      setIsSimulatedOffline(offlineCache.isOffline());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleOffline = () => {
    const nextState = !isSimulatedOffline;
    setIsSimulatedOffline(nextState);
    offlineCache.setSimulatedOffline(nextState);
    setMeta(offlineCache.getMetadata());
    setSyncToast(nextState ? 'Offline Simulation Enabled' : 'Live Sync Re-established');
    setTimeout(() => setSyncToast(null), 1800);
  };

  const handleForceSync = () => {
    offlineCache.cacheAllSegments(ROAD_SEGMENTS);
    setMeta(offlineCache.getMetadata());
    setSyncToast('Re-synced All 11 Corridors to LocalStorage');
    setTimeout(() => setSyncToast(null), 1800);
  };

  const handlePurge = () => {
    offlineCache.purgeCache();
    setMeta(offlineCache.getMetadata());
    setSyncToast('Cache Purged & Reset to Factory Baseline');
    setTimeout(() => setSyncToast(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#E6E3DC] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E3DC] bg-[#F8F7F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1C1E21] text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                <span>LocalStorage Offline Cache Engine</span>
                {isSimulatedOffline ? (
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">
                    OFFLINE MODE
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">
                    LIVE SYNC
                  </span>
                )}
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">Edge Persistence & Zero-Latency Resiliency</span>
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
          
          {/* Toast Notice */}
          {syncToast && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2 font-mono text-xs animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{syncToast}</span>
            </div>
          )}

          {/* Cache Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DC]">
              <span className="text-[10px] text-zinc-500 block uppercase">CACHED CORRIDORS</span>
              <div className="text-xl font-black text-zinc-900 mt-1">{meta.itemCount} Units</div>
              <span className="text-[9px] text-emerald-700">100% Retrievable</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DC]">
              <span className="text-[10px] text-zinc-500 block uppercase">STORAGE ALLOCATION</span>
              <div className="text-xl font-black text-zinc-900 mt-1">
                {(meta.estimatedBytes / 1024).toFixed(1)} <span className="text-xs font-normal">KB</span>
              </div>
              <span className="text-[9px] text-zinc-500">LocalStorage V2</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DC]">
              <span className="text-[10px] text-zinc-500 block uppercase">LAST SYNCED</span>
              <div className="text-xs font-bold text-zinc-800 mt-1 truncate">
                {new Date(meta.lastSynced).toLocaleTimeString()}
              </div>
              <span className="text-[9px] text-violet-700 font-bold">Auto-Refreshed</span>
            </div>
          </div>

          {/* Offline Mode Switcher */}
          <div className="p-4 rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                {isSimulatedOffline ? (
                  <WifiOff className="w-4 h-4 text-amber-600" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-600" />
                )}
                <span>Simulate Offline Disconnected State</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">
                Demonstrates how ROADGUARD AI operates seamlessly without internet access using cached road telemetry and SHAP matrices.
              </p>
            </div>

            <button
              onClick={handleToggleOffline}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                isSimulatedOffline
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}
            >
              {isSimulatedOffline ? 'OFFLINE (ACTIVE)' : 'GO OFFLINE'}
            </button>
          </div>

          {/* Cached Corridors List */}
          <div className="space-y-2 font-mono">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              LOCALLY PERSISTED CORRIDOR RECORD IDENTIFIERS
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {ROAD_SEGMENTS.map(s => (
                <div key={s.id} className="p-2 bg-white rounded border border-[#E6E3DC] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <strong className="text-zinc-900">{s.id}</strong>
                    <span className="text-zinc-500 text-[10px] truncate">{s.name}</span>
                  </div>
                  <span className="text-zinc-600 font-bold ml-1">{s.currentRiskScore}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8F7F4] border-t border-[#E6E3DC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleForceSync}
              className="flex items-center gap-1 px-3 py-1.5 text-zinc-700 hover:text-black hover:bg-zinc-200/60 rounded font-mono text-[11px] font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Re-sync</span>
            </button>
            <button
              onClick={handlePurge}
              className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded font-mono text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Cache</span>
            </button>
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
