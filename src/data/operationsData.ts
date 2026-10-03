// Enterprise Operations & Incident Management Dataset for ROADGUARD AI
// MoRTH-aligned Data Schemas & Multi-Agency Telemetry

export type IncidentStatus = 'DETECTED' | 'VERIFIED' | 'INVESTIGATING' | 'RESPONSE' | 'RESOLVED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type UserRole = 'ADMIN' | 'ROAD SAFETY ANALYST' | 'TRAFFIC OPERATOR' | 'EMERGENCY OPERATOR' | 'FIELD INSPECTOR' | 'VIEWER';

export interface IncidentRecord {
  id: string;
  title: string;
  type: 'Traffic Collision' | 'Road Obstruction' | 'Severe Flooding / Waterlogging' | 'Multi-Vehicle Pileup' | 'Hazardous Chemical Spill' | 'Structural Barrier Breach';
  severity: IncidentSeverity;
  status: IncidentStatus;
  highwayCode: string;
  highwayName: string;
  state: string;
  district: string;
  kmPost: number;
  timestamp: string;
  affectedLanes: string;
  trafficSpeedDropKmh: number;
  estimatedClearanceMins: number;
  assignedUnit: string;
  verifiedBy: string;
  weatherCondition: string;
  lat: number;
  lng: number;
  timeline: Array<{ time: string; event: string; actor: string }>;
}

export interface TrafficAnomalyAlert {
  id: string;
  title: string;
  highwayCode: string;
  location: string;
  type: 'SUDDEN SPEED DROP' | 'UNUSUAL QUEUE' | 'WRONG-WAY VEHICLE' | 'ABNORMAL STOPPING' | 'LANE CONFLICT' | 'TRAFFIC SPIKE';
  baselineSpeedKmh: number;
  currentSpeedKmh: number;
  severity: 'WARNING' | 'HIGH' | 'CRITICAL';
  detectedTime: string;
  causeInference: string;
  queueLengthKm: number;
}

export interface RoadAssetRecord {
  id: string;
  name: string;
  type: 'Highway Segment' | 'Flyover Bridge' | 'Tunnel Viaduct' | 'Major Intersection' | 'Traffic Signal Controller' | 'High-Mast Streetlight' | 'Crash Barrier' | 'Culvert Drainage' | 'Pedestrian Overbridge';
  highwayCode: string;
  state: string;
  location: string;
  conditionScore: number; // 0 - 100
  accidentRiskScore: number; // 0 - 100 (explicitly separate from condition!)
  lastInspectionDate: string;
  maintenanceStatus: 'Operational' | 'Inspection Due' | 'Maintenance Required' | 'Immediate Action Needed';
  riskContributionPts: number;
  defectCount: number;
  replacementCostLakhs: number;
}

export interface WeatherThreatZone {
  id: string;
  zoneName: string;
  region: string;
  affectedHighways: string[];
  threatType: 'Monsoon Flash Squall' | 'Dense Radiation Fog' | 'Localized Waterlogging' | 'Gale-Force Crosswinds';
  rainIntensityMmHr: number;
  visibilityMeters: number;
  weatherImpactScore: number; // 0 - 100
  floodRisk: 'Negligible' | 'Moderate' | 'Severe' | 'Submerged';
  alternateRouteRecommended: string;
}

// -------------------------------------------------------------
// SEED RECORDS
// -------------------------------------------------------------

export const OPERATIONAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-2026-0941',
    title: 'Multi-Vehicle Rear-End Collision at Curve Apex',
    type: 'Traffic Collision',
    severity: 'CRITICAL',
    status: 'RESPONSE',
    highwayCode: 'NH-44',
    highwayName: 'Salem - Namakkal - Madurai Spine',
    state: 'Tamil Nadu',
    district: 'Namakkal',
    kmPost: 348.4,
    timestamp: '4 min ago (06:24 IST)',
    affectedLanes: '2 of 4 lanes blocked (Southbound)',
    trafficSpeedDropKmh: 48,
    estimatedClearanceMins: 45,
    assignedUnit: 'Tamil Nadu Highway Patrol Unit 14 + ALS Ambulance #04',
    verifiedBy: 'AI Computer Vision Camera #44-TN-118 + Police Control',
    weatherCondition: 'Heavy Monsoon Rain (34 mm/hr) · Vis < 300m',
    lat: 11.2189,
    lng: 78.1674,
    timeline: [
      { time: '06:20 IST', event: 'Automated IoT crash deceleration sensor triggered at KP 348.4', actor: 'ROADGUARD AI Engine' },
      { time: '06:21 IST', event: 'CCTV Camera #44-TN-118 confirmed jackknifed container truck', actor: 'Computer Vision YOLO' },
      { time: '06:22 IST', event: 'Incident verified and upgraded to CRITICAL', actor: 'Duty Traffic Operator' },
      { time: '06:24 IST', event: 'ALS Ambulance & Fire Rescue dispatched from Namakkal Station', actor: 'Emergency Dispatch' }
    ]
  },
  {
    id: 'INC-2026-0940',
    title: 'Container Overturn & Diesel Spill on Ghat Grade',
    type: 'Hazardous Chemical Spill',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    highwayCode: 'NH-48',
    highwayName: 'Mumbai-Pune Expressway (Bhor Ghat)',
    state: 'Maharashtra',
    district: 'Raigad / Pune',
    kmPost: 42.1,
    timestamp: '18 min ago (06:10 IST)',
    affectedLanes: '1 Crawl Lane + Shoulder',
    trafficSpeedDropKmh: 35,
    estimatedClearanceMins: 60,
    assignedUnit: 'IRB Highway Rescue + Maharashtra Traffic Patrol',
    verifiedBy: 'Toll Plaza Anomaly Sensor',
    weatherCondition: 'Dense Valley Fog · Wet Pavement',
    lat: 18.7525,
    lng: 73.4057,
    timeline: [
      { time: '06:10 IST', event: 'Overturned 40ft container lorry reported on descent', actor: 'Citizen SOS Report' },
      { time: '06:14 IST', event: 'Highway Patrol en route to cordoned spill area', actor: 'Maharashtra Police' }
    ]
  },
  {
    id: 'INC-2026-0938',
    title: 'Flash Waterlogging & Aquaplaning Surge',
    type: 'Severe Flooding / Waterlogging',
    severity: 'HIGH',
    status: 'VERIFIED',
    highwayCode: 'NH-16',
    highwayName: 'Coastal Freight Trunk (Vijayawada - Nellore)',
    state: 'Andhra Pradesh',
    district: 'Nellore',
    kmPost: 184.0,
    timestamp: '28 min ago (06:00 IST)',
    affectedLanes: 'Both northbound lanes underwater (0.3m depth)',
    trafficSpeedDropKmh: 55,
    estimatedClearanceMins: 90,
    assignedUnit: 'National Highways Disaster Response Team',
    verifiedBy: 'Water Level Telemetry Sensor #AP-74',
    weatherCondition: 'Cyclone Squall Front · 58 mm/hr Rain',
    lat: 14.4426,
    lng: 79.9865,
    timeline: [
      { time: '06:00 IST', event: 'Culvert drainage overflowed onto carriage road', actor: 'Sensor #AP-74' },
      { time: '06:08 IST', event: 'Traffic diversion routed via Chittoor bypass', actor: 'District Traffic Admin' }
    ]
  },
  {
    id: 'INC-2026-0935',
    title: 'Agricultural Tractor Breakdown in Overtaking Lane',
    type: 'Road Obstruction',
    severity: 'MEDIUM',
    status: 'DETECTED',
    highwayCode: 'NH-44',
    highwayName: 'Yamuna - NH-44 Express Corridor (Mathura)',
    state: 'Uttar Pradesh',
    district: 'Mathura',
    kmPost: 112.6,
    timestamp: '42 min ago (05:46 IST)',
    affectedLanes: 'Right fast lane blocked',
    trafficSpeedDropKmh: 24,
    estimatedClearanceMins: 20,
    assignedUnit: 'Mathura Highway Toll Crane',
    verifiedBy: 'Automated Speed Radar Drop Alert',
    weatherCondition: 'Dense Radiation Smog / Fog (<80m)',
    lat: 27.4924,
    lng: 77.6737,
    timeline: [
      { time: '05:46 IST', event: 'Stationary vehicle detected in 100 km/h expressway lane', actor: 'Radar Anomaly AI' }
    ]
  },
  {
    id: 'INC-2026-0929',
    title: 'Crash Barrier Breach & Vehicle Removal Cleared',
    type: 'Structural Barrier Breach',
    severity: 'LOW',
    status: 'RESOLVED',
    highwayCode: 'NH-48',
    highwayName: 'Golden Quadrilateral (Bengaluru - Krishnagiri)',
    state: 'Karnataka',
    district: 'Hosur Border',
    kmPost: 58.2,
    timestamp: '2 hours ago (04:20 IST)',
    affectedLanes: 'All lanes fully restored',
    trafficSpeedDropKmh: 0,
    estimatedClearanceMins: 0,
    assignedUnit: 'Hosur NHAI Maintenance Crew',
    verifiedBy: 'Field Inspector Inspection Check',
    weatherCondition: 'Overcast · Clear',
    lat: 12.5186,
    lng: 78.2137,
    timeline: [
      { time: '04:20 IST', event: 'W-beam guardrail damaged by car skid', actor: 'Field Patrol' },
      { time: '05:30 IST', event: 'Replacement barrier installed; traffic cleared', actor: 'NHAI Maintenance' }
    ]
  }
];

export const TRAFFIC_ANOMALIES: TrafficAnomalyAlert[] = [
  {
    id: 'ANOM-01',
    title: 'Sudden Speed Collapse (-57%) on NH-44',
    highwayCode: 'NH-44',
    location: 'Namakkal S-Bend (Tamil Nadu)',
    type: 'SUDDEN SPEED DROP',
    baselineSpeedKmh: 72,
    currentSpeedKmh: 31,
    severity: 'CRITICAL',
    detectedTime: '3 min ago',
    causeInference: 'Multi-vehicle collision blocking two southbound lanes under monsoonal rain.',
    queueLengthKm: 4.8
  },
  {
    id: 'ANOM-02',
    title: 'Unusual Queue Spacing on Mumbai-Pune Bhor Ghat',
    highwayCode: 'NH-48',
    location: 'Khandala Viaduct (Maharashtra)',
    type: 'UNUSUAL QUEUE',
    baselineSpeedKmh: 80,
    currentSpeedKmh: 22,
    severity: 'HIGH',
    detectedTime: '12 min ago',
    causeInference: 'Heavy container lorry slow crawl combined with diesel spill cordon.',
    queueLengthKm: 6.2
  },
  {
    id: 'ANOM-03',
    title: 'Wrong-Way Motorcyclist Detected at Flyover Ramp',
    highwayCode: 'NH-48',
    location: 'Sriperumbudur Merge (Tamil Nadu)',
    type: 'WRONG-WAY VEHICLE',
    baselineSpeedKmh: 65,
    currentSpeedKmh: 40,
    severity: 'CRITICAL',
    detectedTime: '18 min ago',
    causeInference: 'Two-wheeler entered fast-lane approach against high-speed traffic flow.',
    queueLengthKm: 0.8
  },
  {
    id: 'ANOM-04',
    title: 'Abrupt Braking Surge at Mathura Toll Merge',
    highwayCode: 'NH-44',
    location: 'Mathura Outer (Uttar Pradesh)',
    type: 'LANE CONFLICT',
    baselineSpeedKmh: 90,
    currentSpeedKmh: 44,
    severity: 'HIGH',
    detectedTime: '24 min ago',
    causeInference: 'Severe fog visibility drop causing erratic lane weaving at toll approach.',
    queueLengthKm: 3.1
  }
];

export const ROAD_ASSETS: RoadAssetRecord[] = [
  {
    id: 'ASSET-TN-0482',
    name: 'High-Mast Sodium Lighting Mast #TN-8842',
    type: 'High-Mast Streetlight',
    highwayCode: 'NH-44',
    state: 'Tamil Nadu',
    location: 'Namakkal S-Curve Km 348',
    conditionScore: 42,
    accidentRiskScore: 78,
    lastInspectionDate: '2026-09-12',
    maintenanceStatus: 'Maintenance Required',
    riskContributionPts: +8,
    defectCount: 3,
    replacementCostLakhs: 2.8
  },
  {
    id: 'ASSET-TN-0112',
    name: 'Namakkal Reverse Curvature Incline Viaduct',
    type: 'Highway Segment',
    highwayCode: 'NH-44',
    state: 'Tamil Nadu',
    location: 'Km 346.0 - 350.2',
    conditionScore: 58,
    accidentRiskScore: 84,
    lastInspectionDate: '2026-08-28',
    maintenanceStatus: 'Immediate Action Needed',
    riskContributionPts: +16,
    defectCount: 7,
    replacementCostLakhs: 48.0
  },
  {
    id: 'ASSET-MH-0921',
    name: 'Khandala Deep Gorge Viaduct Steel Barrier',
    type: 'Crash Barrier',
    highwayCode: 'NH-48',
    state: 'Maharashtra',
    location: 'Bhor Ghat Km 41.5',
    conditionScore: 68,
    accidentRiskScore: 82,
    lastInspectionDate: '2026-09-02',
    maintenanceStatus: 'Inspection Due',
    riskContributionPts: +11,
    defectCount: 2,
    replacementCostLakhs: 14.5
  },
  {
    id: 'ASSET-AP-0344',
    name: 'Pennar River Reinforced Concrete Box Culvert',
    type: 'Culvert Drainage',
    highwayCode: 'NH-16',
    state: 'Andhra Pradesh',
    location: 'Nellore North Km 184',
    conditionScore: 38,
    accidentRiskScore: 74,
    lastInspectionDate: '2026-07-15',
    maintenanceStatus: 'Immediate Action Needed',
    riskContributionPts: +14,
    defectCount: 4,
    replacementCostLakhs: 22.0
  },
  {
    id: 'ASSET-KA-0782',
    name: 'Electronic City Toll Plaza Signal Controller',
    type: 'Traffic Signal Controller',
    highwayCode: 'NH-48',
    state: 'Karnataka',
    location: 'Bengaluru South Km 14',
    conditionScore: 88,
    accidentRiskScore: 48,
    lastInspectionDate: '2026-09-24',
    maintenanceStatus: 'Operational',
    riskContributionPts: +2,
    defectCount: 0,
    replacementCostLakhs: 6.5
  },
  {
    id: 'ASSET-UP-0211',
    name: 'Mathura Flyover Pedestrian Overbridge',
    type: 'Pedestrian Overbridge',
    highwayCode: 'NH-44',
    state: 'Uttar Pradesh',
    location: 'Mathura Km 114',
    conditionScore: 52,
    accidentRiskScore: 68,
    lastInspectionDate: '2026-08-10',
    maintenanceStatus: 'Maintenance Required',
    riskContributionPts: +9,
    defectCount: 3,
    replacementCostLakhs: 32.0
  }
];

export const WEATHER_ZONES: WeatherThreatZone[] = [
  {
    id: 'WZ-01',
    zoneName: 'Western Ghats Monsoon Squall Front',
    region: 'Tamil Nadu & Kerala Inter-Border',
    affectedHighways: ['NH-44', 'NH-66'],
    threatType: 'Monsoon Flash Squall',
    rainIntensityMmHr: 38,
    visibilityMeters: 280,
    weatherImpactScore: 82,
    floodRisk: 'Moderate',
    alternateRouteRecommended: 'Route B via Tiruchirappalli bypass'
  },
  {
    id: 'WZ-02',
    zoneName: 'Indo-Gangetic Radiation Smog Basin',
    region: 'Delhi NCR, Haryana, Western Uttar Pradesh',
    affectedHighways: ['NH-44', 'NH-19'],
    threatType: 'Dense Radiation Fog',
    rainIntensityMmHr: 0,
    visibilityMeters: 65,
    weatherImpactScore: 94,
    floodRisk: 'Negligible',
    alternateRouteRecommended: 'Stagger transit to daylight hours 10:00 - 16:00'
  },
  {
    id: 'WZ-03',
    zoneName: 'Coromandel Coastal Surge Zone',
    region: 'Nellore - Chennai Maritime Belt',
    affectedHighways: ['NH-16'],
    threatType: 'Localized Waterlogging',
    rainIntensityMmHr: 54,
    visibilityMeters: 320,
    weatherImpactScore: 78,
    floodRisk: 'Severe',
    alternateRouteRecommended: 'Inland bypass via Tirupati - Renigunta'
  }
];

export const SYSTEM_NOTIFICATIONS = [
  { id: 'notif-1', severity: 'CRITICAL', title: 'Collision on NH-44 KP 348', time: '4m ago', module: 'INCIDENTS' },
  { id: 'notif-2', severity: 'HIGH', title: 'Severe Fog Alert on Delhi-Agra YE', time: '14m ago', module: 'WEATHER' },
  { id: 'notif-3', severity: 'WARNING', title: 'Pothole Defect #TN-0482 Over Threshold', time: '32m ago', module: 'ROAD ASSETS' },
  { id: 'notif-4', severity: 'INFO', title: 'Daily MoRTH Telemetry Batch Synced', time: '1h ago', module: 'DATA CENTER' }
];
