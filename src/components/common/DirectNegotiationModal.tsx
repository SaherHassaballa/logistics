import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Sliders,
  DollarSign,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryRequest, DriverOffer, NegotiationRound } from '../../types';

interface DirectNegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: DeliveryRequest;
  offer: DriverOffer;
  userRole?: 'CUSTOMER' | 'DRIVER';
}

export const DirectNegotiationModal: React.FC<DirectNegotiationModalProps> = ({
  isOpen,
  onClose,
  delivery,
  offer,
  userRole = 'CUSTOMER',
}) => {
  const {
    language,
    submitCounterOffer,
    acceptDriverOffer,
    declineOffer,
    platformFeePercentage,
    setActiveDeliveryId,
  } = useApp();

  const isAr = language === 'ar';
  const [actingParty, setActingParty] = useState<'CUSTOMER' | 'DRIVER'>(userRole);
  const [counterPrice, setCounterPrice] = useState<number>(offer.proposedPrice);
  const [counterNote, setCounterNote] = useState('');
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(292); // default ~4m 52s

  // Sync actingParty if userRole prop changes
  useEffect(() => {
    setActingParty(userRole);
  }, [userRole]);

  // Sync counter price default when offer changes
  useEffect(() => {
    setCounterPrice(offer.proposedPrice);
  }, [offer.proposedPrice]);

  // Live countdown timer simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = remainingSeconds === 0 || offer.isExpired;
  const isAccepted = offer.status === 'ACCEPTED' || delivery.status === 'IN_TRANSIT' || delivery.status === 'DRIVER_ASSIGNED';
  const isDeclined = offer.status === 'DECLINED';

  // Platform fee math
  const agreedPrice = offer.proposedPrice;
  const feeAmount = (agreedPrice * platformFeePercentage) / 100;
  const driverEarnings = agreedPrice - feeAmount;

  const handleAccept = () => {
    acceptDriverOffer(delivery.id, offer.id);
    setActiveDeliveryId(delivery.id);
    setShowCounterInput(false);
  };

  const handleDecline = () => {
    declineOffer(delivery.id, offer.id, actingParty);
    setShowCounterInput(false);
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (counterPrice <= 0) return;
    submitCounterOffer(delivery.id, offer.id, counterPrice, actingParty, counterNote);
    setShowCounterInput(false);
    setCounterNote('');
    setRemainingSeconds(300); // Reset timer to 5 mins
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <img
              src={offer.driverAvatar}
              alt={offer.driverName}
              className="w-11 h-11 rounded-full object-cover border-2 border-sky-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {offer.driverName}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Hauler ✓</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> {offer.driverRating}
                </span>
                <span>·</span>
                <span>{offer.completedDeliveries} trips</span>
                <span>·</span>
                <span>{offer.vehicleModel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Perspective Switcher for Demo testing */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px]">
              <button
                onClick={() => setActingParty('CUSTOMER')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  actingParty === 'CUSTOMER'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Shipper View
              </button>
              <button
                onClick={() => setActingParty('DRIVER')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  actingParty === 'DRIVER'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Driver View
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Driver Credentials / Comparison Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Plate Number</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {offer.vehiclePlate}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Distance to Pickup</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {offer.distanceFromPickupKm || 3.2} km
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Pickup ETA</span>
              <div className="font-mono font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                {offer.etaMinutes} mins
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle Type</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                {offer.vehicleType}
              </div>
            </div>
          </div>

          {/* AI-Assisted Market Recommendation Box (Example estimate) */}
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-sky-900 dark:text-sky-200">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Suggested Market Range</span>
                <span className="text-slate-400 font-normal">·</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-extrabold text-xs">
                  {delivery.aiMarketPriceRange
                    ? `EGP ${delivery.aiMarketPriceRange.minEgp} – ${delivery.aiMarketPriceRange.maxEgp}`
                    : 'EGP 380 – 460'}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 font-mono">
                [Example estimate]
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {delivery.aiMarketPriceRange?.reasoning ||
                'Calculated considering 38.4 km transit, ~48 mins driving time, pickup flatbed fuel economics, and real-time corridor driver availability.'}
            </p>
          </div>

          {/* Active Offer Status Banner & Live Expiration Timer */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                {isAccepted
                  ? 'FINAL AGREED FARE'
                  : isDeclined
                  ? 'OFFER DECLINED'
                  : 'CURRENT ACTIVE OFFER'}
              </span>
              <div className="font-mono text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                EGP {offer.proposedPrice}
              </div>
            </div>

            <div className="text-right">
              {!isAccepted && !isDeclined ? (
                <div>
                  <div
                    className={`flex items-center justify-end gap-1 font-mono font-bold text-xs ${
                      remainingSeconds < 60 ? 'text-rose-500 animate-pulse' : 'text-sky-600 dark:text-sky-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Offer expires in {formatTimer(remainingSeconds)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isAr ? 'عطاء مؤقت يضمن حجز الكابتن' : 'Guaranteed hauler slot hold'}
                  </span>
                </div>
              ) : isAccepted ? (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Price Agreed ✓</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm">
                  <XCircle className="w-5 h-5" />
                  <span>Offer Declined</span>
                </div>
              )}
            </div>
          </div>

          {/* Compact Negotiation Timeline */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Negotiation Rounds History</span>
              <span className="text-slate-400 font-mono text-[10px]">
                {offer.negotiationHistory?.length || 1} rounds
              </span>
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden">
              {offer.negotiationHistory && offer.negotiationHistory.length > 0 ? (
                offer.negotiationHistory.map((round, idx) => {
                  const isCustomer = round.proposedBy === 'CUSTOMER';
                  const isFinal = idx === offer.negotiationHistory.length - 1;
                  return (
                    <div
                      key={round.id || idx}
                      className={`p-3 flex items-start justify-between gap-3 ${
                        isFinal ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5 ${
                            isCustomer
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                              : 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
                          }`}
                        >
                          {isCustomer ? 'C' : 'D'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {round.proposedBy === 'CUSTOMER' ? 'Customer Offer' : 'Driver Counter-Offer'}
                            </span>
                            <span className="text-slate-400 text-[10px] font-mono">
                              ({round.proposerName})
                            </span>
                            <span className="text-slate-400 text-[10px] font-mono">
                              {round.timestamp}
                            </span>
                          </div>
                          {round.note && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5">
                              "{round.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                          EGP {round.amountEgp}
                        </div>
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            round.status === 'ACCEPTED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                              : round.status === 'DECLINED'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {round.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-slate-400 italic">
                  Initial offer EGP {offer.proposedPrice}
                </div>
              )}
            </div>
          </div>

          {/* Final Price Breakdown (Configurable Platform Fee) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-sky-500" />
                <span>Transparent Fare & Earnings Breakdown</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">[Example calculation]</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Agreed Transportation Price:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  EGP {agreedPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
                <span>Platform Commission ({platformFeePercentage}% fixed):</span>
                <span className="font-mono font-bold">
                  EGP {feeAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Driver Net Earnings:</span>
                <span className="font-mono">
                  EGP {driverEarnings.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>Total Customer Payment:</span>
                <span className="font-mono text-sm">EGP {agreedPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Counter-Offer Input Drawer */}
          {showCounterInput && !isAccepted && (
            <form
              onSubmit={handleSendCounter}
              className="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 dark:text-sky-200">
                  {actingParty === 'CUSTOMER' ? 'Your Counter-Offer (EGP)' : 'Driver Counter-Offer (EGP)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Current: EGP {offer.proposedPrice}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="5"
                  min="50"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-base text-sky-600 dark:text-sky-400"
                />
                <button
                  type="button"
                  onClick={() => setCounterPrice((p) => Math.max(50, p - 10))}
                  className="px-3 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg font-bold"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => setCounterPrice((p) => p + 10)}
                  className="px-3 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg font-bold"
                >
                  +10
                </button>
              </div>

              <input
                type="text"
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Optional message (e.g. Can we meet at EGP 425? Tolls included)"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-sm"
                >
                  {actingParty === 'CUSTOMER' ? 'Send Counter-Offer' : 'Make Counter-Offer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCounterInput(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 font-semibold rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Action Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/80">
          <div className="text-slate-500 text-[11px]">
            {isAccepted
              ? 'Price locked. Driver dispatched for pickup.'
              : 'Direct negotiation is binding once accepted by both parties.'}
          </div>

          {!isAccepted && !isDeclined ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecline}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-colors"
              >
                DECLINE
              </button>

              <button
                onClick={() => setShowCounterInput(!showCounterInput)}
                className="px-4 py-2.5 rounded-xl border border-sky-400 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 font-bold transition-colors"
              >
                COUNTER
              </button>

              <button
                onClick={handleAccept}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
              >
                <span>ACCEPT (EGP {offer.proposedPrice})</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
