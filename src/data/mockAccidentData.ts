import { AccidentRecord, WeatherCondition, RoadType, RoadSurface, JunctionType, TrafficDensity, LightingCondition, AccidentSeverity } from '../types/accident';

// Pre-defined seed hubs for realistic spatial clustering
export interface HubLocation {
  name: string;
  lat: number;
  lng: number;
  roadType: RoadType;
  speedLimit: number;
  junctionType: JunctionType;
  baseRisk: 'High' | 'Very High' | 'Moderate' | 'Low';
  commonHazard: string;
}

export const KNOWN_HUBS: HubLocation[] = [
  {
    name: "Kathipara Multi-Grade Cloverleaf",
    lat: 13.0067,
    lng: 80.2014,
    roadType: "Urban Arterial",
    speedLimit: 60,
    junctionType: "Flyover Ramp",
    baseRisk: "Very High",
    commonHazard: "High speed weaving on flyover approach ramps during peak commute"
  },
  {
    name: "GST Road - Chromepet S-Curve",
    lat: 12.9516,
    lng: 80.1462,
    roadType: "National Highway",
    speedLimit: 70,
    junctionType: "Blind Curve",
    baseRisk: "Very High",
    commonHazard: "Sharp reverse curvature combined with high freight truck volumes"
  },
  {
    name: "OMR Tech Corridor - Sholinganallur Junction",
    lat: 12.9010,
    lng: 80.2279,
    roadType: "State Highway",
    speedLimit: 60,
    junctionType: "Crossroad",
    baseRisk: "High",
    commonHazard: "Heavy two-wheeler volume intersecting fast bus rapid lanes"
  },
  {
    name: "Maduravoyal Bypass Grade Interchange",
    lat: 13.0645,
    lng: 80.1610,
    roadType: "Expressway",
    speedLimit: 80,
    junctionType: "Flyover Ramp",
    baseRisk: "High",
    commonHazard: "Night-time speeding and abrupt lane changes before toll plazas"
  },
  {
    name: "Mount-Poonamallee Arterial Corridor",
    lat: 13.0382,
    lng: 80.1565,
    roadType: "Urban Arterial",
    speedLimit: 50,
    junctionType: "T-Junction",
    baseRisk: "Moderate",
    commonHazard: "Heavy construction diversions, commercial ingress/egress conflicts"
  },
  {
    name: "East Coast Highway - Akkarai Seaside Curve",
    lat: 12.8943,
    lng: 80.2482,
    roadType: "State Highway",
    speedLimit: 75,
    junctionType: "Blind Curve",
    baseRisk: "Very High",
    commonHazard: "Weekend night-time speeding under wet maritime road mist"
  },
  {
    name: "Guindy Industrial Link Junction",
    lat: 13.0102,
    lng: 80.2120,
    roadType: "Commercial Collector",
    speedLimit: 45,
    junctionType: "Crossroad",
    baseRisk: "Moderate",
    commonHazard: "Heavy multi-axle freight turns and restricted driver sightlines"
  },
  {
    name: "Central Transit Terminal Intercept",
    lat: 13.0827,
    lng: 80.2707,
    roadType: "Urban Arterial",
    speedLimit: 40,
    junctionType: "Roundabout",
    baseRisk: "Moderate",
    commonHazard: "Dense pedestrian movements crossing multi-modal bus lanes"
  },
  {
    name: "Koyambedu Wholesale Ring Flyover",
    lat: 13.0694,
    lng: 80.1948,
    roadType: "Urban Arterial",
    speedLimit: 55,
    junctionType: "Roundabout",
    baseRisk: "High",
    commonHazard: "Unregulated early morning produce transit and lane indiscipline"
  },
  {
    name: "Tambaram South Terminal Bypass",
    lat: 12.9249,
    lng: 80.1000,
    roadType: "National Highway",
    speedLimit: 80,
    junctionType: "T-Junction",
    baseRisk: "High",
    commonHazard: "High speed intercity bus merges into suburban feeder lanes"
  },
  {
    name: "Velachery Lake Link Boulevard",
    lat: 12.9815,
    lng: 80.2180,
    roadType: "Urban Arterial",
    speedLimit: 50,
    junctionType: "T-Junction",
    baseRisk: "Low",
    commonHazard: "Occasional waterlogging during monsoon showers"
  },
  {
    name: "Perungudi Toll Plaza Approach",
    lat: 12.9620,
    lng: 80.2440,
    roadType: "Expressway",
    speedLimit: 70,
    junctionType: "Straight Highway",
    baseRisk: "Low",
    commonHazard: "Rear-end collisions during sudden toll lane decelerations"
  }
];

// Generator for deterministic rich records
function generateRealisticAccidentDataset(): AccidentRecord[] {
  const records: AccidentRecord[] = [];
  const years = [2023, 2024, 2025, 2026];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  let idCounter = 1001;

  // For each hub, generate a cluster of accidents
  KNOWN_HUBS.forEach((hub, hubIdx) => {
    // Determine count based on risk level
    const clusterCount = hub.baseRisk === 'Very High' ? 58 : hub.baseRisk === 'High' ? 44 : hub.baseRisk === 'Moderate' ? 28 : 16;

    for (let i = 0; i < clusterCount; i++) {
      // Small Gaussian-like scatter around hub centroid (approx ~100m to 700m)
      const u = (Math.sin(i * 13.7 + hubIdx * 29.3) + 1) / 2;
      const v = (Math.cos(i * 17.9 + hubIdx * 19.1) + 1) / 2;
      const latOffset = (u - 0.5) * 0.007; // ~400-600 meters
      const lngOffset = (v - 0.5) * 0.007;

      const year = years[(i + hubIdx) % years.length];
      const monthIdx = (i * 3 + hubIdx * 2) % 12;
      const month = months[monthIdx];
      const day = days[(i + hubIdx * 3) % 7];
      const isWeekend = day === 'Saturday' || day === 'Sunday';

      // Realistic hour distribution: peaks at 8-10am, 6-9pm, and late night 11pm-2am
      const hourPool = [
        8, 9, 9, 10, 13, 14, 17, 18, 18, 19, 20, 21, 22, 23, 0, 1, 2, 7
      ];
      const hour = hourPool[(i * 5 + hubIdx * 7) % hourPool.length];
      const minute = ((i * 17) % 60).toString().padStart(2, '0');
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);

      // Environmental attributes
      const isMonsoonMonth = monthIdx >= 8 && monthIdx <= 10;
      let weather: WeatherCondition = 'Clear';
      if (isMonsoonMonth && (i % 3 === 0 || i % 4 === 0)) {
        weather = i % 2 === 0 ? 'Rain' : 'Storm';
      } else if (hour <= 6 && (i % 5 === 0)) {
        weather = 'Fog/Mist';
      } else if (i % 7 === 0) {
        weather = 'Rain';
      }

      let roadSurface: RoadSurface = 'Dry';
      if (weather === 'Rain' || weather === 'Storm') {
        roadSurface = i % 4 === 0 ? 'Flooded' : 'Wet';
      }

      let lighting: LightingCondition = 'Daylight';
      if (hour >= 6 && hour < 18) {
        lighting = 'Daylight';
      } else if (hour === 18 || hour === 5) {
        lighting = 'Dusk/Dawn';
      } else {
        lighting = i % 3 === 0 ? 'Dark - No Street Lights' : 'Dark - Street Lights On';
      }

      let trafficVolume: TrafficDensity = 'Moderate';
      if (isPeakHour) {
        trafficVolume = i % 2 === 0 ? 'Heavy' : 'Gridlock';
      } else if (hour >= 23 || hour <= 5) {
        trafficVolume = 'Low';
      }

      // Severity logic influenced by speed, darkness, curve, and rain
      let severityScore = 0;
      if (hub.speedLimit >= 70) severityScore += 2;
      if (hub.junctionType === 'Blind Curve' || hub.junctionType === 'Flyover Ramp') severityScore += 2;
      if (weather === 'Rain' || weather === 'Storm' || weather === 'Fog/Mist') severityScore += 1;
      if (lighting === 'Dark - No Street Lights') severityScore += 2;
      if (hour >= 23 || hour <= 3) severityScore += 1; // late night speeding

      let severity: AccidentSeverity = 'Slight';
      let casualties = 0;
      let injuries = 1;

      if (severityScore >= 6) {
        severity = 'Fatal';
        casualties = (i % 2) + 1;
        injuries = (i % 3) + 1;
      } else if (severityScore >= 3) {
        severity = 'Severe';
        casualties = 0;
        injuries = (i % 3) + 2;
      } else {
        severity = 'Slight';
        casualties = 0;
        injuries = 1;
      }

      const vehiclesInvolved = (severity === 'Fatal' ? (i % 3) + 2 : (i % 2) + 1);

      records.push({
        id: `ACC-TN-${idCounter++}`,
        date: `${year}-${(monthIdx + 1).toString().padStart(2, '0')}-${((i % 27) + 1).toString().padStart(2, '0')}`,
        time,
        hour,
        dayOfWeek: day,
        month,
        year,
        latitude: +(hub.lat + latOffset).toFixed(6),
        longitude: +(hub.lng + lngOffset).toFixed(6),
        locationName: `${hub.name} (Sec ${i + 1})`,
        severity,
        vehiclesInvolved,
        casualties,
        injuries,
        roadType: hub.roadType,
        lanes: hub.roadType === 'Expressway' ? 6 : hub.roadType === 'National Highway' ? 4 : 2,
        roadSurface,
        junctionType: hub.junctionType,
        speedLimit: hub.speedLimit,
        trafficVolume,
        weather,
        rainfallMm: weather === 'Rain' ? 18.5 : weather === 'Storm' ? 42.0 : 0,
        visibilityKm: weather === 'Fog/Mist' ? 1.2 : weather === 'Storm' ? 3.0 : 10.0,
        lighting,
        isWeekend,
        isPeakHour
      });
    }
  });

  // Also add some random dispersed non-hotspot accidents to create noise (for realistic DBSCAN filtering)
  for (let j = 0; j < 65; j++) {
    const lat = 12.88 + ((j * 17) % 100) * 0.0022;
    const lng = 80.12 + ((j * 23) % 100) * 0.0016;
    const hour = (j * 3) % 24;

    records.push({
      id: `ACC-TN-${idCounter++}`,
      date: `2025-06-${((j % 28) + 1).toString().padStart(2, '0')}`,
      time: `${hour.toString().padStart(2, '0')}:15`,
      hour,
      dayOfWeek: days[j % 7],
      month: 'Jun',
      year: 2025,
      latitude: +lat.toFixed(6),
      longitude: +lng.toFixed(6),
      locationName: `Dispersed Peripheral Road Mile ${(j * 1.4).toFixed(1)}`,
      severity: j % 5 === 0 ? 'Severe' : 'Slight',
      vehiclesInvolved: 1,
      casualties: 0,
      injuries: 1,
      roadType: 'Residential Street',
      lanes: 2,
      roadSurface: 'Dry',
      junctionType: 'Straight Highway',
      speedLimit: 40,
      trafficVolume: 'Low',
      weather: 'Clear',
      rainfallMm: 0,
      visibilityKm: 10,
      lighting: 'Daylight',
      isWeekend: false,
      isPeakHour: false
    });
  }

  return records;
}

export const INITIAL_ACCIDENT_DATA: AccidentRecord[] = generateRealisticAccidentDataset();
