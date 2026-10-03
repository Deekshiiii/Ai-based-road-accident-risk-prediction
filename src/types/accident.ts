export type AccidentSeverity = 'Fatal' | 'Severe' | 'Slight';

export type WeatherCondition = 'Clear' | 'Rain' | 'Fog/Mist' | 'Snow' | 'Storm' | 'Windy';

export type RoadType = 'Expressway' | 'National Highway' | 'State Highway' | 'Urban Arterial' | 'Commercial Collector' | 'Residential Street';

export type RoadSurface = 'Dry' | 'Wet' | 'Flooded' | 'Icy' | 'Loose Gravel';

export type JunctionType = 'T-Junction' | 'Crossroad' | 'Roundabout' | 'Flyover Ramp' | 'Straight Highway' | 'Blind Curve';

export type TrafficDensity = 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';

export type LightingCondition = 'Daylight' | 'Dusk/Dawn' | 'Dark - Street Lights On' | 'Dark - No Street Lights';

export type RiskLevel = 'Safe' | 'Elevated' | 'High' | 'Critical' | 'Low' | 'Moderate' | 'Very High';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Building3D {
  id: string;
  name?: string;
  x: number; // grid position
  y: number;
  width: number;
  depth: number;
  height: number;
  type: 'commercial' | 'residential' | 'hospital' | 'police' | 'fire_station' | 'skyscraper' | 'landmark';
  color?: string;
  roofColor?: string;
  hasHelipad?: boolean;
}

export interface Vehicle3D {
  id: string;
  roadId: string;
  progress: number; // 0 to 1 along segment
  speed: number;
  type: 'car' | 'truck' | 'bus' | 'ambulance';
  color: string;
  isEmergency?: boolean;
  laneOffset?: number;
}

export interface Intervention3D {
  id: string;
  roadId: string;
  type: 'lighting' | 'signals' | 'signage' | 'resurface' | 'police_radar' | 'ambulance_post';
  title: string;
  description: string;
  riskReductionPct: number;
  cost: number;
  priority: 'HIGH' | 'MEDIUM';
  active: boolean;
  icon: string;
  locationLabel: string;
}

export interface CausalNode {
  id: string;
  label: string;
  description: string;
  value: string;
  impactScore: number;
  category: 'weather' | 'visibility' | 'infrastructure' | 'traffic' | 'risk';
}

export interface EmergencyRoutePlan {
  hospitalName: string;
  hospitalCoords: Point3D;
  targetRoadId: string;
  targetCoords: Point3D;
  estimatedTimeMin: number;
  distanceKm: number;
  blockedCount: number;
  alternativeRouteAvailable: boolean;
  waypoints: Point3D[];
  priorityClearanceActive: boolean;
}

export interface IncidentReplayFrame {
  phase: 'BEFORE' | 'RISK BUILDUP' | 'INCIDENT' | 'AFTERMATH';
  time: string;
  trafficDensityPct: number;
  weatherState: string;
  roadFrictionCoeff: number;
  riskScore: number;
  eventDescription: string;
  telemetry: {
    leadVehicleSpeed: number;
    trailingVehicleSpeed: number;
    headwayMeters: number;
    brakingForceG: number;
  };
}

export interface PlannerInvestmentOption {
  id: string;
  category: 'Smart Lighting' | 'Friction Resurfacing' | 'Adaptive Signals' | 'Automated Speed Radar' | 'Paramedic Depots';
  cost: number;
  targetRoadId: string;
  roadName: string;
  expectedRiskReduction: number;
  annualAccidentsAvoided: number;
  purchased: boolean;
}

export interface RouteSegmentAnalysis {
  id: string;
  name: string;
  roadType: RoadType;
  lengthKm: number;
  riskScore: number;
  riskLevel: RiskLevel;
  keyHazards: string[];
  hotspotOverlap: boolean;
  hotspotName?: string;
  coordinates: [number, number][];
}

export interface RouteAnalysis {
  routeName: string;
  origin: string;
  destination: string;
  totalDistanceKm: number;
  estimatedTravelTimeMin: number;
  overallRouteRisk: number;
  overallRiskLevel: RiskLevel;
  hotspotsCrossedCount: number;
  highRiskSegmentsCount: number;
  segments: RouteSegmentAnalysis[];
  safetyAdvisory: string[];
}

export interface ModelMetrics {
  name: string;
  algorithm?: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  mae?: number;
  rmse?: number;
  trainingTimeSec: number;
  inferenceLatencyMs?: number;
  hyperparameters: Record<string, string | number>;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
    tp?: number;
    fp?: number;
    tn?: number;
    fn?: number;
  };
}

export interface AccidentRecord {
  id: string;
  date: string;
  time: string;
  hour: number;
  dayOfWeek: string;
  month: string;
  year: number;
  latitude: number;
  longitude: number;
  locationName: string;
  segmentId?: string;
  severity: AccidentSeverity;
  vehiclesInvolved: number;
  casualties: number;
  injuries: number;
  roadType: RoadType;
  lanes: number;
  roadSurface: RoadSurface;
  junctionType: JunctionType;
  speedLimit: number;
  trafficVolume: TrafficDensity;
  weather: WeatherCondition;
  rainfallMm: number;
  visibilityKm: number;
  lighting: LightingCondition;
  isWeekend: boolean;
  isPeakHour: boolean;
}

export interface HotspotCluster {
  id: string;
  name: string;
  clusterIndex: number;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  accidentCount: number;
  fatalCount: number;
  severeCount: number;
  slightCount: number;
  primaryRiskFactor: string;
  riskScore: number;
  riskLevel: RiskLevel;
  roadNames: string[];
  accidents: AccidentRecord[];
}

export interface RiskFingerprint {
  accidentHistory: number; // 0-100
  traffic: number;
  infrastructure: number;
  weather: number;
  visibility: number;
  severityPattern: number;
}

export interface DetectedAnomaly {
  id: string;
  segmentId: string;
  segmentName: string;
  type: 'Sudden Accident Frequency Spike' | 'Abnormal Speed Variance' | 'Environmental Friction Anomaly' | 'Unusual Nocturnal Severity Surge' | 'Emergency Access Bottleneck';
  severity: 'Critical' | 'Elevated' | 'Moderate';
  deviationZScore: number; // e.g. +3.4σ
  observedValue: string;
  expectedBaseline: string;
  timestamp: string;
  supportingData: string;
  preventiveAdvisory: string;
}

export interface DetectedPattern {
  id: string;
  category: 'Temporal Cycle' | 'Spatial Clustering' | 'Weather Correlation' | 'Road Geometry' | 'Vehicle Fleet';
  title: string;
  description: string;
  confidence: number; // 0-1
  affectedSegments: string[];
  preventiveInsight: string;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: 'Level 1 Trauma Center' | 'Multi-Specialty Hospital' | 'Emergency Paramedic Station' | 'Fire & Rescue Depot';
  lat: number;
  lng: number;
  coverageRadiusMeters: number;
  averageDispatchMin: number;
}

export interface RoadSegmentProfile {
  id: string; // e.g. 'R-204', 'R-102'
  name: string;
  corridor: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  centerLat: number;
  centerLng: number;
  lengthKm: number;
  roadType: RoadType;
  junctionType: JunctionType;
  speedLimit: number;
  lanes: number;
  currentRiskScore: number; // 0-100
  riskCategory: RiskLevel;
  fingerprint: RiskFingerprint;
  peakRiskPeriod: string; // e.g. '18:00 – 22:00'
  accidentFrequency: 'Low' | 'Medium' | 'High' | 'Very High';
  severityPattern: 'Low' | 'Medium' | 'High' | 'Critical';
  trafficRisk: 'Low' | 'Medium' | 'High' | 'Severe';
  weatherRisk: 'Low' | 'Medium' | 'High';
  infrastructureRisk: 'Low' | 'Medium' | 'High';
  emergencyAccess: 'High' | 'Medium' | 'Low' | 'Critical Delay';
  nearestHospitalDistanceKm: number;
  nearestTraumaCenter: string;
  isHighRiskLimitedEmergency: boolean;
  diurnalRisk: Record<string, number>;
  recentAccidentCount: number;
  fatalCount: number;
  severeCount: number;
  primaryHazard: string;
  preventiveAction: string;
  // Emergency intelligence
  emergencyDetails?: {
    nearestHospital: string;
    nearestPoliceStation: string;
    nearestFireStation: string;
    estimatedResponseTimeMin: number;
    emergencyRouteName: string;
    blockedRoads: string[];
  };
}

export interface PreventiveRecommendation {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM';
  expectedReduction: string;
  reason: string;
  affectedRoadId: string;
  affectedRoadName: string;
}

export interface ForecastHourPoint {
  time: string;
  score: number;
  riskLevel: RiskLevel;
  weather: string;
  traffic: string;
}

export interface PredictionInput {
  segmentId?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  weather: WeatherCondition;
  roadSurface: RoadSurface;
  trafficLevel: TrafficDensity;
  roadType: RoadType;
  junctionType: JunctionType;
  speedLimit: number;
  visibilityKm: number;
  lanes: number;
  lighting: LightingCondition;
  isPeakHour: boolean;
  isWeekend: boolean;
  historicalAccidentCount?: number;
}

export interface ShapContribution {
  feature: string;
  value: string | number;
  impactScore: number;
  direction: 'increase' | 'decrease';
  explanation: string;
}

export interface PredictionResult {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number;
  baseRate: number;
  contributions: ShapContribution[];
  topContributingFactors: string[];
  recommendedPrecautions: string[];
  fingerprint: RiskFingerprint;
  modelUsed: string;
  closestHotspot?: {
    name: string;
    distanceMeters: number;
    riskScore: number;
  };
  emergencyAccessInfo?: {
    accessLevel: string;
    distanceKm: number;
    isHighRiskLimitedEmergency: boolean;
  };
  accidentProbability?: number; // e.g. 0.78
  predictedSeverity?: 'Critical' | 'Severe' | 'Moderate' | 'Minor';
}
