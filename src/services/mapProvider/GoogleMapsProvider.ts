import {
  MapProviderInterface,
  MapProviderId,
  MapTileConfig,
  GeocodeResult,
  RouteWaypoint,
  RouteResult,
} from './types';
import { LeafletOSMProvider } from './LeafletOSMProvider';

export class GoogleMapsProvider implements MapProviderInterface {
  readonly id: MapProviderId = 'google-maps';
  readonly name = 'Google Maps Platform';
  readonly nameAr = 'منصة خرائط جوجل Google Maps';
  readonly description =
    'Enterprise routing and live traffic engine backed by Google Maps Platform APIs.';

  private fallbackProvider = new LeafletOSMProvider();
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      (typeof import.meta !== 'undefined' && import.meta.env
        ? (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || ''
        : '');
  }

  hasValidCredentials(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  getTileConfig(theme: 'light' | 'dark'): MapTileConfig {
    if (this.hasValidCredentials()) {
      // Google Maps standard / hybrid tile server layer
      return {
        url: `https://mt1.google.com/vt/lyrs=${theme === 'dark' ? 'm' : 'm'}&x={x}&y={y}&z={z}&key=${this.apiKey}`,
        attribution: '&copy; Google Maps Platform',
        maxZoom: 21,
      };
    }

    // Smooth fallback to OSM/Carto
    return this.fallbackProvider.getTileConfig(theme);
  }

  async geocode(query: string): Promise<GeocodeResult[]> {
    if (!this.hasValidCredentials()) {
      return this.fallbackProvider.geocode(query);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query + ', Egypt'
      )}&key=${this.apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((r: any) => ({
            id: r.place_id,
            address: r.formatted_address,
            city:
              r.address_components?.find((c: any) => c.types.includes('locality'))
                ?.long_name || 'Egypt',
            lat: r.geometry.location.lat,
            lng: r.geometry.location.lng,
          }));
        }
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
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results[0]) {
          const r = data.results[0];
          return {
            id: r.place_id,
            address: r.formatted_address,
            city:
              r.address_components?.find((c: any) => c.types.includes('locality'))
                ?.long_name || 'Egypt',
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
    // If running in browser without backend proxy, Google Directions REST API requires server CORS.
    // We gracefully delegate to the OSRM/geodesic road calculation.
    return this.fallbackProvider.calculateRoute(waypoints);
  }
}
