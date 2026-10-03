// Comprehensive Geographic & Road Safety Dataset for India Digital Twin
// Data Sources: Ministry of Road Transport and Highways (MoRTH) Open Government Data (data.gov.in),
// OpenStreetMap National Highway Network, Open-Meteo Weather Grids.

export interface IndianState {
  id: string;
  name: string;
  code: string;
  center: { x: number; y: number; lat: number; lng: number };
  riskIndex: number; // 0-100
  annualAccidents: number;
  annualFatalities: number;
  highRiskCorridorCount: number;
  primaryHighway: string;
  weatherCondition: 'Clear' | 'Monsoon Rain' | 'Dense Fog' | 'Humid Overcast';
  polygon: Array<{ x: number; y: number }>;
}

export interface HighwayCorridor {
  id: string;
  name: string;
  code: string; // e.g. NH-44, NH-48
  origin: string;
  destination: string;
  totalLengthKm: number;
  state: string;
  region: string;
  riskScore: number; // 0-100
  riskCategory: 'Safe' | 'Moderate' | 'High' | 'Critical';
  confidenceScore: number; // e.g. 89%
  trafficDensityScore: number; // 0-100
  accidentHistoryScore: number;
  roadConditionScore: number; // 0-100 (higher = worse/degraded)
  weatherImpactScore: number;
  visibilityScore: number; // 0-100 (higher = worse photopic visibility)
  geometryRiskScore: number;
  lanes: number;
  speedLimitKmh: number;
  annualFatalities: number;
  peakRiskWindow: string;
  isBlackspot: boolean;
  nearMissRatePerMonth: number;
  waypoints: Array<{ x: number; y: number; lat: number; lng: number; label?: string }>;
  causalChain: {
    trigger: string;
    factor1: string;
    factor2: string;
    intermediate: string;
    consequence: string;
  };
  recommendations: Array<{
    action: string;
    expectedReductionPct: number;
    priority: 'Immediate' | 'High' | 'Medium';
    costEstimateLakhs: number;
  }>;
}

export interface MetroHub {
  id: string;
  name: string;
  state: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  populationM: number;
  congestionIndex: number;
  activeRiskScore: number;
  connectedHighways: string[];
}

export interface BlackspotCluster {
  id: string;
  name: string;
  highwayCode: string;
  state: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  severityIndex: number;
  fatalitiesPast3Years: number;
  clusterRadiusMeters: number;
  algorithm: 'DBSCAN Cluster (eps=250m, minPts=8)' | 'Spatial KDE' | 'Isolation Forest Anomaly';
  primaryCause: string;
  peakTime: string;
  counterfactualIntervention: string;
  riskReductionEstimatePct: number;
}

export interface EmergencyAsset {
  id: string;
  name: string;
  type: 'Trauma Hospital' | 'Highway Police Patrol' | 'Fire Rescue' | 'ALS Ambulance Station';
  x: number;
  y: number;
  lat: number;
  lng: number;
  nearHighway: string;
  availableUnits: number;
  avgResponseMins: number;
}

// -------------------------------------------------------------
// Scaled Coordinates for India Vector Map (Base canvas 1000 x 1100)
// Coordinate bounds approx: Lat 8°N to 36°N, Lng 68°E to 98°E
// -------------------------------------------------------------

export const INDIA_COASTLINE_CONTOUR: Array<{ x: number; y: number }> = [
  // North / Kashmir apex
  { x: 380, y: 70 },
  { x: 420, y: 90 },
  { x: 440, y: 130 },
  // Ladakh / Himachal
  { x: 490, y: 160 },
  { x: 470, y: 220 },
  { x: 520, y: 260 }, // Uttarakhand
  { x: 590, y: 310 }, // Nepal border northern arc
  { x: 670, y: 350 }, // Sikkim
  { x: 740, y: 320 }, // Bhutan / Arunachal
  { x: 840, y: 330 },
  { x: 890, y: 370 }, // Easternmost bend
  { x: 850, y: 440 }, // Nagaland / Manipur
  { x: 800, y: 490 }, // Mizoram / Tripura
  { x: 730, y: 460 }, // Meghalaya
  { x: 690, y: 470 }, // Bengal / Sundarbans
  { x: 670, y: 530 }, // Odisha northern coast
  { x: 630, y: 600 }, // Paradip / Puri coast
  { x: 570, y: 680 }, // Visakhapatnam
  { x: 530, y: 740 }, // Andhra Pradesh Coromandel
  { x: 500, y: 810 }, // Chennai coastal bay
  { x: 480, y: 880 }, // Pondicherry / Tamil Nadu coast
  { x: 470, y: 940 }, // Palk Strait / Rameswaram
  { x: 440, y: 990 }, // Kanyakumari (Southernmost tip)
  { x: 410, y: 950 }, // Thiruvananthapuram / Kerala
  { x: 380, y: 880 }, // Kochi / Malabar coast
  { x: 370, y: 800 }, // Mangaluru / Karnataka coast
  { x: 360, y: 740 }, // Goa
  { x: 340, y: 670 }, // Konkan coast / Mumbai
  { x: 300, y: 620 }, // Gujarat Gulf of Khambhat
  { x: 230, y: 610 }, // Saurashtra / Gir
  { x: 190, y: 580 }, // Porbandar / Dwarka
  { x: 220, y: 520 }, // Gulf of Kutch
  { x: 250, y: 470 }, // Rann of Kutch / Pakistan border
  { x: 280, y: 400 }, // Rajasthan Thar West
  { x: 310, y: 330 }, // Punjab border
  { x: 340, y: 260 }, // Jammu border
  { x: 360, y: 170 }, // LoC
  { x: 380, y: 70 }   // Back to apex
];

// Major Indian States with polygon boundaries and accident statistics
export const INDIAN_STATES: IndianState[] = [
  {
    id: 'TN',
    name: 'Tamil Nadu',
    code: 'TN',
    center: { x: 450, y: 870, lat: 11.1271, lng: 78.6569 },
    riskIndex: 78,
    annualAccidents: 64105,
    annualFatalities: 17884,
    highRiskCorridorCount: 14,
    primaryHighway: 'NH-44 (Salem - Madurai)',
    weatherCondition: 'Monsoon Rain',
    polygon: [
      { x: 400, y: 830 },
      { x: 490, y: 810 },
      { x: 470, y: 940 },
      { x: 440, y: 990 },
      { x: 410, y: 930 },
      { x: 400, y: 860 }
    ]
  },
  {
    id: 'KA',
    name: 'Karnataka',
    code: 'KA',
    center: { x: 390, y: 760, lat: 15.3173, lng: 75.7139 },
    riskIndex: 68,
    annualAccidents: 39762,
    annualFatalities: 11702,
    highRiskCorridorCount: 9,
    primaryHighway: 'NH-48 (Bengaluru - Belagavi)',
    weatherCondition: 'Clear',
    polygon: [
      { x: 360, y: 710 },
      { x: 430, y: 710 },
      { x: 440, y: 800 },
      { x: 400, y: 830 },
      { x: 370, y: 800 },
      { x: 360, y: 740 }
    ]
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    code: 'MH',
    center: { x: 390, y: 610, lat: 19.7515, lng: 75.7139 },
    riskIndex: 74,
    annualAccidents: 33383,
    annualFatalities: 15224,
    highRiskCorridorCount: 12,
    primaryHighway: 'Mumbai-Pune Expressway & NH-48',
    weatherCondition: 'Monsoon Rain',
    polygon: [
      { x: 320, y: 580 },
      { x: 450, y: 550 },
      { x: 500, y: 600 },
      { x: 440, y: 680 },
      { x: 360, y: 700 },
      { x: 340, y: 650 }
    ]
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    code: 'UP',
    center: { x: 480, y: 390, lat: 26.8467, lng: 80.9462 },
    riskIndex: 82,
    annualAccidents: 37729,
    annualFatalities: 22595, // Highest in India
    highRiskCorridorCount: 18,
    primaryHighway: 'NH-19 & Yamuna Expressway',
    weatherCondition: 'Dense Fog',
    polygon: [
      { x: 410, y: 340 },
      { x: 530, y: 330 },
      { x: 580, y: 400 },
      { x: 520, y: 440 },
      { x: 440, y: 430 },
      { x: 420, y: 380 }
    ]
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    code: 'RJ',
    center: { x: 350, y: 400, lat: 27.0238, lng: 74.2179 },
    riskIndex: 65,
    annualAccidents: 23614,
    annualFatalities: 11103,
    highRiskCorridorCount: 7,
    primaryHighway: 'NH-48 (Jaipur - Udaipur)',
    weatherCondition: 'Clear',
    polygon: [
      { x: 290, y: 350 },
      { x: 390, y: 340 },
      { x: 410, y: 430 },
      { x: 350, y: 480 },
      { x: 290, y: 430 }
    ]
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    code: 'GJ',
    center: { x: 270, y: 520, lat: 22.2587, lng: 71.1924 },
    riskIndex: 58,
    annualAccidents: 15200,
    annualFatalities: 7457,
    highRiskCorridorCount: 5,
    primaryHighway: 'NE-1 & NH-48 (Ahmedabad - Surat)',
    weatherCondition: 'Clear',
    polygon: [
      { x: 220, y: 500 },
      { x: 310, y: 470 },
      { x: 330, y: 550 },
      { x: 300, y: 600 },
      { x: 230, y: 600 },
      { x: 190, y: 560 }
    ]
  },
  {
    id: 'KL',
    name: 'Kerala',
    code: 'KL',
    center: { x: 410, y: 910, lat: 10.8505, lng: 76.2711 },
    riskIndex: 71,
    annualAccidents: 43910,
    annualFatalities: 4317,
    highRiskCorridorCount: 8,
    primaryHighway: 'NH-66 (Kasaragod - Kochi)',
    weatherCondition: 'Monsoon Rain',
    polygon: [
      { x: 380, y: 860 },
      { x: 410, y: 880 },
      { x: 430, y: 960 },
      { x: 410, y: 980 },
      { x: 380, y: 910 }
    ]
  },
  {
    id: 'WB',
    name: 'West Bengal',
    code: 'WB',
    center: { x: 660, y: 460, lat: 22.9868, lng: 87.8550 },
    riskIndex: 64,
    annualAccidents: 13240,
    annualFatalities: 5800,
    highRiskCorridorCount: 6,
    primaryHighway: 'NH-16 & NH-19 (Kolkata - Durgapur)',
    weatherCondition: 'Humid Overcast',
    polygon: [
      { x: 630, y: 420 },
      { x: 680, y: 420 },
      { x: 700, y: 500 },
      { x: 660, y: 520 },
      { x: 630, y: 470 }
    ]
  },
  {
    id: 'DL',
    name: 'Delhi NCR',
    code: 'DL',
    center: { x: 410, y: 330, lat: 28.7041, lng: 77.1025 },
    riskIndex: 79,
    annualAccidents: 5652,
    annualFatalities: 1461,
    highRiskCorridorCount: 11,
    primaryHighway: 'Eastern Peripheral & Ring Road',
    weatherCondition: 'Dense Fog',
    polygon: [
      { x: 400, y: 320 },
      { x: 420, y: 320 },
      { x: 425, y: 340 },
      { x: 405, y: 340 }
    ]
  },
  {
    id: 'TG',
    name: 'Telangana',
    code: 'TG',
    center: { x: 460, y: 660, lat: 18.1124, lng: 79.0193 },
    riskIndex: 69,
    annualAccidents: 21619,
    annualFatalities: 7440,
    highRiskCorridorCount: 8,
    primaryHighway: 'NH-44 & ORR Hyderabad',
    weatherCondition: 'Clear',
    polygon: [
      { x: 420, y: 630 },
      { x: 480, y: 620 },
      { x: 500, y: 690 },
      { x: 440, y: 700 }
    ]
  }
];

// National Highways and Strategic Expressways across India
export const HIGHWAY_CORRIDORS: HighwayCorridor[] = [
  {
    id: 'NH-44-TN',
    name: 'NH-44 Southern Expressway Spine (Salem - Namakkal - Madurai)',
    code: 'NH-44',
    origin: 'Salem Junction',
    destination: 'Madurai Bypass',
    totalLengthKm: 218,
    state: 'Tamil Nadu',
    region: 'South India Hub',
    riskScore: 78,
    riskCategory: 'High',
    confidenceScore: 89,
    trafficDensityScore: 86,
    accidentHistoryScore: 82,
    roadConditionScore: 68,
    weatherImpactScore: 71,
    visibilityScore: 62,
    geometryRiskScore: 54,
    lanes: 4,
    speedLimitKmh: 90,
    annualFatalities: 184,
    peakRiskWindow: '18:00 – 22:00 (Evening Monsoonal Commute)',
    isBlackspot: true,
    nearMissRatePerMonth: 64,
    waypoints: [
      { x: 450, y: 850, lat: 11.6643, lng: 78.1460, label: 'Salem Junction' },
      { x: 445, y: 885, lat: 10.7905, lng: 78.7047, label: 'Namakkal S-Bend' },
      { x: 442, y: 920, lat: 9.9252, lng: 78.1198, label: 'Madurai Ring Road' }
    ],
    causalChain: {
      trigger: 'Heavy Monsoon Rain',
      factor1: 'Visibility reduced to < 350m',
      factor2: 'Braking distance increased by 42%',
      intermediate: 'Freight truck saturation & abrupt deceleration',
      consequence: 'Rear-end collisions and multi-vehicle pileups at curve apex'
    },
    recommendations: [
      { action: 'Install High-Mast LED Lighting & Optical Guidance Studs', expectedReductionPct: 8, priority: 'Immediate', costEstimateLakhs: 14.5 },
      { action: 'Deploy Automated Speed & Lane-Violation Radar Enforcers', expectedReductionPct: 11, priority: 'Immediate', costEstimateLakhs: 22.0 },
      { action: 'Porous Micro-Surfacing for Hydroplaning Mitigation', expectedReductionPct: 7, priority: 'High', costEstimateLakhs: 48.0 },
      { action: 'Dynamic VMS Warning Signage with Real-Time Rain Alerts', expectedReductionPct: 4, priority: 'Medium', costEstimateLakhs: 12.0 },
      { action: 'Redesign Namakkal Blind Curve Incline & Superelevation', expectedReductionPct: 9, priority: 'High', costEstimateLakhs: 85.0 }
    ]
  },
  {
    id: 'NH-48-MUM-PUN',
    name: 'Mumbai-Pune Expressway & Bhor Ghat Section',
    code: 'NH-48 / MPEW',
    origin: 'Navi Mumbai Kalamboli',
    destination: 'Pune Kiwale',
    totalLengthKm: 94.5,
    state: 'Maharashtra',
    region: 'Western Ghats',
    riskScore: 84,
    riskCategory: 'Critical',
    confidenceScore: 92,
    trafficDensityScore: 91,
    accidentHistoryScore: 88,
    roadConditionScore: 74,
    weatherImpactScore: 86,
    visibilityScore: 78,
    geometryRiskScore: 82,
    lanes: 6,
    speedLimitKmh: 100,
    annualFatalities: 152,
    peakRiskWindow: '21:00 – 04:00 (Heavy Freight Night Transit)',
    isBlackspot: true,
    nearMissRatePerMonth: 82,
    waypoints: [
      { x: 340, y: 650, lat: 19.0330, lng: 73.0297, label: 'Navi Mumbai' },
      { x: 355, y: 665, lat: 18.7525, lng: 73.4057, label: 'Bhor Ghat S-Curves' },
      { x: 370, y: 675, lat: 18.5204, lng: 73.8567, label: 'Pune Kiwale' }
    ],
    causalChain: {
      trigger: 'Dense Fog & Steep Ghat Incline',
      factor1: 'Brake failure on downhill grade',
      factor2: 'Heavy container trucks overtaking in fast lane',
      intermediate: 'Blind crest curve bottlenecking traffic',
      consequence: 'High-speed underride crashes into stationary vehicles'
    },
    recommendations: [
      { action: 'Mandatory Dedicated Heavy-Vehicle Crawl Lane', expectedReductionPct: 14, priority: 'Immediate', costEstimateLakhs: 35.0 },
      { action: 'Thermal Fog Penetration Beacons & Variable Speed Limits', expectedReductionPct: 9, priority: 'Immediate', costEstimateLakhs: 28.0 },
      { action: 'Emergency Escape Ramp with Deep Gravel Arrester Beds', expectedReductionPct: 12, priority: 'High', costEstimateLakhs: 65.0 }
    ]
  },
  {
    id: 'NH-44-DEL-AGR',
    name: 'Yamuna - NH-44 Express Corridor (Delhi NCR - Agra)',
    code: 'NH-44 / YE',
    origin: 'Delhi Badarpur',
    destination: 'Agra Bypass',
    totalLengthKm: 205,
    state: 'Uttar Pradesh',
    region: 'Indo-Gangetic Plain',
    riskScore: 81,
    riskCategory: 'Critical',
    confidenceScore: 91,
    trafficDensityScore: 84,
    accidentHistoryScore: 89,
    roadConditionScore: 52,
    weatherImpactScore: 94, // Severe winter fog
    visibilityScore: 95,
    geometryRiskScore: 32,
    lanes: 6,
    speedLimitKmh: 100,
    annualFatalities: 240,
    peakRiskWindow: '04:00 – 08:00 (Winter Radiation Fog)',
    isBlackspot: true,
    nearMissRatePerMonth: 76,
    waypoints: [
      { x: 410, y: 335, lat: 28.6139, lng: 77.2090, label: 'Delhi NCR' },
      { x: 430, y: 360, lat: 27.8974, lng: 77.6737, label: 'Mathura Stretch' },
      { x: 450, y: 385, lat: 27.1767, lng: 78.0081, label: 'Agra Ring Road' }
    ],
    causalChain: {
      trigger: 'Near-Zero Radiation Smog / Fog (<50m)',
      factor1: 'High-speed cruising without radar awareness',
      factor2: 'Unlit agricultural tractors merging from service roads',
      intermediate: 'Sudden obstacle braking cascade',
      consequence: '20+ vehicle pileups during dawn hours'
    },
    recommendations: [
      { action: 'Automated Fog-Speed Reduction System with Flashing Strobes', expectedReductionPct: 16, priority: 'Immediate', costEstimateLakhs: 42.0 },
      { action: 'Rumble Strips & Retro-Reflective Raised Pavement Markers', expectedReductionPct: 7, priority: 'Immediate', costEstimateLakhs: 18.0 },
      { action: 'Barricade Illegal Median Cuts & Stray Cattle Barriers', expectedReductionPct: 8, priority: 'High', costEstimateLakhs: 55.0 }
    ]
  },
  {
    id: 'NH-48-BLR-CHE',
    name: 'Golden Quadrilateral NH-48 (Bengaluru - Krishnagiri - Chennai)',
    code: 'NH-48',
    origin: 'Bengaluru Electronic City',
    destination: 'Chennai Sriperumbudur',
    totalLengthKm: 347,
    state: 'Karnataka / Tamil Nadu',
    region: 'South Tech-Industrial Belt',
    riskScore: 64,
    riskCategory: 'High',
    confidenceScore: 88,
    trafficDensityScore: 88,
    accidentHistoryScore: 72,
    roadConditionScore: 58,
    weatherImpactScore: 60,
    visibilityScore: 55,
    geometryRiskScore: 48,
    lanes: 6,
    speedLimitKmh: 90,
    annualFatalities: 142,
    peakRiskWindow: '17:30 – 21:30 (Interstate Shift Change)',
    isBlackspot: false,
    nearMissRatePerMonth: 48,
    waypoints: [
      { x: 420, y: 780, lat: 12.9716, lng: 77.5946, label: 'Bengaluru Electronic City' },
      { x: 440, y: 810, lat: 12.5186, lng: 78.2137, label: 'Krishnagiri Junction' },
      { x: 470, y: 820, lat: 12.9165, lng: 79.1325, label: 'Vellore Bypass' },
      { x: 495, y: 815, lat: 13.0827, lng: 80.2707, label: 'Chennai Port Outer Corridor' }
    ],
    causalChain: {
      trigger: 'Industrial Freight Intermixing with 2-Wheelers',
      factor1: 'Lack of segregated service lanes at factory gates',
      factor2: 'High differential speed between trucks (40 km/h) & cars (90 km/h)',
      intermediate: 'Sudden lane weaving and pedestrian crossing',
      consequence: 'Side-impact collisions at median openings'
    },
    recommendations: [
      { action: 'Grade-Separated Pedestrian Foot Overbridges at Industrial Hubs', expectedReductionPct: 12, priority: 'High', costEstimateLakhs: 95.0 },
      { action: 'Smart Intersection Traffic Signal Coordination', expectedReductionPct: 6, priority: 'Medium', costEstimateLakhs: 20.0 }
    ]
  },
  {
    id: 'NH-16-VIZ-CHE',
    name: 'NH-16 Coastal Freight Trunk (Visakhapatnam - Vijayawada - Chennai)',
    code: 'NH-16',
    origin: 'Visakhapatnam Steel Plant',
    destination: 'Chennai Ennore Expressway',
    totalLengthKm: 780,
    state: 'Andhra Pradesh / Tamil Nadu',
    region: 'East Coast Corridor',
    riskScore: 69,
    riskCategory: 'High',
    confidenceScore: 86,
    trafficDensityScore: 81,
    accidentHistoryScore: 76,
    roadConditionScore: 64,
    weatherImpactScore: 78, // Cyclone & coastal rain
    visibilityScore: 66,
    geometryRiskScore: 42,
    lanes: 4,
    speedLimitKmh: 90,
    annualFatalities: 168,
    peakRiskWindow: '22:00 – 05:00 (Long-haul Maritime Freight)',
    isBlackspot: false,
    nearMissRatePerMonth: 52,
    waypoints: [
      { x: 570, y: 680, lat: 17.6868, lng: 83.2185, label: 'Visakhapatnam' },
      { x: 540, y: 720, lat: 16.5062, lng: 80.6480, label: 'Vijayawada Bypass' },
      { x: 510, y: 780, lat: 14.4426, lng: 79.9865, label: 'Nellore Expressway' },
      { x: 495, y: 815, lat: 13.0827, lng: 80.2707, label: 'Chennai' }
    ],
    causalChain: {
      trigger: 'Driver Fatigue on Continuous Coastal Straightaways',
      factor1: 'Micro-sleep episodes between 02:00 and 05:00',
      factor2: 'Hydroplaning during heavy cyclone squalls',
      intermediate: 'Veering off roadway onto unpaved shoulders',
      consequence: 'Rollovers and culvert impact accidents'
    },
    recommendations: [
      { action: 'Continuous Shoulder Rumble Strips on Entire Corridor', expectedReductionPct: 15, priority: 'Immediate', costEstimateLakhs: 32.0 },
      { action: 'Dedicated Truck Rest Stops with Fatigue Monitoring Kiosks', expectedReductionPct: 10, priority: 'High', costEstimateLakhs: 120.0 }
    ]
  },
  {
    id: 'NH-27-GUJ-RAJ',
    name: 'NH-27 East-West Axis (Porbandar - Rajkot - Udaipur)',
    code: 'NH-27',
    origin: 'Porbandar Coastal Link',
    destination: 'Udaipur City Gate',
    totalLengthKm: 420,
    state: 'Gujarat / Rajasthan',
    region: 'Western Trans-Corridor',
    riskScore: 52,
    riskCategory: 'Moderate',
    confidenceScore: 84,
    trafficDensityScore: 65,
    accidentHistoryScore: 58,
    roadConditionScore: 48,
    weatherImpactScore: 40,
    visibilityScore: 44,
    geometryRiskScore: 58,
    lanes: 4,
    speedLimitKmh: 90,
    annualFatalities: 96,
    peakRiskWindow: '14:00 – 18:00 (Crosswind & Desert Glare)',
    isBlackspot: false,
    nearMissRatePerMonth: 32,
    waypoints: [
      { x: 190, y: 580, lat: 21.6417, lng: 69.6293, label: 'Porbandar' },
      { x: 250, y: 540, lat: 22.3039, lng: 70.8022, label: 'Rajkot Junction' },
      { x: 330, y: 480, lat: 24.5854, lng: 73.7125, label: 'Udaipur Bypass' }
    ],
    causalChain: {
      trigger: 'High Wind Velocity & Severe Sun Glare',
      factor1: 'Sudden wind gusts affecting high-sided containers',
      factor2: 'Unregulated agricultural tractor movements',
      intermediate: 'Over-correction on two-lane undivided bridges',
      consequence: 'Head-on collisions during high-speed overtaking'
    },
    recommendations: [
      { action: 'Wind Deflection Barriers on Long Viaducts', expectedReductionPct: 6, priority: 'Medium', costEstimateLakhs: 24.0 },
      { action: 'Median Concrete Barriers along Undivided Stretches', expectedReductionPct: 18, priority: 'Immediate', costEstimateLakhs: 75.0 }
    ]
  }
];

// Major Indian Metro Hubs with Coordinates
export const METRO_HUBS: MetroHub[] = [
  {
    id: 'CHE',
    name: 'Chennai',
    state: 'Tamil Nadu',
    x: 495,
    y: 815,
    lat: 13.0827,
    lng: 80.2707,
    populationM: 11.2,
    congestionIndex: 78,
    activeRiskScore: 76,
    connectedHighways: ['NH-44', 'NH-48', 'NH-16']
  },
  {
    id: 'BLR',
    name: 'Bengaluru',
    state: 'Karnataka',
    x: 420,
    y: 780,
    lat: 12.9716,
    lng: 77.5946,
    populationM: 13.6,
    congestionIndex: 88,
    activeRiskScore: 71,
    connectedHighways: ['NH-44', 'NH-48', 'NH-75']
  },
  {
    id: 'MUM',
    name: 'Mumbai',
    state: 'Maharashtra',
    x: 340,
    y: 650,
    lat: 19.0760,
    lng: 72.8777,
    populationM: 21.0,
    congestionIndex: 89,
    activeRiskScore: 79,
    connectedHighways: ['NH-48', 'MPEW', 'NH-66']
  },
  {
    id: 'DEL',
    name: 'Delhi NCR',
    state: 'Delhi',
    x: 410,
    y: 330,
    lat: 28.7041,
    lng: 77.1025,
    populationM: 32.9,
    congestionIndex: 84,
    activeRiskScore: 82,
    connectedHighways: ['NH-44', 'NH-48', 'NH-9']
  },
  {
    id: 'HYD',
    name: 'Hyderabad',
    state: 'Telangana',
    x: 460,
    y: 660,
    lat: 17.3850,
    lng: 78.4867,
    populationM: 10.5,
    congestionIndex: 72,
    activeRiskScore: 68,
    connectedHighways: ['NH-44', 'NH-65']
  },
  {
    id: 'KOL',
    name: 'Kolkata',
    state: 'West Bengal',
    x: 690,
    y: 470,
    lat: 22.5726,
    lng: 88.3639,
    populationM: 15.1,
    congestionIndex: 75,
    activeRiskScore: 66,
    connectedHighways: ['NH-16', 'NH-19']
  }
];

// AI-Identified High-Risk Blackspots across India (DBSCAN Clustered)
export const AI_BLACKSPOTS: BlackspotCluster[] = [
  {
    id: 'BS-01-NAM',
    name: 'Namakkal Thuraiyur Blind Curve S-Apex (NH-44)',
    highwayCode: 'NH-44',
    state: 'Tamil Nadu',
    x: 445,
    y: 885,
    lat: 11.2189,
    lng: 78.1674,
    severityIndex: 91,
    fatalitiesPast3Years: 38,
    clusterRadiusMeters: 320,
    algorithm: 'DBSCAN Cluster (eps=250m, minPts=8)',
    primaryCause: 'Sharp downhill reverse curvature + heavy water ponding during monsoons',
    peakTime: '19:00 – 21:30',
    counterfactualIntervention: 'Speed Limiter Rumble Strips & Friction Aggregate Overlay',
    riskReductionEstimatePct: 24
  },
  {
    id: 'BS-02-BHOR',
    name: 'Bhor Ghat Khandala Viaduct Slip Zone (NH-48)',
    highwayCode: 'NH-48',
    state: 'Maharashtra',
    x: 355,
    y: 665,
    lat: 18.7525,
    lng: 73.4057,
    severityIndex: 94,
    fatalitiesPast3Years: 52,
    clusterRadiusMeters: 450,
    algorithm: 'Spatial KDE',
    primaryCause: 'Severe 8.5% downhill gradient leading to chronic heavy-vehicle brake failure',
    peakTime: '01:00 – 04:30',
    counterfactualIntervention: 'Arrester Gravel Bed & Automatic Thermal Brake Scanners',
    riskReductionEstimatePct: 31
  },
  {
    id: 'BS-03-MATH',
    name: 'Mathura-Agra Toll Plazas Convergence Zone (NH-44)',
    highwayCode: 'NH-44',
    state: 'Uttar Pradesh',
    x: 430,
    y: 360,
    lat: 27.4924,
    lng: 77.6737,
    severityIndex: 88,
    fatalitiesPast3Years: 44,
    clusterRadiusMeters: 500,
    algorithm: 'Isolation Forest Anomaly',
    primaryCause: 'Sudden deceleration queues enveloped in zero-visibility winter smog',
    peakTime: '04:30 – 07:30',
    counterfactualIntervention: 'Smart Optical Fog Warning Strobe Grid',
    riskReductionEstimatePct: 28
  },
  {
    id: 'BS-04-KRISH',
    name: 'Krishnagiri Toll Plaza & Flyover Merge (NH-48)',
    highwayCode: 'NH-48',
    state: 'Tamil Nadu',
    x: 440,
    y: 810,
    lat: 12.5186,
    lng: 78.2137,
    severityIndex: 82,
    fatalitiesPast3Years: 29,
    clusterRadiusMeters: 280,
    algorithm: 'DBSCAN Cluster (eps=250m, minPts=8)',
    primaryCause: 'Abrupt 6-lane into 3-lane necking + unregulated cross-median autorickshaw traffic',
    peakTime: '18:00 – 21:00',
    counterfactualIntervention: 'Dedicated Channelizer Bollards & Flyover Underpass Extension',
    riskReductionEstimatePct: 22
  }
];

// Strategic Emergency Response Facilities along Golden Quadrilateral & NH-44
export const EMERGENCY_FACILITIES: EmergencyAsset[] = [
  {
    id: 'EM-01',
    name: 'Government Mohan Kumaramangalam Super-Specialty Trauma Hospital',
    type: 'Trauma Hospital',
    x: 450,
    y: 852,
    lat: 11.6643,
    lng: 78.1460,
    nearHighway: 'NH-44',
    availableUnits: 12,
    avgResponseMins: 6.4
  },
  {
    id: 'EM-02',
    name: 'Apollo Speciality Hospitals & Level-1 Trauma Pavilion',
    type: 'Trauma Hospital',
    x: 443,
    y: 918,
    lat: 9.9252,
    lng: 78.1198,
    nearHighway: 'NH-44',
    availableUnits: 8,
    avgResponseMins: 7.2
  },
  {
    id: 'EM-03',
    name: 'Tamil Nadu Highway Patrol Division - Unit 14 (Salem-Namakkal)',
    type: 'Highway Police Patrol',
    x: 447,
    y: 875,
    lat: 11.2189,
    lng: 78.1674,
    nearHighway: 'NH-44',
    availableUnits: 4,
    avgResponseMins: 4.8
  },
  {
    id: 'EM-04',
    name: 'Fire & Disaster Rescue Station - Namakkal Central',
    type: 'Fire Rescue',
    x: 444,
    y: 888,
    lat: 10.7905,
    lng: 78.7047,
    nearHighway: 'NH-44',
    availableUnits: 3,
    avgResponseMins: 8.5
  },
  {
    id: 'EM-05',
    name: 'MGM Healthcare Critical Emergency Care',
    type: 'Trauma Hospital',
    x: 494,
    y: 814,
    lat: 13.0827,
    lng: 80.2707,
    nearHighway: 'NH-48',
    availableUnits: 15,
    avgResponseMins: 5.9
  }
];

// Official MoRTH National Statistics
export const MORTH_NATIONAL_STATS = {
  source: 'Ministry of Road Transport and Highways (MoRTH), Government of India',
  datasetYear: 'Latest Validated National Road Accident Report',
  totalAccidentsReported: 461312,
  totalFatalitiesReported: 168491,
  personsInjured: 443366,
  nationalHighwaySharePct: 32.9,
  stateHighwaySharePct: 23.1,
  otherRoadsSharePct: 44.0,
  topContributingFactors: [
    { factor: 'Over-speeding & Excessive Velocity', pct: 71.2 },
    { factor: 'Dangerous / Careless Overtaking & Lane Drifting', pct: 12.8 },
    { factor: 'Inclement Weather & Sub-optimal Visibility', pct: 6.4 },
    { factor: 'Driving under the influence / Fatigue', pct: 4.2 },
    { factor: 'Use of Handheld Mobile Devices', pct: 2.8 }
  ],
  roadUserShare: [
    { user: 'Two-Wheelers (Riders & Pillion)', pct: 44.5 },
    { user: 'Pedestrians', pct: 19.5 },
    { user: 'Cars, Taxis, Vans & LMV', pct: 15.3 },
    { user: 'Heavy Freight Trucks & Lorries', pct: 8.9 },
    { user: 'Auto-Rickshaws & 3-Wheelers', pct: 6.2 },
    { user: 'Buses', pct: 3.1 }
  ]
};
