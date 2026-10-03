import { RouteAnalysis, HotspotCluster } from '../types/accident';
import { haversineDistanceMeters } from './clusteringService';

export interface PredefinedRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  waypoints: {
    name: string;
    lat: number;
    lng: number;
    roadType: 'Expressway' | 'National Highway' | 'State Highway' | 'Urban Arterial' | 'Commercial Collector' | 'Residential Street';
    lengthKm: number;
    baseRiskScore: number;
    hazards: string[];
  }[];
}

export const PREDEFINED_ROUTES: PredefinedRoute[] = [
  {
    id: 'ROUTE-01',
    name: 'Corridor A: Airport Interchange to OMR Tech Corridor',
    origin: 'Kathipara Airport Junction',
    destination: 'Sholinganallur Tech Hub',
    waypoints: [
      {
        name: 'Kathipara Multi-Grade Cloverleaf Flyover',
        lat: 13.0067,
        lng: 80.2014,
        roadType: 'Urban Arterial',
        lengthKm: 2.4,
        baseRiskScore: 84,
        hazards: ['Sharp ramp merges', 'High evening commute density', 'Frequent lane changes']
      },
      {
        name: 'Guindy - Velachery Link Connector',
        lat: 12.9815,
        lng: 80.2180,
        roadType: 'Urban Arterial',
        lengthKm: 4.8,
        baseRiskScore: 48,
        hazards: ['Moderate commercial side friction', 'Periodic surface water accumulation']
      },
      {
        name: 'Perungudi Expressway Approach',
        lat: 12.9620,
        lng: 80.2440,
        roadType: 'Expressway',
        lengthKm: 3.6,
        baseRiskScore: 36,
        hazards: ['Toll lane queues', 'Speed variance']
      },
      {
        name: 'OMR Sholinganallur Intersection',
        lat: 12.9010,
        lng: 80.2279,
        roadType: 'State Highway',
        lengthKm: 4.2,
        baseRiskScore: 78,
        hazards: ['High two-wheeler volume', 'Cross-traffic turning conflicts', 'Multi-phase signal waiting']
      }
    ]
  },
  {
    id: 'ROUTE-02',
    name: 'Corridor B: Central Terminus to Chromepet GST Expressway',
    origin: 'Chennai Central Station',
    destination: 'Chromepet GST Highway Curve',
    waypoints: [
      {
        name: 'Central Transit Terminal Ring',
        lat: 13.0827,
        lng: 80.2707,
        roadType: 'Urban Arterial',
        lengthKm: 3.1,
        baseRiskScore: 54,
        hazards: ['Dense pedestrian movement', 'Bus depot egress']
      },
      {
        name: 'Mount-Poonamallee Arterial Link',
        lat: 13.0382,
        lng: 80.1565,
        roadType: 'Urban Arterial',
        lengthKm: 6.5,
        baseRiskScore: 62,
        hazards: ['Commercial store accesses', 'Construction diversions']
      },
      {
        name: 'GST Highway - Chromepet S-Curve',
        lat: 12.9516,
        lng: 80.1462,
        roadType: 'National Highway',
        lengthKm: 5.2,
        baseRiskScore: 88,
        hazards: ['Sharp reverse curvature', 'High speed freight trucks', 'Poor nighttime sightlines']
      },
      {
        name: 'Tambaram Bypass Junction',
        lat: 12.9249,
        lng: 80.1000,
        roadType: 'National Highway',
        lengthKm: 4.0,
        baseRiskScore: 72,
        hazards: ['Highway merger turbulence', 'Long distance intercity traffic']
      }
    ]
  },
  {
    id: 'ROUTE-03',
    name: 'Corridor C: Maduravoyal Freight Bypass to Akkarai Coast Road',
    origin: 'Maduravoyal Logistics Junction',
    destination: 'Akkarai Seaside Boulevard',
    waypoints: [
      {
        name: 'Maduravoyal Bypass Grade Interchange',
        lat: 13.0645,
        lng: 80.1610,
        roadType: 'Expressway',
        lengthKm: 5.8,
        baseRiskScore: 79,
        hazards: ['Nighttime speeding', 'Heavy multi-axle freight movement']
      },
      {
        name: 'Koyambedu Wholesale Ring Link',
        lat: 13.0694,
        lng: 80.1948,
        roadType: 'Urban Arterial',
        lengthKm: 4.1,
        baseRiskScore: 71,
        hazards: ['Unregulated early morning delivery trucks', 'Pedestrian crossing indiscipline']
      },
      {
        name: 'Velachery Bypass Road',
        lat: 12.9750,
        lng: 80.2210,
        roadType: 'Urban Arterial',
        lengthKm: 6.3,
        baseRiskScore: 42,
        hazards: ['Moderate signalized intersections']
      },
      {
        name: 'East Coast Highway - Akkarai Seaside Curve',
        lat: 12.8943,
        lng: 80.2482,
        roadType: 'State Highway',
        lengthKm: 7.2,
        baseRiskScore: 86,
        hazards: ['Suburban speeding', 'Maritime mist & road moisture', 'Sharp curvature']
      }
    ]
  }
];

export function analyzeRouteRisk(
  route: PredefinedRoute,
  hotspots: HotspotCluster[],
  weatherModifier: number = 0,
  trafficModifier: number = 0
): RouteAnalysis {
  let totalLength = 0;
  let weightedRiskSum = 0;
  let hotspotsCrossedCount = 0;
  let highRiskSegmentsCount = 0;

  const analyzedSegments = route.waypoints.map((wp, idx) => {
    totalLength += wp.lengthKm;

    // Check if this segment intersects any hotspot within 700m
    let intersectsHotspot = false;
    let matchedHotspotName: string | undefined;

    for (const h of hotspots) {
      const dist = haversineDistanceMeters(wp.lat, wp.lng, h.centerLat, h.centerLng);
      if (dist <= 750) {
        intersectsHotspot = true;
        matchedHotspotName = h.name;
        hotspotsCrossedCount++;
        break;
      }
    }

    // Dynamic adjusted segment risk
    let segmentScore = wp.baseRiskScore + weatherModifier + trafficModifier;
    if (intersectsHotspot) segmentScore += 8;
    segmentScore = Math.min(99, Math.max(10, Math.round(segmentScore)));

    if (segmentScore >= 65) {
      highRiskSegmentsCount++;
    }

    weightedRiskSum += segmentScore * wp.lengthKm;

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
    if (segmentScore >= 80) riskLevel = 'Very High';
    else if (segmentScore >= 60) riskLevel = 'High';
    else if (segmentScore >= 35) riskLevel = 'Moderate';

    // Approximate coords segment
    const nextWp = route.waypoints[idx + 1] || wp;
    const coordinates: [number, number][] = [
      [wp.lat, wp.lng],
      [(wp.lat + nextWp.lat) / 2, (wp.lng + nextWp.lng) / 2],
      [nextWp.lat, nextWp.lng]
    ];

    return {
      id: `SEG-${idx + 1}`,
      name: wp.name,
      roadType: wp.roadType,
      lengthKm: wp.lengthKm,
      riskScore: segmentScore,
      riskLevel,
      keyHazards: wp.hazards,
      hotspotOverlap: intersectsHotspot,
      hotspotName: matchedHotspotName,
      coordinates
    };
  });

  const overallRisk = Math.round(weightedRiskSum / totalLength);

  let overallLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
  if (overallRisk >= 80) overallLevel = 'Very High';
  else if (overallRisk >= 60) overallLevel = 'High';
  else if (overallRisk >= 35) overallLevel = 'Moderate';

  const estimatedTravelTimeMin = Math.round((totalLength / 38) * 60);

  const safetyAdvisory: string[] = [
    `Route passes through ${hotspotsCrossedCount} identified high-density accident clusters.`,
    highRiskSegmentsCount > 0 ? `Exercise heightened vigilance on ${highRiskSegmentsCount} critical segments with score ≥ 65.` : 'All segments currently operate within nominal safety thresholds.',
    'Adhere to variable speed advisories and monitor real-time traffic updates along flyover interchanges.'
  ];

  return {
    routeName: route.name,
    origin: route.origin,
    destination: route.destination,
    totalDistanceKm: +totalLength.toFixed(1),
    estimatedTravelTimeMin,
    overallRouteRisk: overallRisk,
    overallRiskLevel: overallLevel,
    hotspotsCrossedCount,
    highRiskSegmentsCount,
    segments: analyzedSegments,
    safetyAdvisory
  };
}
