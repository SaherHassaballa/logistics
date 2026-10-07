import { StopType } from '../../types';

export type MapProviderId = 'leaflet-osm' | 'mapbox' | 'google-maps';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteWaypoint extends LatLng {
  id?: string;
  sequence?: number;
  title?: string;
  address?: string;
  type?: StopType;
}

export interface RouteLeg {
  fromIndex: number;
  toIndex: number;
  distanceKm: number;
  durationMinutes: number;
  fromAddress?: string;
  toAddress?: string;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng]
  legs: RouteLeg[];
  provider: MapProviderId;
  status: 'OK' | 'FALLBACK';
}

export interface GeocodeResult {
  id: string;
  address: string;
  addressAr?: string;
  city: string;
  lat: number;
  lng: number;
  type?: string;
}

export interface MapTileConfig {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
}

export interface MapProviderInterface {
  id: MapProviderId;
  name: string;
  nameAr: string;
  description: string;
  hasValidCredentials(): boolean;
  getTileConfig(theme: 'light' | 'dark'): MapTileConfig;
  geocode(query: string): Promise<GeocodeResult[]>;
  reverseGeocode(lat: number, lng: number): Promise<GeocodeResult>;
  calculateRoute(waypoints: RouteWaypoint[]): Promise<RouteResult>;
}

export interface PresetLocation {
  id: string;
  nameEn: string;
  nameAr: string;
  cityEn: string;
  cityAr: string;
  addressEn: string;
  addressAr: string;
  lat: number;
  lng: number;
  category: 'WAREHOUSE' | 'INDUSTRIAL' | 'COMMERCIAL' | 'PORT' | 'CENTRAL';
}
