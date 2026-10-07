import React, { useState } from 'react';
import {
  Truck,
  Power,
  DollarSign,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  AlertCircle,
  Camera,
  KeyRound,
  FileSpreadsheet,
  ArrowRight,
  UserCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapVisualizer } from '../common/MapVisualizer';
import { DirectNegotiationModal } from '../common/DirectNegotiationModal';
import { DeliveryRequest, DriverOffer } from '../../types';

export const DriverPortal: React.FC = () => {
  const {
    language,
    deliveries,
    activeDelivery,
    updateDeliveryStatus,
    verifyDeliveryOtp,
    submitDriverOffer,
    settlements,
    platformFeePercentage,
    drivers,
    updateDriverStatus,
  } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'RADAR' | 'ACTIVE_JOB' | 'SETTLEMENTS' | 'PROFILE'>('ACTIVE_JOB');
  const [isOnline, setIsOnline] = useState(true);

  // Counter-offer state
  const [biddingOrderId, setBiddingOrderId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(1250);
  const [counterEta, setCounterEta] = useState<number>(15);
  const [counterNote, setCounterNote] = useState('Available with ratchet straps and loading ramp.');
  const [negotiationTarget, setNegotiationTarget] = useState<{
    delivery: DeliveryRequest;
    offer: DriverOffer;
  } | null>(null);

  // OTP Verification state on active job
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  const currentJob = activeDelivery || deliveries[0];
  const driverProfile = drivers[0]; // Ahmed Hassan

  const handleSendOffer = (deliveryId: string) => {
    submitDriverOffer(deliveryId, {
      deliveryId,
      driverId: driverProfile.id,
      driverName: driverProfile.name,
      driverAvatar: driverProfile.avatar,
      driverPhone: driverProfile.phone,
      driverRating: driverProfile.rating,
      completedDeliveries: driverProfile.completedDeliveries,
      vehicleType: driverProfile.vehicleType,
      vehicleModel: driverProfile.vehicleModel,
      vehiclePlate: driverProfile.vehiclePlate,
      distanceFromPickupKm: 3.5,
      proposedPrice: counterPrice,
      initialCustomerPrice: currentJob?.customerOfferPrice,
      etaMinutes: counterEta,
      message: counterNote,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      status: 'PENDING',
      negotiationHistory: [
        {
          id: `neg-${Date.now()}`,
          roundNumber: 1,
          proposedBy: 'DRIVER',
          proposerName: driverProfile.name,
          amountEgp: counterPrice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'OFFER',
          note: counterNote,
        },
      ],
    });
    setBiddingOrderId(null);
    alert('Your counter-offer has been broadcast to the shipper.');
  };

  const handleVerifyOtp = (step: 'PICKUP' | 'DROPOFF') => {
    setOtpError(null);
    setOtpSuccess(null);
    if (!currentJob) return;

    const res = verifyDeliveryOtp(currentJob.id, enteredOtp, step);
    if (res.success) {
      setOtpSuccess(res.message);
      setEnteredOtp('');
    } else {
      setOtpError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      {/* Top Driver Cockpit Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#091122]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={driverProfile.avatar}
                alt={driverProfile.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-sky-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                    {driverProfile.name}
                  </h1>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Verified Hauler ✓
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {driverProfile.vehicleModel} · {driverProfile.vehiclePlate}
                </div>
              </div>
            </div>

            {/* Online / Offline Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const next = !isOnline;
                  setIsOnline(next);
                  updateDriverStatus(driverProfile.id, next);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isOnline
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{isOnline ? (isAr ? 'متصل ومتاح للطلبات' : 'ONLINE · Available') : (isAr ? 'غير متصل' : 'OFFLINE')}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Today's Cash</div>
              <div className="font-mono text-base font-extrabold text-slate-900 dark:text-white">EGP 1,420</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Trips Completed</div>
              <div className="font-mono text-base font-extrabold text-slate-900 dark:text-white">4 Trips</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">5-Day Collections</div>
              <div className="font-mono text-base font-extrabold text-sky-600 dark:text-sky-400">EGP 18,750</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Fee Rate</div>
              <div className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {platformFeePercentage}% fixed
              </div>
            </div>
          </div>

          {/* Driver Sub-Tabs */}
          <div className="flex items-center gap-2 mt-4 text-xs">
            <button
              onClick={() => setActiveTab('ACTIVE_JOB')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'ACTIVE_JOB'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isAr ? 'الرحلة النشطة وإثبات التسليم' : 'Active Job & Custody Chain'}
            </button>
            <button
              onClick={() => setActiveTab('RADAR')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'RADAR'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isAr ? 'رادار الطلبات المتاحة للمزايدة' : 'Nearby Requests Radar'}
            </button>
            <button
              onClick={() => setActiveTab('SETTLEMENTS')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'SETTLEMENTS'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isAr ? 'كشوفات تسوية الـ 5 أيام' : '5-Day Settlement Statements'}
            </button>
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'PROFILE'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isAr ? 'ملف التوثيق والرخص' : 'Verification Credentials'}
            </button>
          </div>
        </div>
      </div>

      {/* Driver Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: ACTIVE JOB CONSOLE */}
        {activeTab === 'ACTIVE_JOB' && currentJob && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Telemetry View */}
            <div className="lg:col-span-7 space-y-4">
              <MapVisualizer
                stops={currentJob.stops}
                pickup={currentJob.pickup}
                dropoff={currentJob.dropoff}
                vehicleType={currentJob.selectedVehicle}
                driverName={driverProfile.name}
                statusText="En route with live GPS lock"
                className="h-[380px] w-full"
              />

              {/* Order Info */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                      Job #{currentJob.trackingNumber}
                    </span>
                    {currentJob.stops && currentJob.stops.length > 2 && (
                      <span className="text-[10px] bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold px-2 py-0.5 rounded font-mono">
                        {currentJob.stops.length} STOPS
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Agreed Fare: EGP {currentJob.agreedPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Net: EGP {(currentJob.agreedPrice * (1 - platformFeePercentage / 100)).toFixed(2)} (Fee: {platformFeePercentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {currentJob.description} ({currentJob.weightKg} kg)
                  </div>
                  {currentJob.offers.length > 0 && (
                    <button
                      onClick={() =>
                        setNegotiationTarget({
                          delivery: currentJob,
                          offer: currentJob.offers[0],
                        })
                      }
                      className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Negotiation Rounds ({currentJob.offers[0]?.negotiationHistory?.length || 1})</span>
                    </button>
                  )}
                </div>

                <div className="text-slate-500">
                  Pickup: {currentJob.pickup.address}
                </div>
                <div className="text-slate-500">
                  Dropoff: {currentJob.dropoff.address}
                </div>
              </div>
            </div>

            {/* Chain of Custody Step-by-Step Operator Console */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    DELIVERY CHAIN OF CUSTODY
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                    {isAr ? 'إجراءات التسليم والتوثيق' : 'Operational Delivery Workflow'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Current stage: <span className="font-bold text-slate-800 dark:text-slate-200">{currentJob.status}</span>
                  </p>
                </div>

                {/* Workflow Action 1: Arrival at Pickup */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>1. مرحلة الاستلام (Pickup)</span>
                    <span className="text-[11px] text-slate-400">Code: {currentJob.pickupOtp}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateDeliveryStatus(
                          currentJob.id,
                          'DRIVER_ARRIVING_PICKUP',
                          'Driver confirmed arrival at pickup location.'
                        )
                      }
                      className="flex-1 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      وصلت لموقع الاستلام
                    </button>
                    <button
                      onClick={() =>
                        updateDeliveryStatus(
                          currentJob.id,
                          'PICKUP_IN_PROGRESS',
                          'Loading confirmed. Cargo strapped.'
                        )
                      }
                      className="flex-1 py-2 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 transition-colors"
                    >
                      بدء التحميل وتأكيد الكود
                    </button>
                  </div>
                </div>

                {/* Workflow Action 2: In-Transit */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    2. في الطريق (In Transit)
                  </div>
                  <button
                    onClick={() =>
                      updateDeliveryStatus(
                        currentJob.id,
                        'IN_TRANSIT',
                        'En route on highway to recipient address.'
                      )
                    }
                    className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors"
                  >
                    تحديث الحالة: في الطريق للتسليم
                  </button>
                </div>

                {/* Workflow Action 3: Recipient OTP Verification Handshake */}
                <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/40 space-y-3 text-xs">
                  <div className="font-bold text-sky-900 dark:text-sky-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-sky-600" />
                      <span>3. إدخال رمز المستلم (Dropoff OTP)</span>
                    </span>
                    <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400">
                      Expected demo OTP: {currentJob.dropoffOtp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isAr
                      ? 'اطلب رمز التحقق من المستلم عند تفريغ الحمولة لاستكمال الرحلة وتحصيل المبلغ.'
                      : 'Request the 6-digit dropoff code from the recipient upon unloading.'}
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 6038"
                      className="w-32 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-center text-sm"
                    />
                    <button
                      onClick={() => handleVerifyOtp('DROPOFF')}
                      className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                    >
                      تحقق وإتمام التسليم واستلام النقدية
                    </button>
                  </div>

                  {otpError && (
                    <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{otpError}</span>
                    </div>
                  )}
                  {otpSuccess && (
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{otpSuccess}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEARBY REQUESTS RADAR */}
        {activeTab === 'RADAR' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAr ? 'طلبات الشحن القريبة المتاحة للمزايدة' : 'Nearby Available Hauling Requests'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Within 25km radius · Filtered for Pickup & Van category compatibility
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {deliveries.filter((d) => d.status === 'OFFERS_RECEIVED' || d.status === 'BROADCASTING').length} tenders open
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveries
                  .filter((d) => d.status === 'OFFERS_RECEIVED' || d.status === 'BROADCASTING')
                  .map((tender) => (
                    <div
                      key={tender.id}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                          #{tender.trackingNumber} · {tender.shipmentCategory}
                        </span>
                        <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                          Offered: EGP {tender.customerOfferPrice}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {tender.description}
                      </div>

                      <div className="space-y-1 text-slate-500 text-[11px]">
                        <div>From: {tender.pickup.address}</div>
                        <div>To: {tender.dropoff.address}</div>
                        <div>Weight: {tender.weightKg} kg · Est. distance: {tender.distanceKm} km</div>
                      </div>

                      {/* Bidding button */}
                      {biddingOrderId === tender.id ? (
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 mt-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block">Your Price (EGP)</label>
                              <input
                                type="number"
                                value={counterPrice}
                                onChange={(e) => setCounterPrice(Number(e.target.value))}
                                className="w-full p-2 border rounded font-mono font-bold text-sky-600"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block">Arrival ETA (mins)</label>
                              <input
                                type="number"
                                value={counterEta}
                                onChange={(e) => setCounterEta(Number(e.target.value))}
                                className="w-full p-2 border rounded font-mono font-bold"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleSendOffer(tender.id)}
                              className="flex-1 py-2 bg-sky-600 text-white font-bold rounded"
                            >
                              إرسال العرض للعميل
                            </button>
                            <button
                              onClick={() => setBiddingOrderId(null)}
                              className="px-3 py-2 bg-slate-200 dark:bg-slate-800 rounded font-semibold"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setBiddingOrderId(tender.id);
                            setCounterPrice(tender.customerOfferPrice || 420);
                          }}
                          className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors"
                        >
                          تقديم عرض سعر مضاد (Make Counter-Bid)
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 5-DAY SETTLEMENT STATEMENTS */}
        {activeTab === 'SETTLEMENTS' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  AUTOMATED 5-DAY RECONCILIATION
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'كشوف حساب التحصيلات وعمولة المنصة' : 'Cash Settlements & Statements'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Platform Fee Rule</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {platformFeePercentage}% of Gross Cash
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {settlements.map((stl) => (
                <div key={stl.id} className="py-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                        {stl.id}
                      </span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Period: {stl.periodStart} to {stl.periodEnd}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        stl.status === 'SETTLED'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                      }`}
                    >
                      {stl.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400">Trips</div>
                      <div className="font-mono font-bold">{stl.completedDeliveriesCount} trips</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Cash Collected</div>
                      <div className="font-mono font-bold">EGP {stl.totalCashCollected.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Platform Fee ({stl.platformFeePercentage}%)</div>
                      <div className="font-mono font-bold text-sky-600">EGP {stl.platformFeeAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Your Net Earnings</div>
                      <div className="font-mono font-bold text-emerald-600">EGP {stl.driverNetEarnings.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 italic">
                    Note: {stl.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VERIFICATION CREDENTIALS */}
        {activeTab === 'PROFILE' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'وثائق الهوية والتراخيص المعتمدة' : 'Official Driver Credentials'}
                </h3>
                <p className="text-slate-500">
                  Documents verified by Request Delivery security and operations department
                </p>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Status</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">National ID</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  {driverProfile.documents.nationalId}
                </div>
                <span className="text-emerald-600 text-[11px] font-semibold">Government Database Verified ✓</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Professional Driving License</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  {driverProfile.documents.drivingLicense}
                </div>
                <span className="text-emerald-600 text-[11px] font-semibold">Grade 2 Commercial Hauler ✓</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle Registration</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  {driverProfile.documents.vehicleRegistration}
                </div>
                <span className="text-emerald-600 text-[11px] font-semibold">Plate ط ص ع 4819 (Passed Technical Check) ✓</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Facial Liveness Selfie</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  Biometric Match 99.4%
                </div>
                <span className="text-emerald-600 text-[11px] font-semibold">Selfie Matches ID Record ✓</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Direct Negotiation Modal in Driver Mode */}
      {negotiationTarget && (
        <DirectNegotiationModal
          isOpen={!!negotiationTarget}
          onClose={() => setNegotiationTarget(null)}
          delivery={negotiationTarget.delivery}
          offer={negotiationTarget.offer}
          userRole="DRIVER"
        />
      )}
    </div>
  );
};
