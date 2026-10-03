import { AccidentRecord, HotspotCluster, RiskLevel } from '../types/accident';

// Haversine formula to compute distance in meters between two geolocations
export function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface ClusteringOptions {
  algorithm: 'DBSCAN' | 'KMeans';
  epsMeters: number; // For DBSCAN, neighborhood radius in meters (e.g. 500m)
  minSamples: number; // Min points to form core cluster (e.g. 8)
  kClusters?: number; // For KMeans (e.g. 8)
}

/**
 * Geospatial DBSCAN Clustering implementation
 */
export function runDBSCAN(
  accidents: AccidentRecord[],
  epsMeters: number = 650,
  minSamples: number = 10
): HotspotCluster[] {
  const n = accidents.length;
  const visited = new Array<boolean>(n).fill(false);
  const clusterAssigned = new Array<number>(n).fill(-1); // -1 = unassigned / noise
  let clusterId = 0;

  // Precompute neighbor graph or query on the fly
  function regionQuery(pointIdx: number): number[] {
    const neighbors: number[] = [];
    const p1 = accidents[pointIdx];
    for (let i = 0; i < n; i++) {
      const p2 = accidents[i];
      const dist = haversineDistanceMeters(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
      if (dist <= epsMeters) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;

    const neighbors = regionQuery(i);
    if (neighbors.length < minSamples) {
      clusterAssigned[i] = -1; // marked as noise (may be picked up later)
    } else {
      // Expand cluster
      clusterAssigned[i] = clusterId;
      const seedQueue = [...neighbors];

      let queueIdx = 0;
      while (queueIdx < seedQueue.length) {
        const currentPointIdx = seedQueue[queueIdx++];

        if (!visited[currentPointIdx]) {
          visited[currentPointIdx] = true;
          const currentNeighbors = regionQuery(currentPointIdx);
          if (currentNeighbors.length >= minSamples) {
            // Merge unique neighbors
            for (const nIdx of currentNeighbors) {
              if (!seedQueue.includes(nIdx)) {
                seedQueue.push(nIdx);
              }
            }
          }
        }

        if (clusterAssigned[currentPointIdx] === -1) {
          clusterAssigned[currentPointIdx] = clusterId;
        }
      }

      clusterId++;
    }
  }

  // Aggregate clusters
  const clustersMap = new Map<number, AccidentRecord[]>();
  for (let i = 0; i < n; i++) {
    const cId = clusterAssigned[i];
    if (cId !== -1) {
      if (!clustersMap.has(cId)) {
        clustersMap.set(cId, []);
      }
      clustersMap.get(cId)!.push(accidents[i]);
    }
  }

  const results: HotspotCluster[] = [];

  clustersMap.forEach((clusterAccidents, cId) => {
    if (clusterAccidents.length === 0) return;

    // Compute Centroid
    const sumLat = clusterAccidents.reduce((acc, curr) => acc + curr.latitude, 0);
    const sumLng = clusterAccidents.reduce((acc, curr) => acc + curr.longitude, 0);
    const centerLat = sumLat / clusterAccidents.length;
    const centerLng = sumLng / clusterAccidents.length;

    // Compute maximum radius from centroid
    let maxDist = 0;
    clusterAccidents.forEach(item => {
      const d = haversineDistanceMeters(centerLat, centerLng, item.latitude, item.longitude);
      if (d > maxDist) maxDist = d;
    });

    // Counts
    const fatalCount = clusterAccidents.filter(a => a.severity === 'Fatal').length;
    const severeCount = clusterAccidents.filter(a => a.severity === 'Severe').length;
    const slightCount = clusterAccidents.filter(a => a.severity === 'Slight').length;

    // Dominant road types and conditions
    const roadNames = Array.from(new Set(clusterAccidents.map(a => a.locationName.split('(')[0].trim())));

    // Primary Risk Factor Analysis
    let primaryRiskFactor = 'High traffic density & junction congestion';
    const rainCount = clusterAccidents.filter(a => a.weather === 'Rain' || a.weather === 'Storm').length;
    const nightCount = clusterAccidents.filter(a => a.lighting.startsWith('Dark')).length;
    const speedLimitAvg = clusterAccidents.reduce((sum, a) => sum + a.speedLimit, 0) / clusterAccidents.length;

    if (nightCount > clusterAccidents.length * 0.45) {
      primaryRiskFactor = 'Inadequate nocturnal visibility & street illumination';
    } else if (rainCount > clusterAccidents.length * 0.35) {
      primaryRiskFactor = 'Aquaplaning and road skid during precipitation';
    } else if (speedLimitAvg >= 70) {
      primaryRiskFactor = 'Excessive arterial travel speeds & lane change conflicts';
    }

    // Risk score calculation based on density, fatal, and severe counts
    // Formula: (Accident Count * 0.8) + (Fatal Count * 4.5) + (Severe Count * 2.2)
    const rawScore = clusterAccidents.length * 0.9 + fatalCount * 5.2 + severeCount * 2.4;
    const normalizedScore = Math.min(98, Math.max(15, Math.round(rawScore * 1.1)));

    let riskLevel: RiskLevel = 'Low';
    if (normalizedScore >= 80) riskLevel = 'Very High';
    else if (normalizedScore >= 60) riskLevel = 'High';
    else if (normalizedScore >= 35) riskLevel = 'Moderate';

    results.push({
      id: `HOTSPOT-${cId + 1}`,
      name: roadNames[0] || `Accident Hotspot Zone #${cId + 1}`,
      clusterIndex: cId,
      centerLat: +centerLat.toFixed(6),
      centerLng: +centerLng.toFixed(6),
      radiusMeters: Math.max(250, Math.round(maxDist + 50)),
      accidentCount: clusterAccidents.length,
      fatalCount,
      severeCount,
      slightCount,
      primaryRiskFactor,
      riskScore: normalizedScore,
      riskLevel,
      roadNames,
      accidents: clusterAccidents
    });
  });

  // Sort by highest risk score
  return results.sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Basic K-Means clustering for spatial comparison
 */
export function runKMeans(accidents: AccidentRecord[], k: number = 8): HotspotCluster[] {
  if (accidents.length === 0) return [];
  const validK = Math.min(k, accidents.length);

  // Initialize centroids with k spread points
  const step = Math.floor(accidents.length / validK);
  let centroids = Array.from({ length: validK }, (_, i) => ({
    lat: accidents[i * step].latitude,
    lng: accidents[i * step].longitude
  }));

  const assignments = new Array<number>(accidents.length).fill(0);
  const maxIterations = 15;

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    let changed = false;
    for (let i = 0; i < accidents.length; i++) {
      const p = accidents[i];
      let bestDist = Infinity;
      let bestCluster = 0;

      for (let c = 0; c < validK; c++) {
        const d = haversineDistanceMeters(p.latitude, p.longitude, centroids[c].lat, centroids[c].lng);
        if (d < bestDist) {
          bestDist = d;
          bestCluster = c;
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Recompute centroids
    const newCentroids = Array.from({ length: validK }, () => ({ sumLat: 0, sumLng: 0, count: 0 }));
    for (let i = 0; i < accidents.length; i++) {
      const c = assignments[i];
      newCentroids[c].sumLat += accidents[i].latitude;
      newCentroids[c].sumLng += accidents[i].longitude;
      newCentroids[c].count++;
    }

    centroids = newCentroids.map((c, idx) => {
      if (c.count === 0) return centroids[idx];
      return { lat: c.sumLat / c.count, lng: c.sumLng / c.count };
    });
  }

  // Convert to HotspotClusters
  const results: HotspotCluster[] = [];
  for (let c = 0; c < validK; c++) {
    const clusterAccidents = accidents.filter((_, idx) => assignments[idx] === c);
    if (clusterAccidents.length < 5) continue; // prune tiny noise clusters

    const centerLat = centroids[c].lat;
    const centerLng = centroids[c].lng;
    let maxDist = 0;
    clusterAccidents.forEach(item => {
      const d = haversineDistanceMeters(centerLat, centerLng, item.latitude, item.longitude);
      if (d > maxDist) maxDist = d;
    });

    const fatalCount = clusterAccidents.filter(a => a.severity === 'Fatal').length;
    const severeCount = clusterAccidents.filter(a => a.severity === 'Severe').length;
    const slightCount = clusterAccidents.filter(a => a.severity === 'Slight').length;
    const roadNames = Array.from(new Set(clusterAccidents.map(a => a.locationName.split('(')[0].trim())));

    const rawScore = clusterAccidents.length * 0.85 + fatalCount * 4.8 + severeCount * 2.2;
    const normalizedScore = Math.min(95, Math.max(20, Math.round(rawScore * 1.05)));

    let riskLevel: RiskLevel = 'Low';
    if (normalizedScore >= 80) riskLevel = 'Very High';
    else if (normalizedScore >= 60) riskLevel = 'High';
    else if (normalizedScore >= 35) riskLevel = 'Moderate';

    results.push({
      id: `KM-ZONE-${c + 1}`,
      name: roadNames[0] || `Spatial Cluster #${c + 1}`,
      clusterIndex: c,
      centerLat: +centerLat.toFixed(6),
      centerLng: +centerLng.toFixed(6),
      radiusMeters: Math.max(300, Math.round(maxDist)),
      accidentCount: clusterAccidents.length,
      fatalCount,
      severeCount,
      slightCount,
      primaryRiskFactor: 'Spatial centroid vehicle concentration',
      riskScore: normalizedScore,
      riskLevel,
      roadNames,
      accidents: clusterAccidents
    });
  }

  return results.sort((a, b) => b.riskScore - a.riskScore);
}
