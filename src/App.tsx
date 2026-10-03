import React, { useState, useCallback } from 'react';
import { 
  HIGHWAY_CORRIDORS, 
  INDIAN_STATES, 
  METRO_HUBS, 
  AI_BLACKSPOTS, 
  HighwayCorridor, 
  IndianState, 
  MetroHub, 
  BlackspotCluster 
} from './data/indiaDigitalTwinData';
import { IndiaDigitalTwinCanvas, CameraViewMode } from './components/IndiaDigitalTwinCanvas';
import { FloatingCommandBar } from './components/FloatingCommandBar';
import { TimelineBar } from './components/TimelineBar';
import { RiskForensicsOverlay } from './components/RiskForensicsOverlay';
import { RoadGuardCopilotOrb } from './components/RoadGuardCopilotOrb';
import { WhatIfSimulationModal } from './components/WhatIfSimulationModal';
import { NearMissBlackspotModal } from './components/NearMissBlackspotModal';
import { RoadVisionModal } from './components/RoadVisionModal';
import { RouteSafetyAnalyzerModal } from './components/RouteSafetyAnalyzerModal';
import { EmergencyResponseOverlay } from './components/EmergencyResponseOverlay';
import { AccidentReplayModal } from './components/AccidentReplayModal';
import { CounterfactualEngineModal } from './components/CounterfactualEngineModal';
import { SmartIntersectionModal } from './components/SmartIntersectionModal';
import { RoadRiskDNAModal } from './components/RoadRiskDNAModal';
import { DataMLOpsModal } from './components/DataMLOpsModal';
import { PlacementDemoEngine } from './components/PlacementDemoEngine';
import { FinalAIReportModal } from './components/FinalAIReportModal';
import { GitHubPrototypeModal } from './components/GitHubPrototypeModal';
import { tacticalAudio } from './services/tacticalAudio';

export default function App() {
  // Primary Selected Entities
  const [selectedHighway, setSelectedHighway] = useState<HighwayCorridor>(HIGHWAY_CORRIDORS[0]); // NH-44 Tamil Nadu
  const [selectedState, setSelectedState] = useState<IndianState | null>(INDIAN_STATES[0]); // Tamil Nadu
  const [selectedMetro, setSelectedMetro] = useState<MetroHub | null>(METRO_HUBS[0]); // Chennai
  const [selectedBlackspot, setSelectedBlackspot] = useState<BlackspotCluster | null>(AI_BLACKSPOTS[0]); // Namakkal S-Bend

  // Canvas View & Simulation States
  const [viewMode, setViewMode] = useState<CameraViewMode>('MAP');
  const [weatherOverlay, setWeatherOverlay] = useState<'clear' | 'monsoon' | 'fog'>('monsoon');
  const [futureTimeOffsetHours, setFutureTimeOffsetHours] = useState<number>(0);
  const [scenarioDelta, setScenarioDelta] = useState<number>(0);
  const [isRiskPropagationActive, setIsRiskPropagationActive] = useState<boolean>(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Floating Overlays & Modals
  const [isForensicsOpen, setIsForensicsOpen] = useState<boolean>(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isNearMissOpen, setIsNearMissOpen] = useState<boolean>(false);
  const [isRoadVisionOpen, setIsRoadVisionOpen] = useState<boolean>(false);
  const [isRouteAnalyzerOpen, setIsRouteAnalyzerOpen] = useState<boolean>(false);
  const [isEmergencyOverlayOpen, setIsEmergencyOverlayOpen] = useState<boolean>(false);
  const [isAccidentReplayOpen, setIsAccidentReplayOpen] = useState<boolean>(false);
  const [isCounterfactualOpen, setIsCounterfactualOpen] = useState<boolean>(false);
  const [isIntersectionOpen, setIsIntersectionOpen] = useState<boolean>(false);
  const [isDNAOpen, setIsDNAOpen] = useState<boolean>(false);
  const [isDataMLOpsOpen, setIsDataMLOpsOpen] = useState<boolean>(false);
  const [isPlacementDemoActive, setIsPlacementDemoActive] = useState<boolean>(false);
  const [isFinalReportOpen, setIsFinalReportOpen] = useState<boolean>(false);
  const [isGitHubPrototypeOpen, setIsGitHubPrototypeOpen] = useState<boolean>(false);

  // Search Handler
  const handleSearchSelect = (item: { type: 'highway' | 'state' | 'metro'; id: string }) => {
    tacticalAudio.playRadarPing();
    if (item.type === 'highway') {
      const match = HIGHWAY_CORRIDORS.find(h => h.id === item.id);
      if (match) {
        setSelectedHighway(match);
        setIsForensicsOpen(true);
      }
    } else if (item.type === 'state') {
      const match = INDIAN_STATES.find(s => s.id === item.id);
      if (match) setSelectedState(match);
    } else if (item.type === 'metro') {
      const match = METRO_HUBS.find(m => m.id === item.id);
      if (match) setSelectedMetro(match);
    }
  };

  // Automated Placement Demo Step Synchronization
  const handleDemoStepChange = useCallback((stepIndex: number) => {
    switch (stepIndex) {
      case 1: // National Risk Pulse
        setIsForensicsOpen(false);
        setFutureTimeOffsetHours(0);
        setIsEmergencyActive(false);
        setIsRiskPropagationActive(false);
        setViewMode('MAP');
        break;
      case 2: // Event Detected: NH-44
        setSelectedHighway(HIGHWAY_CORRIDORS[0]);
        setIsForensicsOpen(true);
        setViewMode('3D ISOMETRIC');
        break;
      case 3: // Causal Graph & Forensics
        setIsForensicsOpen(true);
        break;
      case 4: // Near-Miss & Blackspot
        setIsNearMissOpen(true);
        break;
      case 5: // Accident Replay
        setIsNearMissOpen(false);
        setIsAccidentReplayOpen(true);
        break;
      case 6: // Future Risk Prediction
        setIsAccidentReplayOpen(false);
        setFutureTimeOffsetHours(6);
        break;
      case 7: // What-If Simulation
        setIsWhatIfOpen(true);
        setIsRiskPropagationActive(true);
        setScenarioDelta(16);
        break;
      case 8: // Counterfactual Engine
        setIsWhatIfOpen(false);
        setIsCounterfactualOpen(true);
        break;
      case 9: // Route Analyzer
        setIsCounterfactualOpen(false);
        setIsRouteAnalyzerOpen(true);
        break;
      case 10: // Computer Vision
        setIsRouteAnalyzerOpen(false);
        setIsRoadVisionOpen(true);
        break;
      case 11: // Emergency Response
        setIsRoadVisionOpen(false);
        setIsEmergencyActive(true);
        setIsEmergencyOverlayOpen(true);
        break;
      case 12: // Final Report
        setIsEmergencyOverlayOpen(false);
        setIsFinalReportOpen(true);
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#070B14] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 1. HERO VIEWPORT: 3D DIGITAL TWIN OF INDIA (Occupies entire screen) */}
      <IndiaDigitalTwinCanvas
        selectedHighway={selectedHighway}
        onSelectHighway={(hwy) => {
          setSelectedHighway(hwy);
          setIsForensicsOpen(true);
        }}
        selectedState={selectedState}
        onSelectState={setSelectedState}
        selectedMetro={selectedMetro}
        onSelectMetro={setSelectedMetro}
        selectedBlackspot={selectedBlackspot}
        onSelectBlackspot={setSelectedBlackspot}
        viewMode={viewMode}
        setViewMode={setViewMode}
        weatherOverlay={weatherOverlay}
        setWeatherOverlay={setWeatherOverlay}
        futureTimeOffsetHours={futureTimeOffsetHours}
        scenarioDelta={scenarioDelta}
        isEmergencyMode={isEmergencyActive}
        isRiskPropagationActive={isRiskPropagationActive}
        onOpenForensics={() => setIsForensicsOpen(true)}
        onOpenNearMiss={() => setIsNearMissOpen(true)}
        onOpenIntersection={() => setIsIntersectionOpen(true)}
      />

      {/* 2. TOP ZERO-CLUTTER FLOATING COMMAND BAR */}
      <FloatingCommandBar
        onSearchSelect={handleSearchSelect}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onOpenRoadVision={() => setIsRoadVisionOpen(true)}
        onOpenEmergencyMode={() => {
          const next = !isEmergencyActive;
          setIsEmergencyActive(next);
          setIsEmergencyOverlayOpen(next);
        }}
        isEmergencyActive={isEmergencyActive}
        onOpenRouteAnalyzer={() => setIsRouteAnalyzerOpen(true)}
        onOpenDataMLOps={() => setIsDataMLOpsOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onStartDemo={() => setIsPlacementDemoActive(true)}
        onOpenReport={() => setIsFinalReportOpen(true)}
        onOpenGitHubPrototype={() => setIsGitHubPrototypeOpen(true)}
        isDemoMode={isDemoMode}
        highways={HIGHWAY_CORRIDORS}
        states={INDIAN_STATES}
        metros={METRO_HUBS}
      />

      {/* 3. BOTTOM MINIMAL TIMELINE CONTROL */}
      <TimelineBar
        currentOffsetHours={futureTimeOffsetHours}
        onSelectOffsetHours={setFutureTimeOffsetHours}
      />

      {/* 4. CONTEXTUAL FLOATING FORENSICS INVESTIGATION OVERLAY */}
      {isForensicsOpen && (
        <RiskForensicsOverlay
          highway={selectedHighway}
          onClose={() => setIsForensicsOpen(false)}
          onOpenWhatIf={() => setIsWhatIfOpen(true)}
          onOpenNearMiss={() => setIsNearMissOpen(true)}
          onOpenIntersection={() => setIsIntersectionOpen(true)}
          onOpenDNA={() => setIsDNAOpen(true)}
          onOpenReplay={() => setIsAccidentReplayOpen(true)}
          onOpenCounterfactual={() => setIsCounterfactualOpen(true)}
        />
      )}

      {/* 5. FLOATING AI COPILOT ORB (Expands on click) */}
      <RoadGuardCopilotOrb
        isOpen={isCopilotOpen}
        onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
        selectedHighway={selectedHighway}
        onSelectHighway={(hwy) => {
          setSelectedHighway(hwy);
          setIsForensicsOpen(true);
        }}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onOpenRouteAnalyzer={() => setIsRouteAnalyzerOpen(true)}
        onOpenEmergency={() => {
          setIsEmergencyActive(true);
          setIsEmergencyOverlayOpen(true);
        }}
      />

      {/* 6. WHAT-IF DIGITAL TWIN SCENARIO LAB MODAL */}
      <WhatIfSimulationModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        highway={selectedHighway}
        onApplyScenario={(delta, isPropagating) => {
          setScenarioDelta(delta);
          setIsRiskPropagationActive(isPropagating);
        }}
      />

      {/* 7. NEAR-MISS & AI BLACKSPOT CLUSTERING MODAL */}
      <NearMissBlackspotModal
        isOpen={isNearMissOpen}
        onClose={() => setIsNearMissOpen(false)}
        highway={selectedHighway}
        selectedBlackspot={selectedBlackspot}
        onSelectBlackspot={setSelectedBlackspot}
      />

      {/* 8. COMPUTER VISION ROAD VISION INSPECTOR */}
      <RoadVisionModal
        isOpen={isRoadVisionOpen}
        onClose={() => setIsRoadVisionOpen(false)}
      />

      {/* 9. SAFETY-FIRST INTERSTATE ROUTE ANALYZER */}
      <RouteSafetyAnalyzerModal
        isOpen={isRouteAnalyzerOpen}
        onClose={() => setIsRouteAnalyzerOpen(false)}
      />

      {/* 10. TACTICAL EMERGENCY RESPONSE OVERLAY */}
      <EmergencyResponseOverlay
        isOpen={isEmergencyOverlayOpen}
        onClose={() => {
          setIsEmergencyOverlayOpen(false);
          setIsEmergencyActive(false);
        }}
      />

      {/* 11. 4-PHASE ACCIDENT RECONSTRUCTION REPLAY MODAL */}
      <AccidentReplayModal
        isOpen={isAccidentReplayOpen}
        onClose={() => setIsAccidentReplayOpen(false)}
        highway={selectedHighway}
      />

      {/* 12. AI COUNTERFACTUAL INTERVENTION ENGINE */}
      <CounterfactualEngineModal
        isOpen={isCounterfactualOpen}
        onClose={() => setIsCounterfactualOpen(false)}
        highway={selectedHighway}
      />

      {/* 13. SMART INTERSECTION SIGNAL TIMING MODAL */}
      <SmartIntersectionModal
        isOpen={isIntersectionOpen}
        onClose={() => setIsIntersectionOpen(false)}
        highway={selectedHighway}
      />

      {/* 14. 8-AXIS ROAD RISK DNA HOLOGRAPHIC MODAL */}
      <RoadRiskDNAModal
        isOpen={isDNAOpen}
        onClose={() => setIsDNAOpen(false)}
        selectedRoad={selectedHighway}
      />

      {/* 15. DATA TRANSPARENCY & MLOPS PLATFORM */}
      <DataMLOpsModal
        isOpen={isDataMLOpsOpen}
        onClose={() => setIsDataMLOpsOpen(false)}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
      />

      {/* 16. AUTOMATED 12-STAGE PLACEMENT DEMO ENGINE */}
      <PlacementDemoEngine
        isActive={isPlacementDemoActive}
        onClose={() => setIsPlacementDemoActive(false)}
        onStepChange={handleDemoStepChange}
      />

      {/* 17. FINAL EXECUTIVE ROAD SAFETY REPORT MODAL */}
      <FinalAIReportModal
        isOpen={isFinalReportOpen}
        onClose={() => setIsFinalReportOpen(false)}
        highway={selectedHighway}
        onStartNewInvestigation={() => {
          setIsPlacementDemoActive(false);
          setScenarioDelta(0);
          setFutureTimeOffsetHours(0);
          setIsEmergencyActive(false);
          setIsRiskPropagationActive(false);
          setIsForensicsOpen(true);
        }}
      />

      {/* 18. GITHUB SAMPLE PROTOTYPE MODAL */}
      <GitHubPrototypeModal
        isOpen={isGitHubPrototypeOpen}
        onClose={() => setIsGitHubPrototypeOpen(false)}
      />

    </div>
  );
}
