import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Search,
  Crosshair,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Clock,
  Compass,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Settings,
  X,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryStop, VehicleCategory } from '../../types';
import {
  getMapProvider,
  getActiveProviderId,
  setActiveProviderId,
  MapProviderId,
  RouteResult,
  GeocodeResult,
  PRESET_EGYPT_LOCATIONS,
  getSavedAddresses,
  getRecentAddresses,
  recordRecentAddress,
  saveAddress,
} from '../../services/mapProvider';

export interface RealInteractiveMapProps {
  stops: DeliveryStop[];
  onStopsChange?: (stops: DeliveryStop[]) => void;
  selectedStopIndex?: number;
  onSelectStopIndex?: (index: number) => void;
  driverCoords?: { lat: number; lng: number };
  vehicleType?: VehicleCategory;
  driverName?: string;
  isMoving?: boolean;
  statusText?: string;
  className?: string;
  readOnly?: boolean;
  heightClass?: string;
}

export const RealInteractiveMap: React.FC<RealInteractiveMapProps> = ({
  stops = [],
  onStopsChange,
  selectedStopIndex,
  onSelectStopIndex,
  driverCoords,
  vehicleType = 'PICKUP',
  driverName = 'Ahmed Hassan',
  isMoving = false,
  statusText,
  className = '',
  readOnly = false,
  heightClass = 'h-[440px]',
}) => {
  const { theme, language } = useApp();
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  const [providerId, setProviderId] = useState<MapProviderId>(getActiveProviderId());
  const [providerSettingsOpen, setProviderSettingsOpen] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [isDropPinMode, setIsDropPinMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Map Provider Instance
  const provider = getMapProvider(providerId, customKeyInput);

  // Initialize Map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center on Cairo / Nile Delta region
    const initialLat = stops.length > 0 ? stops[0].lat : 30.25;
    const initialLng = stops.length > 0 ? stops[0].lng : 31.4;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    const tileConfig = provider.getTileConfig(isDark ? 'dark' : 'light');
    const tileLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains || ['a', 'b', 'c'],
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Track mouse coordinates for pinpoint inspection
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setMouseCoords({
        lat: +e.latlng.lat.toFixed(5),
        lng: +e.latlng.lng.toFixed(5),
      });
    });

    // Map click handler for location dropping
    map.on('click', async (e: L.LeafletMouseEvent) => {
      if (readOnly || !onStopsChange) return;

      const clickedLat = +e.latlng.lat.toFixed(5);
      const clickedLng = +e.latlng.lng.toFixed(5);

      try {
        const rev = await provider.reverseGeocode(clickedLat, clickedLng);

        if (selectedStopIndex !== undefined && stops[selectedStopIndex]) {
          // Update selected stop
          const updated = [...stops];
          updated[selectedStopIndex] = {
            ...updated[selectedStopIndex],
            lat: clickedLat,
            lng: clickedLng,
            address: rev.address,
            addressAr: rev.addressAr,
            city: rev.city,
          };
          onStopsChange(updated);
        } else if (stops.length < 5) {
          // Add as new stop
          const newStop: DeliveryStop = {
            id: `stop-${Date.now()}`,
            type: stops.length === 0 ? 'PICKUP' : 'DROPOFF',
            sequence: stops.length,
            title: `Stop ${stops.length + 1}`,
            address: rev.address,
            addressAr: rev.addressAr,
            city: rev.city,
            lat: clickedLat,
            lng: clickedLng,
            contactName: isAr ? 'مسؤول الاستلام' : 'Recipient Lead',
            contactPhone: '+20 100 000 0000',
          };
          onStopsChange([...stops, newStop]);
        }
      } catch (err) {
        console.error('Reverse geocode error on click:', err);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [providerId, isDark]);

  // Update Tile Layer if theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const tileConfig = provider.getTileConfig(isDark ? 'dark' : 'light');
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileConfig.url);
    }
  }, [isDark, providerId]);

  // Recalculate route whenever stops change
  useEffect(() => {
    let isCancelled = false;

    async function updateRoute() {
      if (stops.length < 2) {
        setRouteData(null);
        if (routePolylineRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(routePolylineRef.current);
          routePolylineRef.current = null;
        }
        return;
      }

      setIsRouting(true);
      try {
        const waypoints = stops.map((s) => ({
          id: s.id,
          lat: s.lat,
          lng: s.lng,
          address: s.address,
          type: s.type,
        }));
        const result = await provider.calculateRoute(waypoints);
        if (!isCancelled) {
          setRouteData(result);
        }
      } catch (e) {
        console.error('Route calculation error:', e);
      } finally {
        if (!isCancelled) {
          setIsRouting(false);
        }
      }
    }

    updateRoute();

    return () => {
      isCancelled = true;
    };
  }, [stops, providerId]);

  // Draw Stops Markers & Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (stops.length === 0) return;

    const latLngBounds: [number, number][] = [];

    stops.forEach((stop, index) => {
      const isPickup = index === 0;
      const isFinalDropoff = index === stops.length - 1 && stops.length > 1;
      const isSelected = selectedStopIndex === index;

      latLngBounds.push([stop.lat, stop.lng]);

      // Custom HTML Marker Element
      const markerColor = isPickup
        ? '#10b981' // Green
        : isFinalDropoff
        ? '#0284c7' // Cyan/Sky
        : '#f59e0b'; // Amber for intermediate stops

      const badgeText = isPickup
        ? (isAr ? 'بدء' : 'P')
        : isFinalDropoff
        ? (isAr ? 'هدف' : 'D')
        : `${index}`;

      const iconHtml = `
        <div class="custom-map-marker relative group flex items-center justify-center">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg border-2 ${
            isSelected ? 'border-white ring-4 ring-sky-500 scale-110' : 'border-white/90'
          }" style="background-color: ${markerColor}">
            ${badgeText}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45" style="background-color: ${markerColor}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-div-icon',
        html: iconHtml,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([stop.lat, stop.lng], {
        icon: customIcon,
        draggable: !readOnly,
      });

      // Draggable marker logic (User moves pin manually)
      marker.on('dragend', async (e: any) => {
        if (readOnly || !onStopsChange) return;
        const newPos = e.target.getLatLng();
        const newLat = +newPos.lat.toFixed(5);
        const newLng = +newPos.lng.toFixed(5);

        try {
          const rev = await provider.reverseGeocode(newLat, newLng);
          const updated = [...stops];
          updated[index] = {
            ...updated[index],
            lat: newLat,
            lng: newLng,
            address: rev.address,
            addressAr: rev.addressAr,
            city: rev.city,
          };
          onStopsChange(updated);
        } catch (err) {
          console.error('Error on pin dragend reverse geocode:', err);
        }
      });

      // Marker click selects stop
      marker.on('click', () => {
        if (onSelectStopIndex) {
          onSelectStopIndex(index);
        }
      });

      // Popup with Stop info
      marker.bindPopup(`
        <div class="p-2 min-w-[200px] text-xs">
          <div class="font-bold flex items-center gap-1.5 mb-1 ${
            isPickup ? 'text-emerald-500' : isFinalDropoff ? 'text-sky-500' : 'text-amber-500'
          }">
            <span>${isPickup ? (isAr ? 'نقطة التحميل' : 'Pickup Point') : isFinalDropoff ? (isAr ? 'نقطة التسليم النهائية' : 'Final Destination') : (isAr ? `توقف ${index}` : `Stop ${index}`)}</span>
          </div>
          <div class="font-medium text-slate-800 dark:text-slate-100 line-clamp-2">${stop.address}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">${stop.lat.toFixed(4)}, ${stop.lng.toFixed(4)}</div>
          ${stop.contactName ? `<div class="mt-1 text-slate-600 dark:text-slate-300 font-medium">${stop.contactName} (${stop.contactPhone})</div>` : ''}
          ${!readOnly ? `<div class="mt-2 text-[10px] text-sky-600 dark:text-sky-400 font-semibold">${isAr ? 'اسحب الدبوس لتعديل الموقع' : 'Drag pin to re-position'}</div>` : ''}
        </div>
      `);

      markersGroup.addLayer(marker);
    });

    // Draw Route Polyline
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (routeData && routeData.coordinates.length > 1) {
      const polyline = L.polyline(routeData.coordinates, {
        color: isDark ? '#38bdf8' : '#0284c7',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit map view smoothly to full route bounds
      if (latLngBounds.length > 0) {
        map.fitBounds(L.latLngBounds(latLngBounds), {
          padding: [50, 50],
          maxZoom: 14,
        });
      }
    } else if (latLngBounds.length > 0) {
      map.fitBounds(L.latLngBounds(latLngBounds), {
        padding: [60, 60],
        maxZoom: 13,
      });
    }
  }, [stops, routeData, selectedStopIndex, readOnly, isDark, isAr]);

  // Live Driver Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (driverMarkerRef.current) {
      map.removeLayer(driverMarkerRef.current);
      driverMarkerRef.current = null;
    }

    if (driverCoords) {
      const driverHtml = `
        <div class="relative flex items-center justify-center animate-pulse">
          <div class="w-10 h-10 rounded-full bg-cyan-500 text-white shadow-xl flex items-center justify-center border-2 border-white">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <div class="absolute -top-6 whitespace-nowrap bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow">
            ${driverName}
          </div>
        </div>
      `;

      const driverIcon = L.divIcon({
        className: 'driver-live-icon',
        html: driverHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const dMarker = L.marker([driverCoords.lat, driverCoords.lng], {
        icon: driverIcon,
      }).addTo(map);

      driverMarkerRef.current = dMarker;
    }
  }, [driverCoords, driverName]);

  // Recenter to stops / current location
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      mapInstanceRef.current.setView([30.25, 31.4], 10);
    }
  };

  // Current Geolocation Button
  const handleFindCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(isAr ? 'خدمة تحديد الموقع غير مفعلة في المتصفح' : 'Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = +pos.coords.latitude.toFixed(5);
        const lng = +pos.coords.longitude.toFixed(5);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
        }

        if (!readOnly && onStopsChange) {
          const rev = await provider.reverseGeocode(lat, lng);
          if (selectedStopIndex !== undefined && stops[selectedStopIndex]) {
            const updated = [...stops];
            updated[selectedStopIndex] = {
              ...updated[selectedStopIndex],
              lat,
              lng,
              address: rev.address,
              city: rev.city,
            };
            onStopsChange(updated);
          } else if (stops.length === 0) {
            onStopsChange([
              {
                id: `curr-${Date.now()}`,
                type: 'PICKUP',
                sequence: 0,
                title: isAr ? 'موقعي الحالي' : 'My Current Location',
                address: rev.address,
                city: rev.city,
                lat,
                lng,
                contactName: 'Current User',
                contactPhone: '+20 100 000 0000',
              },
            ]);
          }
        }
      },
      () => {
        // Fallback default: fly to Cairo Tahrir
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([30.0444, 31.2357], 13);
        }
      },
      { timeout: 7000 }
    );
  };

  // Search Geocoding Autocomplete
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchDropdown(true);
    try {
      const results = await provider.geocode(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Geocode search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: GeocodeResult) => {
    recordRecentAddress(result);
    setSearchQuery(result.address);
    setShowSearchDropdown(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([result.lat, result.lng], 14, { duration: 1 });
    }

    if (!readOnly && onStopsChange) {
      if (selectedStopIndex !== undefined && stops[selectedStopIndex]) {
        const updated = [...stops];
        updated[selectedStopIndex] = {
          ...updated[selectedStopIndex],
          lat: result.lat,
          lng: result.lng,
          address: result.address,
          addressAr: result.addressAr,
          city: result.city,
        };
        onStopsChange(updated);
      } else if (stops.length < 5) {
        onStopsChange([
          ...stops,
          {
            id: `stop-${Date.now()}`,
            type: stops.length === 0 ? 'PICKUP' : 'DROPOFF',
            sequence: stops.length,
            title: result.city,
            address: result.address,
            addressAr: result.addressAr,
            city: result.city,
            lat: result.lat,
            lng: result.lng,
            contactName: isAr ? 'مسؤول الموقع' : 'Site Lead',
            contactPhone: '+20 100 000 0000',
          },
        ]);
      }
    }
  };

  const handleSelectPreset = (preset: (typeof PRESET_EGYPT_LOCATIONS)[0]) => {
    setShowPresetsMenu(false);
    handleSelectSearchResult({
      id: preset.id,
      address: isAr ? preset.addressAr : preset.addressEn,
      addressAr: preset.addressAr,
      city: isAr ? preset.cityAr : preset.cityEn,
      lat: preset.lat,
      lng: preset.lng,
      type: preset.category,
    });
  };

  const handleCopyCoords = () => {
    if (!mouseCoords) return;
    navigator.clipboard.writeText(`${mouseCoords.lat}, ${mouseCoords.lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleSwitchProvider = (newId: MapProviderId) => {
    setProviderId(newId);
    setActiveProviderId(newId);
    setProviderSettingsOpen(false);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col ${heightClass} ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-full' : ''
      }`}
    >
      {/* Top Map Action Bar */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Geocoding Search & Presets */}
        <div className="flex items-center gap-2 pointer-events-auto max-w-sm sm:max-w-md w-full relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 relative flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 dark:border-slate-700 px-3 py-1.5"
          >
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 2) handleSearchSubmit();
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={
                isAr
                  ? 'ابحث عن عنوان، مستودع، مدينة...'
                  : 'Search location, warehouse, address...'
              }
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {isSearching && (
              <div className="w-3.5 h-3.5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </form>

          {/* Quick Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="px-2.5 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title={isAr ? 'عناوين ومستودعات جاهزة' : 'Egyptian Logistics Hubs'}
            >
              <Compass className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">{isAr ? 'المستودعات' : 'Hubs'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPresetsMenu && (
              <div className="absolute top-full mt-1.5 right-0 sm:left-0 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-30 animate-fade-in max-h-72 overflow-y-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  {isAr ? 'مستودعات الشحن الرئيسية في مصر' : 'Egyptian Freight Hubs'}
                </div>
                {PRESET_EGYPT_LOCATIONS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {isAr ? preset.nameAr : preset.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {isAr ? preset.addressAr : preset.addressEn}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Map Toolbar Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Provider Badge / Switcher */}
          <button
            onClick={() => setProviderSettingsOpen(true)}
            className="px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:border-sky-500 transition"
            title={isAr ? 'إعدادات محرك الخرائط' : 'Map Provider Settings'}
          >
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden md:inline text-[11px] font-mono">
              {providerId === 'leaflet-osm' ? 'OSM/OSRM' : providerId === 'mapbox' ? 'Mapbox' : 'Google Maps'}
            </span>
          </button>

          {/* Current Location button */}
          <button
            onClick={handleFindCurrentLocation}
            className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:text-sky-500 transition"
            title={isAr ? 'موقعي الحالي' : 'My Current Location'}
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Recenter button */}
          <button
            onClick={handleRecenter}
            className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:text-sky-500 transition"
            title={isAr ? 'إعادة ضبط العرض' : 'Recenter Route Bounds'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:text-sky-500 transition"
            title={isAr ? 'ملء الشاشة' : 'Toggle Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Autocomplete Search Dropdown */}
      {showSearchDropdown && searchResults.length > 0 && (
        <div className="absolute top-16 left-3 z-30 max-w-sm sm:max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 animate-fade-in max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isAr ? 'نتائج البحث الجغرافي' : 'Search Results'}
            </span>
            <button
              onClick={() => setShowSearchDropdown(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {searchResults.map((res) => (
            <button
              key={res.id}
              onClick={() => handleSelectSearchResult(res)}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div className="truncate">
                <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {res.address}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {res.lat.toFixed(4)}, {res.lng.toFixed(4)} • {res.city}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Actual Leaflet Map Canvas Div */}
      <div ref={mapContainerRef} className="w-full h-full relative z-0" />

      {/* Bottom Live Route & Stats Telemetry Bar */}
      <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-none flex flex-wrap items-end justify-between gap-2">
        {/* Route Stats Card */}
        {routeData && (
          <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center gap-4 text-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  {isAr ? 'إجمالي المسافة' : 'Total Distance'}
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {routeData.distanceKm} km
                </div>
              </div>
            </div>

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  {isAr ? 'زمن الرحلة' : 'Driving Time'}
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {Math.floor(routeData.durationMinutes / 60) > 0
                    ? `${Math.floor(routeData.durationMinutes / 60)}h ${
                        routeData.durationMinutes % 60
                      }m`
                    : `${routeData.durationMinutes} min`}
                </div>
              </div>
            </div>

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  {isAr ? 'عدد المحطات' : 'Stops Count'}
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {stops.length} {isAr ? 'محطات' : 'Stops'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Pinpoint Coordinates & Precision HUD */}
        <div className="pointer-events-auto bg-slate-950/85 text-white backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-mono flex items-center gap-2 shadow-lg">
          <span className="text-slate-400">GPS:</span>
          <span>
            {mouseCoords
              ? `${mouseCoords.lat.toFixed(4)}, ${mouseCoords.lng.toFixed(4)}`
              : stops.length > 0
              ? `${stops[0].lat.toFixed(4)}, ${stops[0].lng.toFixed(4)}`
              : '30.2500, 31.4000'}
          </span>
          <button
            onClick={handleCopyCoords}
            className="text-slate-400 hover:text-white transition ml-1"
            title={isAr ? 'نسخ الإحداثيات' : 'Copy GPS coordinates'}
          >
            {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Provider Architecture Modal */}
      {providerSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setProviderSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? 'محرك الخرائط والملاحة' : 'Map Provider Architecture'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr
                    ? 'تبديل مزود الخرائط وتخصيص مفاتيح واجهة البرمجة'
                    : 'Switch map provider abstraction and API credentials'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {/* Option 1: Leaflet OpenStreetMap */}
              <div
                onClick={() => handleSwitchProvider('leaflet-osm')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                  providerId === 'leaflet-osm'
                    ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>OpenStreetMap & OSRM</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                      ACTIVE & FREE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Live road routing and geocoding with zero API key requirement. Works completely out-of-the-box.
                  </p>
                </div>
                {providerId === 'leaflet-osm' && (
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                )}
              </div>

              {/* Option 2: Mapbox */}
              <div
                onClick={() => handleSwitchProvider('mapbox')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                  providerId === 'mapbox'
                    ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Mapbox GL Studio</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                      VITE_MAPBOX_ACCESS_TOKEN
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    High precision vector styling & commercial navigation directions API.
                  </p>
                </div>
                {providerId === 'mapbox' && (
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                )}
              </div>

              {/* Option 3: Google Maps */}
              <div
                onClick={() => handleSwitchProvider('google-maps')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                  providerId === 'google-maps'
                    ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Google Maps Platform</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                      VITE_GOOGLE_MAPS_API_KEY
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Google Maps directions, address autocomplete and enterprise road telemetry.
                  </p>
                </div>
                {providerId === 'google-maps' && (
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                )}
              </div>
            </div>

            {/* Custom Key Tester Input */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 mb-5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'مفتاح الاعتماد التجريبي (اختياري)' : 'Optional Live API Key / Access Token'}
              </label>
              <input
                type="password"
                placeholder={providerId === 'mapbox' ? 'pk.eyJ1...' : 'AIzaSy...'}
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                {isAr
                  ? 'يتم حفظ المفاتيح محلياً فقط ولا يتم إرسالها إلى الخادم.'
                  : 'Tokens stay client-side only and are never exposed unsafely.'}
              </p>
            </div>

            <button
              onClick={() => setProviderSettingsOpen(false)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition"
            >
              {isAr ? 'حفظ وإغلاق' : 'Apply & Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
