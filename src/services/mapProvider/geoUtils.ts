import { PresetLocation, LatLng } from './types';

export const PRESET_EGYPT_LOCATIONS: PresetLocation[] = [
  {
    id: 'zagazig-central',
    nameEn: 'Zagazig Logistics Hub',
    nameAr: 'مركز الزقازيق اللوجستي',
    cityEn: 'Zagazig',
    cityAr: 'الزقازيق',
    addressEn: 'Al-Galaa Commercial Corridor, Zagazig',
    addressAr: 'ممر الجلاء التجاري، الزقازيق',
    lat: 30.5877,
    lng: 31.502,
    category: 'WAREHOUSE',
  },
  {
    id: 'ramadan-zone-b',
    nameEn: '10th of Ramadan Industrial Zone B',
    nameAr: 'العاشر من رمضان - المنطقة الصناعية B',
    cityEn: '10th of Ramadan',
    cityAr: 'العاشر من رمضان',
    addressEn: 'Industrial Zone B, Gate 4, Heavy Transport Bay',
    addressAr: 'المنطقة الصناعية ب، بوابة 4، رصيف النقل الثقيل',
    lat: 30.3015,
    lng: 31.7428,
    category: 'INDUSTRIAL',
  },
  {
    id: 'obour-market',
    nameEn: 'Obour Wholesale Transit Hub',
    nameAr: 'مجمع العبور للبضائع والترانزيت',
    cityEn: 'Obour City',
    cityAr: 'مدينة العبور',
    addressEn: 'Wholesale Market Ave, Sector 3, Obour',
    addressAr: 'طريق سوق الجملة، القطاع الثالث، العبور',
    lat: 30.2241,
    lng: 31.4725,
    category: 'COMMERCIAL',
  },
  {
    id: 'cairo-downtown',
    nameEn: 'Cairo Downtown Central Hub',
    nameAr: 'وسط البلد - مركز القاهرة الرئيسي',
    cityEn: 'Cairo',
    cityAr: 'القاهرة',
    addressEn: 'Tahrir Express Terminal, Downtown Cairo',
    addressAr: 'محطة التحرير السريع، وسط البلد، القاهرة',
    lat: 30.0444,
    lng: 31.2357,
    category: 'CENTRAL',
  },
  {
    id: 'nasr-city-cargo',
    nameEn: 'Nasr City Trade Hub',
    nameAr: 'مدينة نصر - مركز التوزيع التجاري',
    cityEn: 'Cairo',
    cityAr: 'القاهرة',
    addressEn: 'Makram Ebeid Logistics Point, Nasr City',
    addressAr: 'نقطة مكرم عبيد اللوجستية، مدينة نصر',
    lat: 30.0561,
    lng: 31.3418,
    category: 'COMMERCIAL',
  },
  {
    id: 'giza-distribution',
    nameEn: 'Giza Distribution Center',
    nameAr: 'مركز توزيع الجيزة والأهرامات',
    cityEn: 'Giza',
    cityAr: 'الجيزة',
    addressEn: 'Ring Road Exit 14, Giza Cargo Hub',
    addressAr: 'مخرج 14 الطريق الدائري، مجمع بضائع الجيزة',
    lat: 29.987,
    lng: 31.134,
    category: 'WAREHOUSE',
  },
  {
    id: 'october-industrial',
    nameEn: '6th of October Industrial Complex',
    nameAr: 'السادس من أكتوبر - المنطقة الصناعية',
    cityEn: '6th of October',
    cityAr: 'السادس من أكتوبر',
    addressEn: '3rd Industrial Zone, Warehouse Hub 9, 6th of October',
    addressAr: 'المنطقة الصناعية الثالثة، مجمع المستودعات 9، أكتوبر',
    lat: 29.9723,
    lng: 30.9388,
    category: 'INDUSTRIAL',
  },
  {
    id: 'alexandria-port',
    nameEn: 'Alexandria Maritime Cargo Gate',
    nameAr: 'ميناء الإسكندرية - بوابة الشحن البحري',
    cityEn: 'Alexandria',
    cityAr: 'الإسكندرية',
    addressEn: 'Customs Gate 22, Dekheila Port Expressway',
    addressAr: 'بوابة 22 جمارك، طريق الدخيلة السريع',
    lat: 31.1985,
    lng: 29.8944,
    category: 'PORT',
  },
];

/**
 * Great-circle distance between two points in km (Haversine formula)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
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

/**
 * Generates intermediate realistic road waypoint coordinates along road networks
 * using gentle curve perturbation between waypoints.
 */
export function generateCurvedRoutePoints(
  waypoints: LatLng[],
  pointsPerSegment = 20
): [number, number][] {
  if (waypoints.length === 0) return [];
  if (waypoints.length === 1) return [[waypoints[0].lat, waypoints[0].lng]];

  const result: [number, number][] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i];
    const end = waypoints[i + 1];

    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;

    // Slight perpendicular offset to simulate Egyptian highway curves (e.g. Ring road, Ismailia Desert road)
    const dLat = end.lat - start.lat;
    const dLng = end.lng - start.lng;
    const offsetFactor = (i % 2 === 0 ? 0.08 : -0.06);
    const ctrlLat = midLat - dLng * offsetFactor;
    const ctrlLng = midLng + dLat * offsetFactor;

    for (let step = 0; step <= pointsPerSegment; step++) {
      if (step === 0 && result.length > 0) continue; // Avoid duplicate joining points
      const t = step / pointsPerSegment;
      // Quadratic Bezier
      const lat =
        (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * ctrlLat + t * t * end.lat;
      const lng =
        (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * ctrlLng + t * t * end.lng;
      result.push([lat, lng]);
    }
  }

  return result;
}

/**
 * Decodes Google / OSRM encoded polyline string into [lat, lng] array
 */
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}
