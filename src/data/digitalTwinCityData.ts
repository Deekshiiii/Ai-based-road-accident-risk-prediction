import { Building3D, Intervention3D, CausalNode, IncidentReplayFrame, PlannerInvestmentOption, EmergencyRoutePlan, Point3D } from '../types/accident';

// 3D City Buildings Definition (Isometric coordinates in a 1200x800 world space)
export const DIGITAL_TWIN_BUILDINGS: Building3D[] = [
  // Landmark Hospital (Level 1 Trauma Center with Rooftop Helipad)
  {
    id: 'BLD-HOSPITAL',
    name: 'Apollo Metropolitan Trauma Center',
    x: 480,
    y: 160,
    width: 90,
    depth: 70,
    height: 95,
    type: 'hospital',
    color: '#1E293B',
    roofColor: '#334155',
    hasHelipad: true
  },
  // Police HQ
  {
    id: 'BLD-POLICE',
    name: 'Central Traffic Command & Police HQ',
    x: 210,
    y: 190,
    width: 65,
    depth: 55,
    height: 75,
    type: 'police',
    color: '#1E293B',
    roofColor: '#2563EB'
  },
  // Fire Station
  {
    id: 'BLD-FIRE',
    name: 'Metro Rescue & Fire Station 04',
    x: 740,
    y: 380,
    width: 60,
    depth: 50,
    height: 60,
    type: 'fire_station',
    color: '#1E293B',
    roofColor: '#DC2626'
  },
  // Downtown Financial & Tech Towers (Varying heights, glass facades)
  {
    id: 'BLD-TOWER-1',
    name: 'Quantum Tech Tower (52 Floors)',
    x: 350,
    y: 110,
    width: 55,
    depth: 55,
    height: 190,
    type: 'skyscraper',
    color: '#0F172A',
    roofColor: '#1E293B'
  },
  {
    id: 'BLD-TOWER-2',
    name: 'Metropolitan Financial Spire',
    x: 420,
    y: 90,
    width: 65,
    depth: 55,
    height: 230,
    type: 'skyscraper',
    color: '#0F172A',
    roofColor: '#1E293B'
  },
  {
    id: 'BLD-TOWER-3',
    name: 'Cyber Horizon Center',
    x: 580,
    y: 120,
    width: 60,
    depth: 60,
    height: 160,
    type: 'skyscraper',
    color: '#0F172A',
    roofColor: '#1E293B'
  },
  // Commercial Blocks along Central Expressway
  {
    id: 'BLD-COMM-1',
    name: 'Grand City Mall & Transit Hub',
    x: 280,
    y: 320,
    width: 80,
    depth: 65,
    height: 80,
    type: 'commercial',
    color: '#1E293B',
    roofColor: '#334155'
  },
  {
    id: 'BLD-COMM-2',
    name: 'Logistics Warehousing Hub',
    x: 140,
    y: 290,
    width: 95,
    depth: 70,
    height: 50,
    type: 'commercial',
    color: '#1E293B',
    roofColor: '#334155'
  },
  {
    id: 'BLD-COMM-3',
    name: 'East Bay Tech Park',
    x: 760,
    y: 180,
    width: 85,
    depth: 65,
    height: 110,
    type: 'commercial',
    color: '#1E293B',
    roofColor: '#334155'
  },
  // Residential Complexes
  {
    id: 'BLD-RES-1',
    name: 'Emerald Heights Residences A',
    x: 180,
    y: 440,
    width: 55,
    depth: 50,
    height: 110,
    type: 'residential',
    color: '#1E293B',
    roofColor: '#334155'
  },
  {
    id: 'BLD-RES-2',
    name: 'Emerald Heights Residences B',
    x: 250,
    y: 460,
    width: 55,
    depth: 50,
    height: 125,
    type: 'residential',
    color: '#1E293B',
    roofColor: '#334155'
  },
  {
    id: 'BLD-RES-3',
    name: 'Southern Gateway Condominiums',
    x: 520,
    y: 460,
    width: 70,
    depth: 55,
    height: 95,
    type: 'residential',
    color: '#1E293B',
    roofColor: '#334155'
  },
  {
    id: 'BLD-RES-4',
    name: 'Coastline Marina Villas',
    x: 880,
    y: 410,
    width: 65,
    depth: 55,
    height: 70,
    type: 'residential',
    color: '#1E293B',
    roofColor: '#334155'
  }
];

// 3D Isometric Road Waypoints (x, y, elevation/z, isFlyover, isBridge)
export interface Road3DGeometry {
  id: string;
  name: string;
  corridor: string;
  lanes: number;
  speedLimit: number;
  points: Point3D[];
  isFlyover?: boolean;
  isBridge?: boolean;
  hasTrafficLights?: boolean;
  baseRiskScore: number;
}

export const DIGITAL_TWIN_ROADS: Road3DGeometry[] = [
  {
    id: 'R-204',
    name: 'Metropolitan Central Expressway (Flyover Tier)',
    corridor: 'Spine Corridor',
    lanes: 6,
    speedLimit: 80,
    isFlyover: true,
    hasTrafficLights: false,
    baseRiskScore: 82,
    points: [
      { x: 180, y: 260, z: 22 },
      { x: 380, y: 250, z: 28 },
      { x: 500, y: 245, z: 28 },
      { x: 680, y: 240, z: 24 }
    ]
  },
  {
    id: 'R-102',
    name: 'GST Highway - Southern S-Curve',
    corridor: 'South Arterial',
    lanes: 4,
    speedLimit: 60,
    isFlyover: false,
    hasTrafficLights: true,
    baseRiskScore: 76,
    points: [
      { x: 680, y: 240, z: 0 },
      { x: 740, y: 310, z: 0 },
      { x: 790, y: 400, z: 0 },
      { x: 880, y: 470, z: 0 }
    ]
  },
  {
    id: 'R-101',
    name: 'Kathipara Multi-Grade Grade Separator',
    corridor: 'Spine Interchange',
    lanes: 6,
    speedLimit: 70,
    isFlyover: true,
    hasTrafficLights: true,
    baseRiskScore: 84,
    points: [
      { x: 450, y: 130, z: 0 },
      { x: 470, y: 230, z: 18 },
      { x: 480, y: 340, z: 14 },
      { x: 490, y: 480, z: 0 }
    ]
  },
  {
    id: 'R-103',
    name: 'OMR Tech Corridor - Sholinganallur Express',
    corridor: 'Eastern Tech Corridor',
    lanes: 6,
    speedLimit: 70,
    isFlyover: false,
    hasTrafficLights: true,
    baseRiskScore: 68,
    points: [
      { x: 490, y: 480, z: 0 },
      { x: 620, y: 490, z: 0 },
      { x: 760, y: 510, z: 0 },
      { x: 880, y: 520, z: 0 }
    ]
  },
  {
    id: 'R-118',
    name: 'Maduravoyal Freight Bypass Ring',
    corridor: 'West Logistics Ring',
    lanes: 4,
    speedLimit: 80,
    isFlyover: false,
    hasTrafficLights: false,
    baseRiskScore: 74,
    points: [
      { x: 100, y: 160, z: 0 },
      { x: 140, y: 220, z: 0 },
      { x: 180, y: 260, z: 0 },
      { x: 230, y: 360, z: 0 }
    ]
  },
  {
    id: 'R-106',
    name: 'Akkarai Maritime Coast Highway (Bridge Over Creek)',
    corridor: 'Coastal Bay Link',
    lanes: 4,
    speedLimit: 65,
    isBridge: true,
    hasTrafficLights: false,
    baseRiskScore: 78,
    points: [
      { x: 880, y: 520, z: 0 },
      { x: 940, y: 420, z: 12 },
      { x: 960, y: 310, z: 12 },
      { x: 940, y: 210, z: 0 }
    ]
  },
  {
    id: 'R-105',
    name: 'Guindy - Velachery Commercial Link',
    corridor: 'Midtown Connector',
    lanes: 4,
    speedLimit: 50,
    isFlyover: false,
    hasTrafficLights: true,
    baseRiskScore: 48,
    points: [
      { x: 340, y: 460, z: 0 },
      { x: 410, y: 470, z: 0 },
      { x: 490, y: 480, z: 0 }
    ]
  },
  {
    id: 'R-107',
    name: 'North-East Commercial Boulevard',
    corridor: 'Airport Ring',
    lanes: 4,
    speedLimit: 50,
    isFlyover: false,
    hasTrafficLights: true,
    baseRiskScore: 52,
    points: [
      { x: 470, y: 230, z: 0 },
      { x: 570, y: 190, z: 0 },
      { x: 670, y: 160, z: 0 }
    ]
  }
];

// Interactive Causal Chain Steps for selected road
export const CAUSAL_CHAINS: Record<string, CausalNode[]> = {
  'R-204': [
    { id: 'c1', label: 'HEAVY RAINFALL', description: 'Monsoon precipitation > 24mm/h', value: '28mm/h', impactScore: 22, category: 'weather' },
    { id: 'c2', label: 'LOW VISIBILITY', description: 'Twilight fog + windshield glare', value: '2.4 km', impactScore: 18, category: 'visibility' },
    { id: 'c3', label: 'BRAKING DISTANCE ↑', description: 'Pavement water film lowers friction to 0.28', value: '+42% dist', impactScore: 24, category: 'infrastructure' },
    { id: 'c4', label: 'TRAFFIC SURGE', description: 'Peak evening commuter density approaching capacity', value: '2,840 vph', impactScore: 16, category: 'traffic' },
    { id: 'c5', label: 'RAMP WEAVING CONFLICT', description: 'High differential speed between merging lanes', value: '+3.4σ var', impactScore: 20, category: 'infrastructure' },
    { id: 'c6', label: 'ACCIDENT RISK CRITICAL', description: 'Compound probability threshold exceeded', value: '82 / 100', impactScore: 35, category: 'risk' }
  ],
  'R-102': [
    { id: 'c1', label: 'SHARP REVERSE CURVATURE', description: 'Blind radius curve on GST approach', value: 'R=120m', impactScore: 25, category: 'infrastructure' },
    { id: 'c2', label: 'SPEEDING TRUCKS', description: 'Commercial vehicles exceeding 60 km/h limit', value: '78 km/h', impactScore: 22, category: 'traffic' },
    { id: 'c3', label: 'LANE ENCROACHMENT', description: 'Heavy axle vehicles overshooting center line', value: '+1.8m dev', impactScore: 19, category: 'infrastructure' },
    { id: 'c4', label: 'UNLIT S-BEND', description: 'Street luminaire failure over 350m span', value: '6 Lux', impactScore: 18, category: 'visibility' },
    { id: 'c5', label: 'ACCIDENT RISK HIGH', description: 'Recurrent severe collision cluster', value: '76 / 100', impactScore: 30, category: 'risk' }
  ],
  'default': [
    { id: 'c1', label: 'PEAK COMMUTE DENSITY', description: 'Volume-to-capacity saturation ratio > 0.88', value: 'V/C 0.91', impactScore: 20, category: 'traffic' },
    { id: 'c2', label: 'INTERSECTION BACKUP', description: 'Queuing spillover onto arterial entry', value: '450m queue', impactScore: 16, category: 'infrastructure' },
    { id: 'c3', label: 'ELEVATED BRAKING VARIANCE', description: 'Frequent stop-and-go shockwaves', value: 'G-Force 0.4g', impactScore: 18, category: 'traffic' },
    { id: 'c4', label: 'ACCIDENT RISK ELEVATED', description: 'Rear-end collision risk elevated', value: '64 / 100', impactScore: 25, category: 'risk' }
  ]
};

// 3D Interventions for Prevention Mode
export const PREVENTION_INTERVENTIONS: Intervention3D[] = [
  {
    id: 'INT-01',
    roadId: 'R-204',
    type: 'lighting',
    title: 'Smart Adaptive LED Luminaires',
    description: 'Install 48 high-lux smart dimming luminaires to eliminate nocturnal blind spots along flyover approach.',
    riskReductionPct: 14,
    cost: 45000,
    priority: 'HIGH',
    active: false,
    icon: '💡',
    locationLabel: 'R-204 Central Flyover'
  },
  {
    id: 'INT-02',
    roadId: 'R-204',
    type: 'resurface',
    title: 'High-Friction Anti-Skid Polymer Surfacing',
    description: 'Apply epoxy-bauxite aggregate to restore friction coefficient from 0.28 to 0.72 in wet conditions.',
    riskReductionPct: 16,
    cost: 120000,
    priority: 'HIGH',
    active: false,
    icon: '🚧',
    locationLabel: 'R-204 Weave Zone'
  },
  {
    id: 'INT-03',
    roadId: 'R-102',
    type: 'police_radar',
    title: 'Automated Speed Radar & Interceptor Patrol',
    description: 'Deploy dual radar cameras linked to digital signage to enforce 60 km/h speed limit around the S-curve.',
    riskReductionPct: 18,
    cost: 65000,
    priority: 'HIGH',
    active: false,
    icon: '👮',
    locationLabel: 'R-102 S-Curve Approach'
  },
  {
    id: 'INT-04',
    roadId: 'R-101',
    type: 'signals',
    title: 'AI Adaptive Signal Flow Coordination',
    description: 'Dynamic green-wave timing adjustment based on real-time queue length to prevent grade separator gridlock.',
    riskReductionPct: 12,
    cost: 55000,
    priority: 'MEDIUM',
    active: false,
    icon: '🚦',
    locationLabel: 'R-101 Kathipara Cloverleaf'
  },
  {
    id: 'INT-05',
    roadId: 'R-106',
    type: 'signage',
    title: 'Dynamic Fog & Hydroplane VMS Warning Signs',
    description: 'Variable Message Signs alerting drivers to sea mist friction loss and automated reduced advisory speeds.',
    riskReductionPct: 11,
    cost: 38000,
    priority: 'MEDIUM',
    active: false,
    icon: '⚠️',
    locationLabel: 'R-106 Coastal Bridge'
  },
  {
    id: 'INT-06',
    roadId: 'R-118',
    type: 'ambulance_post',
    title: 'Pre-Positioned Paramedic Rapid Response Station',
    description: 'Station designated trauma motorcycle unit cutting golden-hour response time from 16m to 4m.',
    riskReductionPct: 9,
    cost: 85000,
    priority: 'HIGH',
    active: false,
    icon: '🚑',
    locationLabel: 'R-118 Logistics Bypass'
  }
];

// Historical Incident Replay Scenario
export const INCIDENT_REPLAY_DATA: IncidentReplayFrame[] = [
  {
    phase: 'BEFORE',
    time: '19:15:00',
    trafficDensityPct: 62,
    weatherState: 'Light Overcast, Dry Asphalt',
    roadFrictionCoeff: 0.68,
    riskScore: 48,
    eventDescription: 'Traffic flow is steady at 65 km/h. Pavement is dry and street illumination is fully functional.',
    telemetry: {
      leadVehicleSpeed: 64,
      trailingVehicleSpeed: 66,
      headwayMeters: 42,
      brakingForceG: 0.05
    }
  },
  {
    phase: 'RISK BUILDUP',
    time: '19:28:30',
    trafficDensityPct: 88,
    weatherState: 'Sudden Monsoon Downpour (32mm/h)',
    roadFrictionCoeff: 0.32,
    riskScore: 78,
    eventDescription: 'Sudden torrential rainfall causes standing water sheets. Headway shrinks to 14 meters as vehicles bunch near flyover merge.',
    telemetry: {
      leadVehicleSpeed: 58,
      trailingVehicleSpeed: 72,
      headwayMeters: 14,
      brakingForceG: 0.22
    }
  },
  {
    phase: 'INCIDENT',
    time: '19:31:12',
    trafficDensityPct: 96,
    weatherState: 'Severe Rain + Windshield Glare',
    roadFrictionCoeff: 0.26,
    riskScore: 94,
    eventDescription: 'Commercial truck hydroplanes upon emergency braking; trailing sedan experiences anti-lock failure, resulting in multi-vehicle side collision.',
    telemetry: {
      leadVehicleSpeed: 20,
      trailingVehicleSpeed: 68,
      headwayMeters: 2,
      brakingForceG: 0.85
    }
  },
  {
    phase: 'AFTERMATH',
    time: '19:35:40',
    trafficDensityPct: 99,
    weatherState: 'Heavy Rain Continues',
    roadFrictionCoeff: 0.28,
    riskScore: 89,
    eventDescription: 'Automated collision alert detected by ROADGUARD AI. Emergency trauma dispatch initiated from Apollo Hospital; alternate corridor opened.',
    telemetry: {
      leadVehicleSpeed: 0,
      trailingVehicleSpeed: 0,
      headwayMeters: 0,
      brakingForceG: 0.0
    }
  }
];

// Urban Planner Challenge Investment Catalog
export const PLANNER_CHALLENGE_CATALOG: PlannerInvestmentOption[] = [
  {
    id: 'OPT-1',
    category: 'Smart Lighting',
    cost: 150000,
    targetRoadId: 'R-204',
    roadName: 'Metropolitan Central Expressway',
    expectedRiskReduction: 14,
    annualAccidentsAvoided: 18,
    purchased: false
  },
  {
    id: 'OPT-2',
    category: 'Friction Resurfacing',
    cost: 320000,
    targetRoadId: 'R-204',
    roadName: 'Metropolitan Central Expressway',
    expectedRiskReduction: 16,
    annualAccidentsAvoided: 24,
    purchased: false
  },
  {
    id: 'OPT-3',
    category: 'Automated Speed Radar',
    cost: 180000,
    targetRoadId: 'R-102',
    roadName: 'GST Highway S-Curve',
    expectedRiskReduction: 18,
    annualAccidentsAvoided: 22,
    purchased: false
  },
  {
    id: 'OPT-4',
    category: 'Adaptive Signals',
    cost: 210000,
    targetRoadId: 'R-101',
    roadName: 'Kathipara Cloverleaf',
    expectedRiskReduction: 12,
    annualAccidentsAvoided: 15,
    purchased: false
  },
  {
    id: 'OPT-5',
    category: 'Smart Lighting',
    cost: 140000,
    targetRoadId: 'R-102',
    roadName: 'GST Highway S-Curve',
    expectedRiskReduction: 11,
    annualAccidentsAvoided: 12,
    purchased: false
  },
  {
    id: 'OPT-6',
    category: 'Paramedic Depots',
    cost: 280000,
    targetRoadId: 'R-118',
    roadName: 'Maduravoyal Freight Bypass',
    expectedRiskReduction: 15,
    annualAccidentsAvoided: 20,
    purchased: false
  },
  {
    id: 'OPT-7',
    category: 'Adaptive Signals',
    cost: 190000,
    targetRoadId: 'R-103',
    roadName: 'OMR Tech Corridor',
    expectedRiskReduction: 10,
    annualAccidentsAvoided: 14,
    purchased: false
  },
  {
    id: 'OPT-8',
    category: 'Friction Resurfacing',
    cost: 290000,
    targetRoadId: 'R-106',
    roadName: 'Akkarai Maritime Coast Highway',
    expectedRiskReduction: 17,
    annualAccidentsAvoided: 19,
    purchased: false
  }
];
