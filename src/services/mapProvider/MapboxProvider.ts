import {
  MapProviderInterface,
  MapProviderId,
  MapTileConfig,
  GeocodeResult,
  RouteWaypoint,
  RouteResult,
} from './types';
import { LeafletOSMProvider } from './LeafletOSMProvider';

export class MapboxProvider implements MapProviderInterface {
  readonly id: MapProviderId = 'mapbox';
  readonly name = 'Mapbox GL Studio';
  readonly nameAr = 'محرك ماب بوكس العالمي Mapbox';
  readonly description =
    'High-performance commercial vector map service with customizable styling and Mapbox Directions API.';

  private fallbackProvider = new LeafletOSMProvider();
  private token: string;

  constructor(token?: string) {
    this.token =
      token ||
      (typeof import.meta !== 'undefined' && import.meta.env
        ? (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string) || ''
        : '');
  }

  hasValidCredentials(): boolean {
    return Boolean(this.token && this.token.startsWith('pk.'));
  }

  getTileConfig(theme: 'light' | 'dark'): MapTileConfig {
    if (this.hasValidCredentials()) {
      const style = theme === 'dark' ? 'mapbox/dark-v11' : 'mapbox/streets-v12';
      return {
        url: `https://api.mapbox.com/styles/v1/${style}/tiles/256/{z}/{x}/{y}@2x?access_token=${this.token}`,
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
      };
    }

    // Gracefully use fallback Carto/OSM tiles if user hasn't provided token yet
    return this.fallbackProvider.getTileConfig(theme);
  }

  async geocode(query: string): Promise<GeocodeResult[]> {
    if (!this.hasValidCredentials()) {
      return this.fallbackProvider.geocode(query);
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${this.token}&country=eg&limit=5`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return (data.features || []).map((feat: any) => ({
          id: feat.id,
          address: feat.place_name,
          city: feat.context?.find((c: any) => c.id.startsWith('place'))?.text || 'Egypt',
          lat: feat.center[1],
          lng: feat.center[0],
          type: feat.place_type?.[0],
        }));
      }
    } catch {
      // Fallback
    }

    return this.fallbackProvider.geocode(query);
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    if (!this.hasValidCredentials()) {
      return this.fallbackProvider.reverseGeocode(lat, lng);
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.token}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const feat = data.features?.[0];
        if (feat) {
          return {
            id: feat.id,
            address: feat.place_name,
            city: feat.context?.find((c: any) => c.id.startsWith('place'))?.text || 'Egypt',
            lat,
            lng,
          };
        }
      }
    } catch {
      // Fallback
    }

    return this.fallbackProvider.reverseGeocode(lat, lng);
  }

  async calculateRoute(waypoints: RouteWaypoint[]): Promise<RouteResult> {
    if (!this.hasValidCredentials() || waypoints.length < 2) {
      return this.fallbackProvider.calculateRoute(waypoints);
    }

    try {
      const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&steps=true&access_token=${this.token}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coordinates: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );
          const distanceKm = +(route.distance / 1000).toFixed(1);
          const durationMinutes = Math.round(route.duration / 60);
          const legs = (route.legs || []).map((leg: any, idx: number) => ({
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
            coordinates,
            legs,
            provider: this.id,
            status: 'OK',
          };
        }
      }
    } catch {
      // Fallback
    }

    return this.fallbackProvider.calculateRoute(waypoints);
  }
}
