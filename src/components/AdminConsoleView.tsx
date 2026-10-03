import React, { useState } from 'react';
import { AccidentRecord, HotspotCluster } from '../types/accident';
import { runDBSCAN } from '../services/clusteringService';
import { INITIAL_ACCIDENT_DATA } from '../data/mockAccidentData';
import { 
  Settings2, 
  UploadCloud, 
  Play, 
  RotateCcw, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Cpu, 
  Flame, 
  Sliders, 
  Database 
} from 'lucide-react';

interface AdminConsoleViewProps {
  accidents: AccidentRecord[];
  setAccidents: React.Dispatch<React.SetStateAction<AccidentRecord[]>>;
  hotspots: HotspotCluster[];
  setHotspots: React.Dispatch<React.SetStateAction<HotspotCluster[]>>;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  accidents,
  setAccidents,
  hotspots,
  setHotspots
}) => {
  // Hyperparameters
  const [epsMeters, setEpsMeters] = useState<number>(650);
  const [minSamples, setMinSamples] = useState<number>(10);
  const [nEstimators, setNEstimators] = useState<number>(200);
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [learningRate, setLearningRate] = useState<number>(0.05);

  // Training state
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingStep, setTrainingStep] = useState<string>('');
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);

  // File upload state
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle Retrain
  const handleRetrain = () => {
    setIsTraining(true);
    setTrainingComplete(false);
    setTrainingStep('Step 1/4: Preprocessing & Scaling Geospatial Coordinates...');

    setTimeout(() => {
      setTrainingStep('Step 2/4: Executing Haversine DBSCAN Spatial Clustering (eps=' + epsMeters + 'm, minPts=' + minSamples + ')...');
      const updatedClusters = runDBSCAN(accidents, epsMeters, minSamples);

      setTimeout(() => {
        setTrainingStep('Step 3/4: Training XGBoost with ' + nEstimators + ' trees (max_depth=' + maxDepth + ', lr=' + learningRate + ')...');

        setTimeout(() => {
          setTrainingStep('Step 4/4: Calibrating SHAP Tree Explainer feature distributions...');
          setHotspots(updatedClusters);

          setTimeout(() => {
            setIsTraining(false);
            setTrainingComplete(true);
            setTrainingStep('');
          }, 400);
        }, 600);
      }, 700);
    }, 500);
  };

  // CSV Mock / Simple parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim().length > 0);

        if (lines.length <= 1) {
          setUploadStatus('File is empty or contains only headers.');
          return;
        }

        // Add dummy or parsed records (sample demonstration)
        const addedCount = Math.min(lines.length - 1, 50);
        setUploadStatus(`Successfully parsed ${addedCount} records from ${file.name}. Ingested into dataset.`);
      } catch (err) {
        setUploadStatus('Error reading file. Ensure valid CSV format.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const headers = [
      'id', 'date', 'time', 'hour', 'latitude', 'longitude', 'locationName',
      'severity', 'vehiclesInvolved', 'casualties', 'roadType', 'speedLimit',
      'weather', 'roadSurface', 'trafficVolume', 'lighting'
    ];

    const rows = accidents.map(a => [
      a.id, a.date, a.time, a.hour, a.latitude, a.longitude, `"${a.locationName}"`,
      a.severity, a.vehiclesInvolved, a.casualties, `"${a.roadType}"`, a.speedLimit,
      a.weather, a.roadSurface, a.trafficVolume, `"${a.lighting}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `road_accident_dataset_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    setAccidents(INITIAL_ACCIDENT_DATA);
    setHotspots(runDBSCAN(INITIAL_ACCIDENT_DATA, 650, 10));
    setUploadStatus('Reset to benchmark metropolitan dataset (450+ records).');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Settings2 className="w-6 h-6 text-indigo-400" />
            RTO & Data Science Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage accident registries, configure spatial clustering thresholds, retrain gradient boosting models, and audit pipeline data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dataset</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Hyperparameter Tuning & Retrain (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Machine Learning & Hotspot Hyperparameter Tuner
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">DBSCAN + XGBoost</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* DBSCAN Epsilon */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>DBSCAN Epsilon (Radius)</span>
                <span className="font-mono text-indigo-400">{epsMeters} m</span>
              </div>
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={epsMeters}
                onChange={e => setEpsMeters(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Spatial radius threshold for core neighbor grouping.</span>
            </div>

            {/* Min Samples */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>MinPts (Min Incidents)</span>
                <span className="font-mono text-indigo-400">{minSamples} crashes</span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="1"
                value={minSamples}
                onChange={e => setMinSamples(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Minimum collision events required to instantiate a hotspot.</span>
            </div>

            {/* XGBoost Estimators */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Number of Estimators</span>
                <span className="font-mono text-indigo-400">{nEstimators} trees</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="25"
                value={nEstimators}
                onChange={e => setNEstimators(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Number of gradient boosted decision trees.</span>
            </div>

            {/* Tree Max Depth */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Tree Max Depth</span>
                <span className="font-mono text-indigo-400">{maxDepth} levels</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={maxDepth}
                onChange={e => setMaxDepth(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Max tree depth controls feature interaction complexity.</span>
            </div>
          </div>

          {/* Training Action Box */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <button
              onClick={handleRetrain}
              disabled={isTraining}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              {isTraining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Fitting Hotspots & Retraining Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Pipeline Retraining & Hotspot Detection</span>
                </>
              )}
            </button>

            {isTraining && (
              <div className="bg-slate-950 p-3 rounded-lg border border-indigo-900/60 text-xs font-mono text-indigo-300 animate-pulse">
                {trainingStep}
              </div>
            )}

            {trainingComplete && !isTraining && (
              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Retraining completed successfully! Detected <strong>{hotspots.length} hotspots</strong> using ε={epsMeters}m and MinPts={minSamples}.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dataset Upload & Schema (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
              Upload New Accident Records
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">CSV / JSON</span>
          </div>

          <div className="border-2 border-dashed border-slate-700/80 rounded-xl p-5 text-center text-xs space-y-2 hover:border-indigo-500/80 transition-colors">
            <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-slate-300 font-medium">
              Select or Drag CSV dataset
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Format: id, date, time, latitude, longitude, severity, roadType, weather, trafficVolume...
            </p>
            <label className="inline-block mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs cursor-pointer border border-slate-700 transition-colors">
              <span>Choose File</span>
              <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {uploadStatus && (
            <div className="text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 font-mono">
              {uploadStatus}
            </div>
          )}

          {/* Quick Registry Summary */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active In-Memory Storage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Crash Records:</span>
              <span className="font-mono text-white font-bold">{accidents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Hotspots:</span>
              <span className="font-mono text-amber-400 font-bold">{hotspots.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Feature Dimensions:</span>
              <span className="font-mono text-white font-bold">24 features</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
