import { RoadSegmentProfile } from '../types/accident';
import { ROAD_SEGMENTS } from '../data/roadGuardData';

const CACHE_KEY_PREFIX = 'ROADGUARD_CACHE_V2_';
const CACHE_META_KEY = 'ROADGUARD_CACHE_META';
const CACHE_SCENARIOS_KEY = 'ROADGUARD_SAVED_SCENARIOS';

export interface CacheMetadata {
  lastSynced: string;
  itemCount: number;
  estimatedBytes: number;
  isOfflineMode: boolean;
  version: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  date: string;
  roadId: string;
  delta: number;
  conditions: {
    weather: string;
    traffic: string;
    visibility: string;
    surface: string;
  };
}

class OfflineCacheService {
  private memoryCache: Map<string, RoadSegmentProfile> = new Map();
  private isSimulatedOffline: boolean = false;

  constructor() {
    this.initializeCache();
  }

  public initializeCache(): void {
    try {
      // Check if localStorage has stored segments
      const cachedMeta = localStorage.getItem(CACHE_META_KEY);
      if (!cachedMeta) {
        // First boot: populate localStorage with baseline profiles
        this.cacheAllSegments(ROAD_SEGMENTS);
      } else {
        // Load into memory
        ROAD_SEGMENTS.forEach(seg => {
          const stored = localStorage.getItem(`${CACHE_KEY_PREFIX}${seg.id}`);
          if (stored) {
            this.memoryCache.set(seg.id, JSON.parse(stored));
          } else {
            this.memoryCache.set(seg.id, seg);
            localStorage.setItem(`${CACHE_KEY_PREFIX}${seg.id}`, JSON.stringify(seg));
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or restricted; falling back to in-memory cache', e);
      ROAD_SEGMENTS.forEach(s => this.memoryCache.set(s.id, s));
    }
  }

  public cacheAllSegments(segments: RoadSegmentProfile[]): void {
    let totalBytes = 0;
    segments.forEach(seg => {
      this.memoryCache.set(seg.id, seg);
      try {
        const serialized = JSON.stringify(seg);
        localStorage.setItem(`${CACHE_KEY_PREFIX}${seg.id}`, serialized);
        totalBytes += serialized.length * 2; // rough UTF-16 bytes
      } catch (err) {
        console.warn('Storage quota exceeded during segment caching', err);
      }
    });

    const meta: CacheMetadata = {
      lastSynced: new Date().toISOString(),
      itemCount: segments.length,
      estimatedBytes: totalBytes,
      isOfflineMode: this.isSimulatedOffline || !navigator.onLine,
      version: '2.4.0-edge'
    };

    try {
      localStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
    } catch {
      // ignore
    }
  }

  public getSegment(id: string): RoadSegmentProfile {
    // Check memory first
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id)!;
    }
    // Check localStorage
    try {
      const stored = localStorage.getItem(`${CACHE_KEY_PREFIX}${id}`);
      if (stored) {
        const parsed = JSON.parse(stored) as RoadSegmentProfile;
        this.memoryCache.set(id, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to retrieve from localStorage cache', e);
    }
    // Fallback to static
    return ROAD_SEGMENTS.find(s => s.id === id) || ROAD_SEGMENTS[0];
  }

  public updateSegmentRiskScore(id: string, newScore: number, customFields?: Partial<RoadSegmentProfile>): RoadSegmentProfile {
    const current = this.getSegment(id);
    const updated: RoadSegmentProfile = {
      ...current,
      currentRiskScore: Math.min(100, Math.max(0, Math.round(newScore))),
      ...customFields
    };

    this.memoryCache.set(id, updated);
    try {
      localStorage.setItem(`${CACHE_KEY_PREFIX}${id}`, JSON.stringify(updated));
      this.refreshMetadata();
    } catch (e) {
      console.warn('Failed to update segment in localStorage', e);
    }
    return updated;
  }

  public getMetadata(): CacheMetadata {
    try {
      const stored = localStorage.getItem(CACHE_META_KEY);
      if (stored) {
        const meta = JSON.parse(stored) as CacheMetadata;
        meta.isOfflineMode = this.isSimulatedOffline || !navigator.onLine;
        return meta;
      }
    } catch {
      // ignore
    }
    return {
      lastSynced: new Date().toISOString(),
      itemCount: ROAD_SEGMENTS.length,
      estimatedBytes: 34500,
      isOfflineMode: this.isSimulatedOffline || !navigator.onLine,
      version: '2.4.0-edge'
    };
  }

  public setSimulatedOffline(offline: boolean): void {
    this.isSimulatedOffline = offline;
    this.refreshMetadata();
  }

  public isOffline(): boolean {
    return this.isSimulatedOffline || !navigator.onLine;
  }

  public refreshMetadata(): void {
    try {
      let totalBytes = 0;
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_KEY_PREFIX)) {
          count++;
          totalBytes += (localStorage.getItem(key)?.length || 0) * 2;
        }
      }
      const meta: CacheMetadata = {
        lastSynced: new Date().toISOString(),
        itemCount: count || ROAD_SEGMENTS.length,
        estimatedBytes: totalBytes || 34500,
        isOfflineMode: this.isOffline(),
        version: '2.4.0-edge'
      };
      localStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
    } catch {
      // ignore
    }
  }

  public purgeCache(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(CACHE_KEY_PREFIX) || key === CACHE_META_KEY)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      this.memoryCache.clear();
      this.cacheAllSegments(ROAD_SEGMENTS);
    } catch (e) {
      console.warn('Purge cache failed', e);
    }
  }

  public getSavedScenarios(): SavedScenario[] {
    try {
      const raw = localStorage.getItem(CACHE_SCENARIOS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 'SCN-01',
        name: 'Monsoon Heavy Downpour & Congestion',
        date: '2026-10-01 19:30',
        roadId: 'R-204',
        delta: 14,
        conditions: { weather: 'Storm', traffic: 'Gridlock', visibility: 'Low', surface: 'Flooded' }
      },
      {
        id: 'SCN-02',
        name: 'Nocturnal Speeding On Outer Ring',
        date: '2026-10-01 02:15',
        roadId: 'R-118',
        delta: 18,
        conditions: { weather: 'Fog/Mist', traffic: 'Low', visibility: 'Low', surface: 'Wet' }
      }
    ];
  }

  public saveScenario(scenario: Omit<SavedScenario, 'id' | 'date'>): SavedScenario {
    const list = this.getSavedScenarios();
    const newScn: SavedScenario = {
      ...scenario,
      id: `SCN-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString()
    };
    list.unshift(newScn);
    try {
      localStorage.setItem(CACHE_SCENARIOS_KEY, JSON.stringify(list.slice(0, 10)));
    } catch {}
    return newScn;
  }
}

export const offlineCache = new OfflineCacheService();
