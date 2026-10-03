import React, { useState } from 'react';
import { X, Sliders, Cpu, Bell, MapPin, Shield, Check, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [modelEngine, setModelEngine] = useState<string>('xgboost');
  const [alertThreshold, setAlertThreshold] = useState<number>(80);
  const [trafficVectors, setTrafficVectors] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(false);
  const [projectionSystem, setProjectionSystem] = useState<string>('wgs84');
  const [autoDispatchRadius, setAutoDispatchRadius] = useState<number>(5.0);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#E6E3DC] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E3DC] bg-[#F8F7F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1C1E21] text-white flex items-center justify-center font-mono font-bold text-xs">
              <Sliders className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                System & AI Engine Configuration
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">Platform Parameters & Twin Settings</span>
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
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Machine Learning Model Engine */}
          <div className="space-y-2">
            <label className="flex items-center justify-between font-mono text-[11px] font-bold text-zinc-800 uppercase">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-600" />
                Active Risk Inference Engine
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">CALIBRATED</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'xgboost', name: 'XGBoost v2.4 (Optimized)', desc: '91.2% Acc · 0.898 F1' },
                { id: 'lightgbm', name: 'LightGBM Gradient', desc: '90.7% Acc · 0.884 F1' },
                { id: 'randomforest', name: 'Random Forest (150 trees)', desc: '89.4% Acc · 0.878 F1' },
                { id: 'ensemble', name: 'Meta-Ensemble Hybrid', desc: '91.8% Acc · 0.902 F1' }
              ].map(engine => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => setModelEngine(engine.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    modelEngine === engine.id
                      ? 'border-violet-600 bg-violet-50/60 ring-1 ring-violet-600'
                      : 'border-[#E6E3DC] hover:border-zinc-400 bg-[#FAF9F6]'
                  }`}
                >
                  <div className="font-bold text-zinc-900">{engine.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{engine.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Critical Risk Alert Threshold */}
          <div className="space-y-1.5 pt-2 border-t border-[#E6E3DC]">
            <div className="flex justify-between font-mono text-[11px] font-bold text-zinc-800">
              <span className="flex items-center gap-1.5 uppercase">
                <Bell className="w-3.5 h-3.5 text-red-600" />
                Critical Anomaly Alert Threshold
              </span>
              <span className="text-red-600 font-black">{alertThreshold} / 100</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Triggers high-priority notifications and emergency dispatch advisories when road segment risk surpasses this score.
            </p>
            <input
              type="range"
              min="70"
              max="95"
              step="1"
              value={alertThreshold}
              onChange={e => setAlertThreshold(parseInt(e.target.value))}
              className="w-full accent-red-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>70 (Aggressive)</span>
              <span>80 (Recommended Baseline)</span>
              <span>95 (Conservative)</span>
            </div>
          </div>

          {/* Emergency Access Radius */}
          <div className="space-y-1.5 pt-2 border-t border-[#E6E3DC]">
            <div className="flex justify-between font-mono text-[11px] font-bold text-zinc-800">
              <span className="flex items-center gap-1.5 uppercase">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                Emergency Facility Golden-Hour Radius
              </span>
              <span className="text-amber-700 font-black">{autoDispatchRadius} km</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Search perimeter for Level-1 trauma centers and paramedic response units.
            </p>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={autoDispatchRadius}
              onChange={e => setAutoDispatchRadius(parseFloat(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Display & Toggles */}
          <div className="space-y-3 pt-2 border-t border-[#E6E3DC]">
            <div className="font-mono text-[11px] font-bold text-zinc-800 uppercase">
              Display & Feedback Settings
            </div>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-[#FAF9F6] border border-[#E6E3DC]">
              <div>
                <div className="font-bold text-zinc-900">Dynamic Traffic Particle Vectors</div>
                <div className="text-[10px] text-zinc-500">Render live SVG flow pulses along arterial corridors</div>
              </div>
              <input
                type="checkbox"
                checked={trafficVectors}
                onChange={e => setTrafficVectors(e.target.checked)}
                className="w-4 h-4 accent-violet-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-[#FAF9F6] border border-[#E6E3DC]">
              <div>
                <div className="font-bold text-zinc-900">Audible Incident Radar Alert</div>
                <div className="text-[10px] text-zinc-500">Play subtle acoustic chime when an anomaly exceeds +3.0σ</div>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={e => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 accent-violet-600 cursor-pointer"
              />
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8F7F4] border-t border-[#E6E3DC] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setModelEngine('xgboost');
              setAlertThreshold(80);
              setTrafficVectors(true);
              setSoundAlerts(false);
              setAutoDispatchRadius(5.0);
            }}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-mono text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md border border-[#E6E3DC] text-zinc-700 hover:bg-zinc-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#1C1E21] hover:bg-zinc-800 text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Parameters</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
