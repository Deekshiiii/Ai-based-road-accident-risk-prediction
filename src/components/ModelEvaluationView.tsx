import React, { useState } from 'react';
import { EVALUATED_MODELS, GLOBAL_FEATURE_IMPORTANCE } from '../services/mlRiskModel';
import { ModelMetrics } from '../types/accident';
import { 
  BarChart3, 
  CheckCircle2, 
  Cpu, 
  GitBranch, 
  TrendingUp, 
  Layers, 
  Flame, 
  Info 
} from 'lucide-react';

export const ModelEvaluationView: React.FC = () => {
  const [selectedModelKey, setSelectedModelKey] = useState<string>('XGBoost (Gradient Boosted Trees)');
  const currentModel: ModelMetrics = EVALUATED_MODELS[selectedModelKey] || EVALUATED_MODELS['XGBoost (Gradient Boosted Trees)'];

  const modelsList = Object.values(EVALUATED_MODELS);

  const cm = currentModel.confusionMatrix;
  const totalTestCases = cm.truePositive + cm.falsePositive + cm.trueNegative + cm.falseNegative;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Machine Learning Model Benchmark & Spatial Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empirical comparative assessment across gradient boosted trees, bagged ensembles, and linear baselines evaluated on an 80/20 stratified train-test split.
          </p>
        </div>

        {/* Selected Model Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-slate-400">Inspected Model:</span>
          <select
            value={selectedModelKey}
            onChange={e => setSelectedModelKey(e.target.value)}
            className="bg-transparent font-medium text-indigo-300 focus:outline-hidden cursor-pointer"
          >
            {modelsList.map(m => (
              <option key={m.name} value={m.name} className="bg-slate-900 text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Cross-Model Evaluation Matrix (Test Split N=417)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Metrics calculated on identical held-out test distributions with cross-entropy and ROC-AUC scoring.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
                <th className="py-2.5 px-3">Inference / Fit (s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {modelsList.map(m => {
                const isSelected = m.name === selectedModelKey;
                return (
                  <tr 
                    key={m.name} 
                    onClick={() => setSelectedModelKey(m.name)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-950/40 text-white' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-300">{(m.f1Score * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{m.rocAuc.toFixed(3)}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{m.trainingTimeSec}s</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix & Hyperparameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Confusion Matrix visualizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              Confusion Matrix: {currentModel.name}
            </h3>
            <span className="text-xs text-slate-400 font-mono">N={totalTestCases}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
            {/* True Positive */}
            <div className="bg-emerald-950/30 border border-emerald-800/50 p-4 rounded-xl space-y-1">
              <span className="text-emerald-400 font-semibold block text-[11px]">True Positives (TP)</span>
              <div className="text-3xl font-extrabold font-mono text-white">{cm.truePositive}</div>
              <span className="text-[10px] text-slate-400 block">High Risk correctly predicted</span>
            </div>

            {/* False Positive */}
            <div className="bg-red-950/20 border border-red-800/40 p-4 rounded-xl space-y-1">
              <span className="text-red-400 font-semibold block text-[11px]">False Positives (FP)</span>
              <div className="text-3xl font-extrabold font-mono text-slate-300">{cm.falsePositive}</div>
              <span className="text-[10px] text-slate-400 block">Type I Error (False Alarm)</span>
            </div>

            {/* False Negative */}
            <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl space-y-1">
              <span className="text-amber-400 font-semibold block text-[11px]">False Negatives (FN)</span>
              <div className="text-3xl font-extrabold font-mono text-slate-300">{cm.falseNegative}</div>
              <span className="text-[10px] text-slate-400 block">Type II Error (Missed Hazard)</span>
            </div>

            {/* True Negative */}
            <div className="bg-indigo-950/30 border border-indigo-800/50 p-4 rounded-xl space-y-1">
              <span className="text-indigo-400 font-semibold block text-[11px]">True Negatives (TN)</span>
              <div className="text-3xl font-extrabold font-mono text-white">{cm.trueNegative}</div>
              <span className="text-[10px] text-slate-400 block">Low/Moderate correctly identified</span>
            </div>
          </div>

          {/* Quick Metrics Calculation breakdown */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
            <div>Specificity: {((cm.trueNegative / (cm.trueNegative + cm.falsePositive)) * 100).toFixed(1)}%</div>
            <div>Sensitivity (Recall): {((cm.truePositive / (cm.truePositive + cm.falseNegative)) * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Right: Global Feature Importance (Gini / Gain) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Global Feature Importance Ranking
            </h3>
            <span className="text-xs text-slate-400 font-mono">Mean Gini Gain</span>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {GLOBAL_FEATURE_IMPORTANCE.map(item => {
              const pct = (item.importance * 100).toFixed(1);
              return (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-400">
                        {item.category}
                      </span>
                      <span>{item.feature}</span>
                    </span>
                    <span className="font-mono font-bold text-white">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(100, item.importance * 400)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Spatial Clustering Quality & Methodology Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Geospatial Clustering Algorithm Evaluation (DBSCAN vs K-Means)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Haversine Metric</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-white text-sm block">DBSCAN Clustering</span>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Epsilon (Radius):</span>
                <span className="font-mono text-indigo-400">650 meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min Samples (MinPts):</span>
                <span className="font-mono text-indigo-400">10 incidents</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Noise Points Filtered:</span>
                <span className="font-mono text-emerald-400">14.2%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Excels at identifying arbitrary linear and curved road corridor shapes without forcing spherical geometry.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-white text-sm block">K-Means Spatial (k=8)</span>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Number of Centroids:</span>
                <span className="font-mono text-indigo-400">k = 8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Silhouette Coefficient:</span>
                <span className="font-mono text-amber-400">0.582</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inertia (Sum of Squares):</span>
                <span className="font-mono text-slate-300">18.42 km²</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Computes convex circular Voronoi cells; however, can improperly bridge non-contiguous expressway ramps.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-white text-sm block">Engineering Recommendation</span>
            <p className="text-slate-300 text-xs leading-relaxed">
              DBSCAN is selected as the primary production hotspot detector due to its inherent resilience to background dispersed collisions (noise filtering) and accurate representation of winding highway bends.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
