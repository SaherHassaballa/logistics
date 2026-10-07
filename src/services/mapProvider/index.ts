import {
  MapProviderId,
  MapProviderInterface,
  PresetLocation,
  GeocodeResult,
} from './types';
import { LeafletOSMProvider } from './LeafletOSMProvider';
import { MapboxProvider } from './MapboxProvider';
import { GoogleMapsProvider } from './GoogleMapsProvider';
import { PRESET_EGYPT_LOCATIONS } from './geoUtils';

export * from './types';
export * from './geoUtils';
export { LeafletOSMProvider } from './LeafletOSMProvider';
export { MapboxProvider } from './MapboxProvider';
export { GoogleMapsProvider } from './GoogleMapsProvider';

const STORAGE_KEY_PROVIDER = 'req_delivery_map_provider';
const STORAGE_KEY_SAVED_ADDR = 'req_delivery_saved_addresses';
const STORAGE_KEY_RECENT_ADDR = 'req_delivery_recent_addresses';

export function getActiveProviderId(): MapProviderId {
  if (typeof window === 'undefined') return 'leaflet-osm';
  const saved = localStorage.getItem(STORAGE_KEY_PROVIDER) as MapProviderId;
  if (saved && ['leaflet-osm', 'mapbox', 'google-maps'].includes(saved)) {
    return saved;
  }
  return 'leaflet-osm';
}

export function setActiveProviderId(id: MapProviderId): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PROVIDER, id);
  }
}

export function getMapProvider(
  id?: MapProviderId,
  customToken?: string
): MapProviderInterface {
  const chosenId = id || getActiveProviderId();
  switch (chosenId) {
    case 'mapbox':
      return new MapboxProvider(customToken);
    case 'google-maps':
      return new GoogleMapsProvider(customToken);
    case 'leaflet-osm':
    default:
      return new LeafletOSMProvider();
  }
}

export function getSavedAddresses(): GeocodeResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_ADDR);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return PRESET_EGYPT_LOCATIONS.slice(0, 3).map((p) => ({
    id: p.id,
    address: p.addressEn,
    addressAr: p.addressAr,
    city: p.cityEn,
    lat: p.lat,
    lng: p.lng,
    type: p.category,
  }));
}

export function saveAddress(addr: GeocodeResult): void {
  if (typeof window === 'undefined') return;
  const current = getSavedAddresses();
  if (!current.some((c) => c.id === addr.id || (c.lat === addr.lat && c.lng === addr.lng))) {
    const updated = [addr, ...current].slice(0, 8);
    localStorage.setItem(STORAGE_KEY_SAVED_ADDR, JSON.stringify(updated));
  }
}

export function getRecentAddresses(): GeocodeResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT_ADDR);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return PRESET_EGYPT_LOCATIONS.slice(1, 4).map((p) => ({
    id: p.id,
    address: p.addressEn,
    addressAr: p.addressAr,
    city: p.cityEn,
    lat: p.lat,
    lng: p.lng,
    type: p.category,
  }));
}

export function recordRecentAddress(addr: GeocodeResult): void {
  if (typeof window === 'undefined') return;
  const current = getRecentAddresses();
  const filtered = current.filter(
    (c) => !(c.lat === addr.lat && c.lng === addr.lng)
  );
  const updated = [addr, ...filtered].slice(0, 6);
  localStorage.setItem(STORAGE_KEY_RECENT_ADDR, JSON.stringify(updated));
}
