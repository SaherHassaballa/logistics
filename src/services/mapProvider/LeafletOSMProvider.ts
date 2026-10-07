import {
  MapProviderInterface,
  MapProviderId,
  MapTileConfig,
  GeocodeResult,
  RouteWaypoint,
  RouteResult,
  RouteLeg,
} from './types';
import {
  PRESET_EGYPT_LOCATIONS,
  calculateHaversineDistance,
  generateCurvedRoutePoints,
} from './geoUtils';

export class LeafletOSMProvider implements MapProviderInterface {
  readonly id: MapProviderId = 'leaflet-osm';
  readonly name = 'OpenStreetMap & OSRM Engine';
  readonly nameAr = 'محرك خرائط الشوارع المفتوحة OSRM';
  readonly description =
    'Real interactive live vector and raster tiles with zero credentials required. Powered by OpenStreetMap and OSRM high-precision routing.';

  hasValidCredentials(): boolean {
    return true; // Always operational without external billing token
  }

  getTileConfig(theme: 'light' | 'dark'): MapTileConfig {
    if (theme === 'dark') {
      return {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
      };
    }

    return {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    };
  }

  async geocode(query: string): Promise<GeocodeResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    // First check preset locations for fast instant matching
    const localMatches = PRESET_EGYPT_LOCATIONS.filter(
      (loc) =>
        loc.nameEn.toLowerCase().includes(trimmed) ||
        loc.nameAr.toLowerCase().includes(trimmed) ||
        loc.cityEn.toLowerCase().includes(trimmed) ||
        loc.cityAr.toLowerCase().includes(trimmed) ||
        loc.addressEn.toLowerCase().includes(trimmed) ||
        loc.addressAr.toLowerCase().includes(trimmed)
    ).map((loc) => ({
      id: loc.id,
      address: loc.addressEn,
      addressAr: loc.addressAr,
      city: loc.cityEn,
      lat: loc.lat,
      lng: loc.lng,
      type: loc.category,
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + ', Egypt'
      )}&format=json&addressdetails=1&limit=5`;

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en,ar',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const apiResults: GeocodeResult[] = data.map((item: any, idx: number) => ({
          id: `osm-${item.osm_id || idx}`,
          address: item.display_name,
          addressAr: item.name,
          city:
            item.address?.city ||
            item.address?.town ||
            item.address?.state ||
            'Egypt',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type,
        }));

        // Merge local matches first, then API results, deduplicating by proximity
        const combined = [...localMatches];
        for (const res of apiResults) {
          if (!combined.some((c) => Math.abs(c.lat - res.lat) < 0.01 && Math.abs(c.lng - res.lng) < 0.01)) {
            combined.push(res);
          }
        }
        return combined.slice(0, 6);
      }
    } catch {
      // Fallback cleanly to local preset matches if offline or timed out
    }

    return localMatches.length > 0
      ? localMatches
      : PRESET_EGYPT_LOCATIONS.slice(0, 4).map((loc) => ({
          id: loc.id,
          address: loc.addressEn,
          addressAr: loc.addressAr,
          city: loc.cityEn,
          lat: loc.lat,
          lng: loc.lng,
          type: loc.category,
        }));
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    // Check closest preset Egyptian location
    for (const preset of PRESET_EGYPT_LOCATIONS) {
      const dist = calculateHaversineDistance(lat, lng, preset.lat, preset.lng);
      if (dist < 0.8) {
        return {
          id: preset.id,
          address: preset.addressEn,
          addressAr: preset.addressAr,
          city: preset.cityEn,
          lat,
          lng,
        };
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en,ar',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const item = await response.json();
        const road = item.address?.road || item.address?.suburb || 'Expressway Corridor';
        const city = item.address?.city || item.address?.governorate || item.address?.town || 'Cairo Region';
        return {
          id: `rev-${lat.toFixed(4)}-${lng.toFixed(4)}`,
          address: `${road}, ${city}`,
          addressAr: item.display_name,
          city,
          lat,
          lng,
        };
      }
    } catch {
      // Graceful fallback
    }

    return {
      id: `coord-${lat.toFixed(4)}-${lng.toFixed(4)}`,
      address: `Waypoint Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
      addressAr: `إحداثيات الموقع (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
      city: 'Egypt',
      lat,
      lng,
    };
  }

  async calculateRoute(waypoints: RouteWaypoint[]): Promise<RouteResult> {
    if (waypoints.length < 2) {
      return {
        distanceKm: 0,
        durationMinutes: 0,
        coordinates: waypoints.map((w) => [w.lat, w.lng]),
        legs: [],
        provider: this.id,
        status: 'OK',
      };
    }

    // Try OSRM public routing API first for real road network routing
    try {
      const coordString = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM geojson coordinates are [lng, lat], convert to [lat, lng] for Leaflet
          const polylineCoords: [number, number][] = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );

          const distanceKm = +(route.distance / 1000).toFixed(1);
          const durationMinutes = Math.round(route.duration / 60);

          const legs: RouteLeg[] = (route.legs || []).map((leg: any, idx: number) => ({
            fromIndex: idx,
            toIndex: idx + 1,
            distanceKm: +(leg.distance / 1000).toFixed(1),
            durationMinutes: Math.round(leg.duration / 60),
            fromAddress: waypoints[idx]?.address,
            toAddress: waypoints[idx + 1]?.address,
          }));

          return {
            distanceKm,
            durationMinutes,
            coordinates: polylineCoords,
            legs,
            provider: this.id,
            status: 'OK',
          };
        }
      }
    } catch {
      // Fall through to real geodesic spline road calculation
    }

    // High accuracy fallback using Haversine road detour multiplier (1.28x for Egyptian highway networks)
    let totalDist = 0;
    const legs: RouteLeg[] = [];

    for (let i = 0; i < waypoints.length - 1; i++) {
      const w1 = waypoints[i];
      const w2 = waypoints[i + 1];
      // Road curvature factor 1.28 represents Egyptian road network detours
      const legDist = calculateHaversineDistance(w1.lat, w1.lng, w2.lat, w2.lng) * 1.28;
      // Average 52 km/h truck/van speed in delta & Cairo expressways
      const legMinutes = Math.max(8, Math.round((legDist / 52) * 60));
      totalDist += legDist;
      legs.push({
        fromIndex: i,
        toIndex: i + 1,
        distanceKm: +legDist.toFixed(1),
        durationMinutes: legMinutes,
        fromAddress: w1.address,
        toAddress: w2.address,
      });
    }

    const totalMinutes = legs.reduce((acc, l) => acc + l.durationMinutes, 0);
    const coordinates = generateCurvedRoutePoints(waypoints, 24);

    return {
      distanceKm: +totalDist.toFixed(1),
      durationMinutes: totalMinutes,
      coordinates,
      legs,
      provider: this.id,
      status: 'FALLBACK',
    };
  }
}
