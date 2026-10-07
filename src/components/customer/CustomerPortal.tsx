import React, { useState } from 'react';
import {
  Package,
  Plus,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  Star,
  CheckCircle2,
  Navigation,
  KeyRound,
  Phone,
  MessageSquare,
  AlertCircle,
  Eye,
  Camera,
  Sparkles,
  Sliders,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapVisualizer } from '../common/MapVisualizer';
import { NewDeliveryModal } from './NewDeliveryModal';
import { DirectNegotiationModal } from '../common/DirectNegotiationModal';
import { DeliveryRequest, DriverOffer } from '../../types';

export const CustomerPortal: React.FC = () => {
  const {
    language,
    deliveries,
    activeDelivery,
    setActiveDeliveryId,
    acceptDriverOffer,
    setCurrentView,
  } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRACKING' | 'HISTORY'>('TRACKING');
  const [modalOpen, setModalOpen] = useState(false);
  const [negotiationTarget, setNegotiationTarget] = useState<{
    delivery: DeliveryRequest;
    offer: DriverOffer;
  } | null>(null);

  // If activeDelivery exists or fallback to first
  const currentOrder = activeDelivery || deliveries[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      {/* Top App Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#091122]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'مرحباً، يوسف نبيل' : 'Welcome back, Youssef Nabil'}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {isAr ? 'بوابة الشحن والطلبات' : 'Shipper Dispatch & Live Tracking'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'طلب شحنة جديدة' : '+ Request Delivery'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs">
            <button
              onClick={() => setActiveTab('TRACKING')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'TRACKING'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'التتبع الحي والخريطة' : 'Live Tracking & Route'}
            </button>
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'OVERVIEW'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'عروض الكباتن والطلبات الحالية' : 'Bids & Active Orders'}
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'HISTORY'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'سجل الشحنات السابقة' : 'Past Deliveries'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: LIVE TRACKING */}
        {activeTab === 'TRACKING' && currentOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Map + Telemetry */}
            <div className="lg:col-span-8 space-y-4">
              {/* Interactive Map Visualizer */}
              <MapVisualizer
                stops={currentOrder.stops}
                pickup={currentOrder.pickup}
                dropoff={currentOrder.dropoff}
                driverCoords={currentOrder.assignedDriver?.currentCoords}
                vehicleType={currentOrder.selectedVehicle}
                driverName={currentOrder.assignedDriver?.name || 'Ahmed Hassan'}
                statusText={
                  currentOrder.status === 'IN_TRANSIT'
                    ? 'In Transit on Route'
                    : 'Driver Assigned'
                }
                className="h-[440px] w-full"
              />

              {/* Active Delivery Detail Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                        {currentOrder.trackingNumber}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {currentOrder.shipmentCategory}
                      </span>
                      {currentOrder.stops && currentOrder.stops.length > 2 && (
                        <span className="text-[10px] bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold px-2 py-0.5 rounded font-mono">
                          {currentOrder.stops.length} STOPS
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {currentOrder.description}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                      Agreed Fare
                    </span>
                    <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                      EGP {currentOrder.agreedPrice}
                    </span>
                    {currentOrder.offers.length > 0 && (
                      <button
                        onClick={() =>
                          setNegotiationTarget({
                            delivery: currentOrder,
                            offer: currentOrder.offers[0],
                          })
                        }
                        className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center justify-end gap-1 mt-1"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Negotiation History ({currentOrder.offers[0]?.negotiationHistory?.length || 1} rounds)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Multi-Stop or Pickup & Dropoff Route Details */}
                {currentOrder.stops && currentOrder.stops.length > 2 ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isAr ? 'محطات خط السير والتسليم' : 'Multi-Stop Route Itinerary'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {currentOrder.stops.map((st, idx) => (
                        <div
                          key={st.id || idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">
                                {idx === 0 ? 'P' : idx === currentOrder.stops!.length - 1 ? 'D' : idx}
                              </span>
                              <span>{st.title || `Stop ${idx + 1}`}</span>
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400">
                              {st.type}
                            </span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 font-medium truncate">
                            {st.address}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {st.contactName} ({st.contactPhone})
                          </div>
                          {st.instructions && (
                            <div className="text-[10px] text-slate-500 italic truncate">
                              📝 {st.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-3.5 h-3.5 text-sky-500" />
                        <span>{isAr ? 'الاستلام (نقطة أ):' : 'Pickup Point (A):'}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 font-medium">
                        {currentOrder.pickup.address}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Contact: {currentOrder.pickup.contactName} ({currentOrder.pickup.contactPhone})
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isAr ? 'التسليم (نقطة ب):' : 'Dropoff Point (B):'}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 font-medium">
                        {currentOrder.dropoff.address}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Recipient: {currentOrder.dropoff.contactName} ({currentOrder.dropoff.contactPhone})
                      </div>
                    </div>
                  </div>
                )}

                {/* Proof Photos if uploaded */}
                {currentOrder.pickupProofPhotoUrl && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentOrder.pickupProofPhotoUrl}
                        alt="Cargo Inspection Proof"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-sky-500" />
                          <span>{isAr ? 'صورة تحميل وتثبيت الحمولة' : 'Loading Inspection Photo'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Captured at pickup location: 30.584° N, 31.508° E
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Chain-of-Custody Verified ✓
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Driver Profile & Custody Tokens & Timeline */}
            <div className="lg:col-span-4 space-y-4">
              {/* Driver Card */}
              {currentOrder.assignedDriver ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Assigned Hauler
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Driver ✓</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt="Driver Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-sky-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {currentOrder.assignedDriver.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                          {currentOrder.assignedDriver.rating}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {currentOrder.assignedDriver.vehicleModel}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-sky-600 dark:text-sky-400 mt-0.5">
                        Plate: {currentOrder.assignedDriver.vehiclePlate}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Call & Message */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`tel:${currentOrder.assignedDriver.phone}`}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-center flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-500" />
                      <span>{isAr ? 'اتصال بالكابتن' : 'Call Driver'}</span>
                    </a>
                    <button
                      onClick={() => alert(`Direct in-app messaging connected with ${currentOrder.assignedDriver?.name}`)}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-center flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                      <span>{isAr ? 'محادثة فورية' : 'Chat'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center text-xs space-y-2">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 mx-auto">
                    <Clock className="w-5 h-5 animate-spin" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {isAr ? 'جاري انتظار قبول عرض الكابتن' : 'Awaiting Driver Selection'}
                  </h4>
                  <p className="text-slate-500">
                    {isAr
                      ? 'اختر كابتناً من قائمة العروض لبدء التوجيه الفوري.'
                      : 'Select a driver offer from the Bids tab to commence live dispatch.'}
                  </p>
                </div>
              )}

              {/* Delivery Security OTP Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-sky-200 dark:border-sky-900/60 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-sky-800 dark:text-sky-300">
                  <KeyRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{isAr ? 'رموز التحقق وسلسلة الأمان (OTP)' : 'Chain of Custody Tokens'}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr
                    ? 'أعط رمز التسليم للمستلم فقط. لا يُسلم الكابتن البضاعة حتى يتطابق الكود.'
                    : 'Share the dropoff OTP with the recipient only. Handover completes upon valid token verification.'}
                </p>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">Pickup Code</span>
                    <span className="font-mono text-base font-extrabold text-slate-700 dark:text-slate-200">
                      {currentOrder.pickupOtp}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-semibold">Dropoff OTP</span>
                    <span className="font-mono text-lg font-black text-sky-600 dark:text-sky-400 tracking-wider">
                      {currentOrder.dropoffOtp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {isAr ? 'سجل مراحل الشحنة' : 'Timeline Audit'}
                </h4>
                <div className="space-y-4 pt-1">
                  {currentOrder.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-1"></div>
                        {idx < currentOrder.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-800 my-0.5"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {isAr ? event.titleAr : event.title}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{event.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? event.descriptionAr : event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW & INCOMING DRIVER OFFERS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* If there is an order in OFFERS_RECEIVED status */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAr ? 'عروض الكباتن المتنافسة في السوق' : 'Live Driver Counter-Offers & Bids'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr
                      ? 'قارن تقييمات السائقين والمركبات وتوقيتات الوصول واختر الكابتن الأنسب.'
                      : 'Review driver credentials, vehicle specs, and pick your preferred partner.'}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                  {deliveries.filter((d) => d.offers.length > 0).length} active requests
                </span>
              </div>

              {deliveries.map((del) => (
                <div key={del.id} className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>
                      Order #{del.trackingNumber} · {del.description} ({del.pickup.city} → {del.dropoff.city})
                    </span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">
                      Your offer: EGP {del.customerOfferPrice}
                    </span>
                  </div>

                  {del.offers.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No offers received yet for this item.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {del.offers.map((off) => (
                        <div
                          key={off.id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={off.driverAvatar}
                                alt={off.driverName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{off.driverName}</span>
                                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                  <span className="text-amber-500 font-bold flex items-center">
                                    <Star className="w-3 h-3 fill-current mr-0.5" />
                                    {off.driverRating}
                                  </span>
                                  <span>·</span>
                                  <span>{off.vehicleModel}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-base font-extrabold text-sky-600 dark:text-sky-400">
                                EGP {off.proposedPrice}
                              </div>
                              <div className="text-[10px] text-slate-400">{off.etaMinutes} mins away</div>
                            </div>
                          </div>

                          {/* Expiration badge & negotiation status */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-mono font-medium">
                              <Clock className="w-3 h-3" />
                              <span>Expires in 04:52</span>
                            </span>
                            <span className="font-mono text-slate-400">
                              {off.negotiationHistory?.length || 1} rounds logged
                            </span>
                          </div>

                          {off.message && (
                            <p className="text-[11px] text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded">
                              "{off.message}"
                            </p>
                          )}

                          {/* Dual Action: Direct Negotiate & Counter vs Direct Accept */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() =>
                                setNegotiationTarget({
                                  delivery: del,
                                  offer: off,
                                })
                              }
                              className="py-2 px-2.5 rounded-lg border border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>{isAr ? 'تفاوض مباشر' : 'Counter / Negotiate'}</span>
                            </button>

                            <button
                              onClick={() => {
                                acceptDriverOffer(del.id, off.id);
                                setActiveDeliveryId(del.id);
                                setActiveTab('TRACKING');
                              }}
                              className="py-2 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors"
                            >
                              {isAr ? `قبول ${off.proposedPrice} ج.م` : `Accept EGP ${off.proposedPrice}`}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'HISTORY' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? 'سجل الشحنات المكتملة' : 'Completed Deliveries'}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {deliveries.map((d) => (
                <div key={d.id} className="py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-mono font-bold text-sky-600 dark:text-sky-400">
                      <span>{d.trackingNumber}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-700 dark:text-slate-300 font-sans">{d.description}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {d.pickup.city} → {d.dropoff.city} · {d.weightKg} kg · Agreed EGP {d.agreedPrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        d.status === 'DELIVERED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {d.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveDeliveryId(d.id);
                        setActiveTab('TRACKING');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {isAr ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Delivery Request Modal */}
      <NewDeliveryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setActiveTab('OVERVIEW');
        }}
      />

      {/* Direct In-App Negotiation Modal */}
      {negotiationTarget && (
        <DirectNegotiationModal
          isOpen={!!negotiationTarget}
          onClose={() => setNegotiationTarget(null)}
          delivery={negotiationTarget.delivery}
          offer={negotiationTarget.offer}
          userRole="CUSTOMER"
        />
      )}
    </div>
  );
};
