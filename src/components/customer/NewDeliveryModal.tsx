import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Package,
  Truck,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Navigation,
  Edit2,
  Sliders,
  TrendingDown,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { defaultAIProvider } from '../../services/aiProvider';
import { VEHICLE_CATALOG } from '../../data/mockData';
import { VehicleCategory, ShipmentCategory, DeliveryStop, StopType } from '../../types';
import { RealInteractiveMap } from '../common/RealInteractiveMap';
import { PRESET_EGYPT_LOCATIONS } from '../../services/mapProvider/geoUtils';
import { calculateHaversineDistance } from '../../services/mapProvider/geoUtils';

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewDeliveryModal: React.FC<NewDeliveryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { language, createDeliveryRequest } = useApp();
  const isAr = language === 'ar';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Multi-Stop Route State
  const [stops, setStops] = useState<DeliveryStop[]>([
    {
      id: 'stop-pickup-default',
      type: 'PICKUP',
      sequence: 0,
      title: 'Zagazig Warehouse Hub',
      address: 'Al-Galaa Commercial Corridor, Zagazig',
      city: 'Zagazig',
      lat: 30.5877,
      lng: 31.502,
      contactName: 'Ahmed Mostafa',
      contactPhone: '+20 100 448 9120',
      instructions: 'Gate 2 Loading Bay, pallet jack on site',
      packageAction: 'Pick up 2 pallets furniture',
    },
    {
      id: 'stop-ramadan-default',
      type: 'WAYPOINT',
      sequence: 1,
      title: '10th of Ramadan Stop',
      address: 'Industrial Zone B, Gate 4, Heavy Transport Bay',
      city: '10th of Ramadan',
      lat: 30.3015,
      lng: 31.7428,
      contactName: 'Tarek Ibrahim',
      contactPhone: '+20 115 889 2011',
      instructions: 'Drop off 1 crate and get receipt stamped',
      packageAction: 'Partial drop-off (1 crate)',
    },
    {
      id: 'stop-dest-default',
      type: 'DROPOFF',
      sequence: 2,
      title: 'Cairo Central Trade Depot',
      address: 'Tahrir Express Terminal, Downtown Cairo',
      city: 'Cairo',
      lat: 30.0444,
      lng: 31.2357,
      contactName: 'Mohamed El-Sayed',
      contactPhone: '+20 112 901 4489',
      instructions: 'Final destination receiver desk',
      packageAction: 'Deliver remaining goods and collect signature',
    },
  ]);

  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0);
  const [editingStop, setEditingStop] = useState<DeliveryStop | null>(null);

  // Cargo Specifications
  const [category, setCategory] = useState<ShipmentCategory>('FURNITURE');
  const [description, setDescription] = useState('Living room sofa set, 2 armchairs and commercial hardware');
  const [weightKg, setWeightKg] = useState<number>(280);
  const [quantity, setQuantity] = useState<number>(3);
  const [fragile, setFragile] = useState<boolean>(true);
  const [helperNeeded, setHelperNeeded] = useState<boolean>(true);
  const [refrigerated, setRefrigerated] = useState<boolean>(false);
  const [waterproof, setWaterproof] = useState<boolean>(true);

  // Vehicle & AI Recommendation
  const [recommendedVehicle, setRecommendedVehicle] = useState<VehicleCategory>('PICKUP');
  const [aiReasoning, setAiReasoning] = useState<string>('Multi-stop bulky cargo requires flatbed pickup with tie-down straps.');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>('PICKUP');

  // Pricing & Direct Marketplace Offer
  const [routeStats, setRouteStats] = useState({
    distanceKm: 92.4,
    drivingMinutes: 105, // 1h 45m
  });
  const [suggestedMinPrice, setSuggestedMinPrice] = useState<number>(350);
  const [suggestedMaxPrice, setSuggestedMaxPrice] = useState<number>(450);
  const [customerOfferPrice, setCustomerOfferPrice] = useState<number>(400);

  // Dynamically calculate route distance & driving time whenever stops change
  useEffect(() => {
    if (stops.length < 2) return;
    let dist = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      dist += calculateHaversineDistance(stops[i].lat, stops[i].lng, stops[i + 1].lat, stops[i + 1].lng) * 1.28;
    }
    const roundedDist = +dist.toFixed(1);
    const estMinutes = Math.round((roundedDist / 50) * 60) + (stops.length - 2) * 15; // 15 mins per intermediate stop

    setRouteStats({
      distanceKm: roundedDist,
      drivingMinutes: estMinutes,
    });

    // Recalculate dynamic pricing range: Base fare + perKm * distance + multi-stop surcharge
    const spec = VEHICLE_CATALOG.find((v) => v.id === selectedVehicle) || VEHICLE_CATALOG[4];
    const baseCalc = spec.baseFareEgp + spec.perKmEgp * roundedDist + (stops.length - 2) * 40;
    const minP = Math.max(100, Math.round(baseCalc * 0.9));
    const maxP = Math.round(baseCalc * 1.15);
    const median = Math.round((minP + maxP) / 2);

    setSuggestedMinPrice(minP);
    setSuggestedMaxPrice(maxP);
    setCustomerOfferPrice(median);
  }, [stops, selectedVehicle]);

  // Handle Adding a Stop
  const handleAddStop = () => {
    if (stops.length >= 6) return;
    const defaultHub = PRESET_EGYPT_LOCATIONS[stops.length % PRESET_EGYPT_LOCATIONS.length];
    const newSeq = stops.length;
    const newStop: DeliveryStop = {
      id: `stop-${Date.now()}`,
      type: 'WAYPOINT',
      sequence: newSeq,
      title: isAr ? `محطة إضافية ${newSeq}` : `Additional Stop ${newSeq}`,
      address: isAr ? defaultHub.addressAr : defaultHub.addressEn,
      city: isAr ? defaultHub.cityAr : defaultHub.cityEn,
      lat: defaultHub.lat,
      lng: defaultHub.lng,
      contactName: 'Site Supervisor',
      contactPhone: '+20 100 000 0000',
      instructions: 'Deliver parcels and obtain sign-off',
      packageAction: 'Drop-off / Inspection',
    };

    // Make the previous destination into a waypoint and this one the new destination or intermediate
    const updated = [...stops];
    // Keep first as PICKUP, last as DROPOFF, middle as WAYPOINT
    updated.splice(updated.length - 1, 0, newStop);
    const reordered = updated.map((s, idx) => ({
      ...s,
      sequence: idx,
      type: idx === 0 ? 'PICKUP' : idx === updated.length - 1 ? 'DROPOFF' : ('WAYPOINT' as StopType),
    }));
    setStops(reordered);
    setSelectedStopIndex(reordered.length - 2);
  };

  // Handle Removing a Stop
  const handleRemoveStop = (indexToRemove: number) => {
    if (stops.length <= 2) {
      alert(isAr ? 'يجب أن يحتوي الطلب على نقطة تحميل ونقطة تسليم كحد أدنى' : 'Delivery requires at least a pickup and a destination.');
      return;
    }
    const filtered = stops.filter((_, idx) => idx !== indexToRemove);
    const reordered = filtered.map((s, idx) => ({
      ...s,
      sequence: idx,
      type: idx === 0 ? 'PICKUP' : idx === filtered.length - 1 ? 'DROPOFF' : ('WAYPOINT' as StopType),
    }));
    setStops(reordered);
    setSelectedStopIndex(Math.max(0, indexToRemove - 1));
  };

  // Handle Reordering Stops (Move Up / Down)
  const handleMoveStop = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const copy = [...stops];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = copy.map((s, idx) => ({
      ...s,
      sequence: idx,
      type: idx === 0 ? 'PICKUP' : idx === copy.length - 1 ? 'DROPOFF' : ('WAYPOINT' as StopType),
    }));
    setStops(reordered);
    setSelectedStopIndex(targetIndex);
  };

  // Proceed to Step 3 with AI Vehicle Recommendation
  const handleProceedToVehicle = async () => {
    try {
      const rec = await defaultAIProvider.recommendVehicle({
        category,
        weightKg,
      });
      setRecommendedVehicle(rec.recommendedVehicle);
      setSelectedVehicle(rec.recommendedVehicle);
      setAiReasoning(rec.reasoning);
    } catch (e) {
      console.error(e);
    }
    setStep(3);
  };

  // Submit Final Request into Marketplace
  const handleSubmitRequest = () => {
    const pickupStop = stops[0];
    const dropoffStop = stops[stops.length - 1];

    createDeliveryRequest({
      customerName: pickupStop.contactName || 'Ahmed Mostafa',
      customerPhone: pickupStop.contactPhone || '+20 100 448 9120',
      pickup: {
        address: pickupStop.address,
        addressAr: pickupStop.addressAr,
        city: pickupStop.city,
        lat: pickupStop.lat,
        lng: pickupStop.lng,
        contactName: pickupStop.contactName,
        contactPhone: pickupStop.contactPhone,
        notes: pickupStop.instructions,
      },
      dropoff: {
        address: dropoffStop.address,
        addressAr: dropoffStop.addressAr,
        city: dropoffStop.city,
        lat: dropoffStop.lat,
        lng: dropoffStop.lng,
        contactName: dropoffStop.contactName,
        contactPhone: dropoffStop.contactPhone,
        notes: dropoffStop.instructions,
      },
      stops,
      shipmentCategory: category,
      description,
      weightKg,
      quantity,
      specialHandling: {
        fragile,
        helperRequired: helperNeeded,
        refrigeration: refrigerated,
        waterproof,
      },
      recommendedVehicle,
      selectedVehicle,
      estimatedPrice: Math.round((suggestedMinPrice + suggestedMaxPrice) / 2),
      customerOfferPrice,
      distanceKm: routeStats.distanceKm,
      estimatedDrivingMinutes: routeStats.drivingMinutes,
      pricingMode: 'CUSTOMER_OFFER',
    });

    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isAr ? 'طلب شحن جديد بنظام التفاوض' : 'New Direct Delivery Request'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'خط سير متعدد المحطات • حدد سعرك • تفاوض مباشرة مع السائقين'
                  : 'Multi-Stop Route • Set Your Price • Negotiate Directly with Drivers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
          {[
            { s: 1, title: isAr ? '1. خط السير والمحطات' : '1. Multi-Stop Route' },
            { s: 2, title: isAr ? '2. تفاصيل البضاعة' : '2. Cargo Details' },
            { s: 3, title: isAr ? '3. نوع المركبة' : '3. Vehicle & Specs' },
            { s: 4, title: isAr ? '4. عرض السعر والتفاوض' : '4. Price & Offer' },
          ].map((item) => (
            <div
              key={item.s}
              className={`flex items-center gap-1.5 font-bold ${
                step === item.s
                  ? 'text-sky-600 dark:text-sky-400'
                  : step > item.s
                  ? 'text-emerald-500'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  step === item.s
                    ? 'bg-sky-600 text-white'
                    : step > item.s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step > item.s ? <Check className="w-3.5 h-3.5" /> : item.s}
              </div>
              <span className="hidden sm:inline">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* ================= STEP 1: MULTI-STOP ROUTE & REAL MAP ================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span>{isAr ? 'محطات التسليم وخط السير التفاعلي' : 'Interactive Multi-Stop Routing'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr
                      ? 'يمكنك سحب الدبابيس على الخريطة، إعادة ترتيب المحطات، وإضافة نقاط تفريغ متعددة'
                      : 'Drag map pins, reorder waypoints, and add multiple pickup or dropoff stops.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStop}
                  disabled={stops.length >= 6}
                  className="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-sky-200 dark:border-sky-500/30 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? '+ إضافة محطة' : '+ Add Stop'}</span>
                </button>
              </div>

              {/* Real Interactive Map Component */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                <RealInteractiveMap
                  stops={stops}
                  onStopsChange={setStops}
                  selectedStopIndex={selectedStopIndex}
                  onSelectStopIndex={setSelectedStopIndex}
                  heightClass="h-64 sm:h-72"
                />
              </div>

              {/* Dynamic Route Telemetry Badge */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/70 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {isAr ? 'عدد المحطات' : 'Total Stops'}
                  </div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {stops.length} {isAr ? 'محطات' : 'Stops'}
                  </div>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {isAr ? 'إجمالي المسافة' : 'Total Distance'}
                  </div>
                  <div className="text-base font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                    {routeStats.distanceKm} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {isAr ? 'الزمن التقديري' : 'Estimated Time'}
                  </div>
                  <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                    {Math.floor(routeStats.drivingMinutes / 60)}h {routeStats.drivingMinutes % 60}m
                  </div>
                </div>
              </div>

              {/* Stops List with Reordering & Editing */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isAr ? 'تسلسل خط السير (الترتيب)' : 'Route Stop Sequence & Instructions'}
                </div>

                {stops.map((stop, index) => {
                  const isPickup = index === 0;
                  const isFinal = index === stops.length - 1;
                  const isSelected = selectedStopIndex === index;

                  return (
                    <div
                      key={stop.id}
                      onClick={() => setSelectedStopIndex(index)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Sequence Badge & Address Details */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5 shadow-sm ${
                            isPickup
                              ? 'bg-emerald-500'
                              : isFinal
                              ? 'bg-sky-600'
                              : 'bg-amber-500'
                          }`}
                        >
                          {isPickup ? 'P' : isFinal ? 'D' : `${index}`}
                        </div>

                        <div className="space-y-1 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {stop.title || (isPickup ? 'Pickup' : isFinal ? 'Destination' : `Stop ${index}`)}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                isPickup
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : isFinal
                                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {stop.type}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {stop.address}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-3">
                            <span>👤 {stop.contactName} ({stop.contactPhone})</span>
                            {stop.instructions && (
                              <span className="italic truncate text-slate-500">📝 {stop.instructions}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Move Up, Move Down, Edit, Delete) */}
                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStop(index, 'UP');
                          }}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStop(index, 'DOWN');
                          }}
                          disabled={index === stops.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStop(stop);
                          }}
                          className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/20 transition"
                          title="Edit Stop"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {stops.length > 2 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveStop(index);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition"
                            title="Remove Stop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline Stop Editor Drawer */}
              {editingStop && (
                <div className="p-4 rounded-2xl border border-sky-400/40 bg-sky-50/50 dark:bg-sky-950/20 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-sky-800 dark:text-sky-300">
                      {isAr ? 'تعديل تفاصيل المحطة' : 'Edit Stop Details'}
                    </span>
                    <button
                      onClick={() => setEditingStop(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">{isAr ? 'العنوان' : 'Address'}</label>
                      <input
                        type="text"
                        value={editingStop.address}
                        onChange={(e) => setEditingStop({ ...editingStop, address: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">{isAr ? 'المدينة' : 'City'}</label>
                      <input
                        type="text"
                        value={editingStop.city}
                        onChange={(e) => setEditingStop({ ...editingStop, city: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">{isAr ? 'اسم المستلم' : 'Contact Person'}</label>
                      <input
                        type="text"
                        value={editingStop.contactName}
                        onChange={(e) => setEditingStop({ ...editingStop, contactName: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">{isAr ? 'رقم الهاتف' : 'Contact Phone'}</label>
                      <input
                        type="text"
                        value={editingStop.contactPhone}
                        onChange={(e) => setEditingStop({ ...editingStop, contactPhone: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">{isAr ? 'تعليمات خاصة بالمحطة' : 'Stop Instructions / Gate Code'}</label>
                      <input
                        type="text"
                        value={editingStop.instructions || ''}
                        onChange={(e) => setEditingStop({ ...editingStop, instructions: e.target.value })}
                        placeholder="e.g. Enter through security gate 4, ask for supervisor..."
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        const updated = stops.map((s) => (s.id === editingStop.id ? editingStop : s));
                        setStops(updated);
                        setEditingStop(null);
                      }}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      {isAr ? 'حفظ التعديلات' : 'Save Stop Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: CARGO DETAILS ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isAr ? 'نوع وتصنيف الشحنة' : 'Shipment Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'FURNITURE', labelEn: 'Furniture & bulky', labelAr: 'أثاث ومفروشات' },
                    { id: 'BUSINESS_GOODS', labelEn: 'Business Cargo', labelAr: 'بضائع تجارية' },
                    { id: 'ELECTRONICS', labelEn: 'Electronics', labelAr: 'إلكترونيات' },
                    { id: 'CONSTRUCTION', labelEn: 'Building Materials', labelAr: 'مواد بناء' },
                    { id: 'COMMERCIAL_FREIGHT', labelEn: 'Heavy Freight', labelAr: 'شحن ثقيل' },
                    { id: 'WAREHOUSE_TRANSFER', labelEn: 'Warehouse Hub', labelAr: 'نقل مستودعات' },
                    { id: 'FOOD_PERISHABLES', labelEn: 'Food / Perishables', labelAr: 'أغذية ومأكولات' },
                    { id: 'PERSONAL_PACKAGE', labelEn: 'Personal Parcels', labelAr: 'طرود شخصية' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as ShipmentCategory)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition flex flex-col justify-between h-16 ${
                        category === cat.id
                          ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                      {category === cat.id && <Check className="w-3.5 h-3.5 self-end text-sky-500" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'وصف البضاعة بالتفصيل' : 'Detailed Cargo Description'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">{isAr ? 'الوزن الإجمالي (كجم)' : 'Total Weight (kg)'}</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">{isAr ? 'عدد القطع / الطرود' : 'Quantity / Pieces'}</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isAr ? 'متطلبات المناولة والتعامل' : 'Special Handling & Equipment'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { state: fragile, setter: setFragile, label: isAr ? 'بضاعة قابلة للكسر' : 'Fragile Cargo' },
                    { state: helperNeeded, setter: setHelperNeeded, label: isAr ? 'مطلوب عمال تحميل' : 'Helper / Loader Needed' },
                    { state: waterproof, setter: setWaterproof, label: isAr ? 'مقاوم للأمطار والأتربة' : 'Weatherproof Tarpaulin' },
                    { state: refrigerated, setter: setRefrigerated, label: isAr ? 'تأمين تبريد' : 'Temperature Controlled' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => item.setter(!item.state)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                        item.state
                          ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.state && <Check className="w-3.5 h-3.5 text-sky-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: VEHICLE & SPECS ================= */}
          {step === 3 && (
            <div className="space-y-4">
              {/* AI Recommendation Alert */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-indigo-500/10 border border-sky-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                    <span>{isAr ? 'توصية الذكاء الاصطناعي للمركبة المثالية' : 'AI Fleet Matching Recommendation'}</span>
                    <span className="bg-sky-500 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                      {recommendedVehicle}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {aiReasoning}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isAr ? 'اختر فئة المركبة المطلوبة' : 'Choose Vehicle Category'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {VEHICLE_CATALOG.slice(0, 6).map((veh) => (
                    <div
                      key={veh.id}
                      onClick={() => setSelectedVehicle(veh.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        selectedVehicle === veh.id
                          ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {isAr ? veh.nameAr : veh.nameEn}
                          </span>
                          {veh.id === recommendedVehicle && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5 rounded">
                              AI Pick
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          {isAr ? veh.idealForAr : veh.idealForEn}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="font-mono text-slate-400">Max: {veh.maxWeightKg} kg</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {veh.baseFareEgp} EGP base
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: PRICE OFFER & MARKETPLACE NEGOTIATION ================= */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Marketplace Negotiation Explanation */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold block mb-0.5">
                    {isAr
                      ? 'نظام التسعير التفاوضي الحر (Direct Price Negotiation)'
                      : 'Direct in-app price negotiation (inDrive marketplace model)'}
                  </span>
                  {isAr
                    ? 'أنت تحدد عرض سعرك المقترح. سيصل طلبك للسائقين المؤهلين بالقرب من نقطة البداية، ويمكنهم قبول السعر، أو تقديم عروض مضادة، وأنت تختار السائق المناسب بناءً على التقييم والسيارة والمسافة.'
                    : 'You set your target offer price. Eligible verified drivers along your route will review and can accept, counter-offer, or compete. You keep full control of choosing your driver.'}
                </div>
              </div>

              {/* Dynamic Suggested Range */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isAr ? 'نطاق الأسعار العادل المقترح' : 'AI Suggested Market Price Range'}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono flex items-center justify-center gap-2">
                  <span>EGP {suggestedMinPrice}</span>
                  <span className="text-slate-400 text-lg">–</span>
                  <span>EGP {suggestedMaxPrice}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr
                    ? `محسوب بناءً على مسافة ${routeStats.distanceKm} كم و${stops.length} محطات وفئة ${selectedVehicle}`
                    : `Calculated for ${routeStats.distanceKm} km across ${stops.length} stops for ${selectedVehicle}`}
                </p>
              </div>

              {/* Customer Offer Price Input (Steppers & Slider) */}
              <div className="p-5 rounded-2xl border-2 border-sky-500 bg-sky-50/20 dark:bg-sky-950/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-sky-500" />
                    <span>{isAr ? 'عرض سعري المستهدف (My Offer):' : 'My Offer Price:'}</span>
                  </label>
                  <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">
                    EGP {customerOfferPrice}
                  </span>
                </div>

                {/* Price Quick Adjust Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomerOfferPrice((p) => Math.max(50, p - 20))}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 transition shadow-sm"
                  >
                    - 20 EGP
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerOfferPrice((p) => Math.max(50, p - 10))}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 transition shadow-sm"
                  >
                    - 10
                  </button>
                  <input
                    type="number"
                    value={customerOfferPrice}
                    onChange={(e) => setCustomerOfferPrice(Number(e.target.value))}
                    className="w-28 text-center text-xl font-black rounded-xl border border-sky-400 bg-white dark:bg-slate-900 py-2 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomerOfferPrice((p) => p + 10)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 transition shadow-sm"
                  >
                    + 10
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerOfferPrice((p) => p + 20)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 transition shadow-sm"
                  >
                    + 20 EGP
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  {customerOfferPrice < suggestedMinPrice ? (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      ⚠️ {isAr ? 'عرضك أقل من المتوسط، قد يستغرق السائقون وقتاً إضافياً لقبوله' : 'Offer below market average, drivers may submit counter-offers'}
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ {isAr ? 'عرض سعر ممتاز وسريع الاستجابة' : 'Competitive offer with high acceptance speed'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  handleProceedToVehicle();
                } else {
                  setStep((s) => (s + 1) as any);
                }
              }}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition"
            >
              <span>{isAr ? 'التالي' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitRequest}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <span>{isAr ? 'نشر الطلب والبدء بالتفاوض' : 'Broadcast Request & Open Negotiation'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
