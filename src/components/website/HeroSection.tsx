import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_CATALOG } from '../../data/mockData';
import { VehicleCategory } from '../../types';

export const HeroSection: React.FC = () => {
  const { language, setCurrentView, createDeliveryRequest } = useApp();
  const isAr = language === 'ar';

  const [pickupCity, setPickupCity] = useState('Zagazig');
  const [dropoffCity, setDropoffCity] = useState('10th of Ramadan');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>('PICKUP');
  const [cargoDesc, setCargoDesc] = useState('Home Furniture & Cartons');

  const handleQuickRequest = (e: React.FormEvent) => {
    e.preventDefault();
    createDeliveryRequest({
      pickup: {
        address: `${pickupCity} City Center`,
        city: pickupCity,
        lat: 30.58,
        lng: 31.5,
        contactName: 'Sender Contact',
        contactPhone: '+20 100 000 0000',
      },
      dropoff: {
        address: `${dropoffCity} Industrial District`,
        city: dropoffCity,
        lat: 30.3,
        lng: 31.74,
        contactName: 'Receiver Contact',
        contactPhone: '+20 110 000 0000',
      },
      description: cargoDesc,
      selectedVehicle,
      recommendedVehicle: selectedVehicle,
    });
    setCurrentView('CUSTOMER_APP');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-sky-50/40 via-white to-white dark:from-[#0a1224] dark:via-[#070d19] dark:to-[#070d19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quiet text kicker with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
              <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
              <span>{isAr ? 'منصة الخدمات اللوجستية الذكية' : 'AI-Native Logistics Operating Platform'}</span>
              <span className="text-slate-400">·</span>
              <span>{isAr ? 'مصر والشرق الأوسط' : 'Multi-Vehicle Hauler Network'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {isAr ? (
                <>
                  انقل أي شيء. <br />
                  <span className="text-sky-600 dark:text-sky-400">إلى أي مكان.</span>
                </>
              ) : (
                <>
                  Move Anything. <br />
                  <span className="text-sky-600 dark:text-sky-400">Anywhere.</span>
                </>
              )}
            </h1>

            <div className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200">
              {isAr
                ? 'بضاعتك. سعرك. كابتنك.'
                : '"Your Goods. Your Price. Your Driver."'}
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {isAr
                ? 'اطلب مركبة لنقل الطرود، الأثاث، المعدات، بضائع المصانع، وكل ما بينهما — وتواصل مباشرة مع كابتن معتمد ينقلها بأمان وشفافية سعرية كاملة.'
                : 'Request a vehicle for packages, furniture, commercial goods, and everything in between — then connect with a verified driver who can move it.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('CUSTOMER_APP')}
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>{isAr ? 'اطلب توصيل الآن' : 'Request a Delivery'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                onClick={() => setCurrentView('DRIVER_APP')}
                className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-colors"
              >
                <Truck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{isAr ? 'انضم ككابتن وسائق' : 'Become a Driver'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? 'كباتن معتمدين برقم قومي ورخصة' : 'Verified Hauler Identity & Plates'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? 'عروض أسعار تفاوضية شفافة' : 'Fair Counter-Offer Bidding'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? 'تسليم برمز تحقق OTP سداسي' : 'Chain of Custody Recipient OTP'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Fleet + Instant Quote Booking Widget */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Photography Asset */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl group">
              <img
                src="/src/assets/images/hero_logistics_fleet_1791414296846.jpg"
                alt="Request Delivery Fleet"
                className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                <div className="text-white text-xs">
                  <span className="font-bold text-sky-400 font-mono">REQUEST DELIVERY FLEET</span>
                  <p className="text-slate-300 text-[11px]">
                    {isAr
                      ? 'أسطول متكامل: من التروسيكل والفان إلى النصف نقل والتريلا'
                      : 'From cargo tricycles and delivery vans to pickup trucks and heavy semi-trailers'}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Quick Request Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isAr ? 'أين تريد إرسال شحنتك؟' : 'Where do you want to send something?'}
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isAr ? '12 كابتن متواجد الآن' : '12 Drivers Online'}
                </span>
              </div>

              <form onSubmit={handleQuickRequest} className="space-y-3">
                {/* Pickup & Destination */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {isAr ? 'نقطة الاستلام' : 'Pickup City'}
                    </label>
                    <select
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Zagazig">Zagazig (الزقازيق)</option>
                      <option value="Cairo">Cairo (القاهرة)</option>
                      <option value="10th of Ramadan">10th of Ramadan (العاشر من رمضان)</option>
                      <option value="Mansoura">Mansoura (المنصورة)</option>
                      <option value="New Cairo">New Cairo (التجمع الخامس)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {isAr ? 'وجهة التسليم' : 'Dropoff City'}
                    </label>
                    <select
                      value={dropoffCity}
                      onChange={(e) => setDropoffCity(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="10th of Ramadan">10th of Ramadan (العاشر)</option>
                      <option value="Zagazig">Zagazig (الزقازيق)</option>
                      <option value="Cairo">Cairo (القاهرة)</option>
                      <option value="New Capital">New Capital (العاصمة الإدارية)</option>
                      <option value="Mansoura">Mansoura (المنصورة)</option>
                    </select>
                  </div>
                </div>

                {/* Cargo Description */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {isAr ? 'ما الذي تريد نقله؟' : 'What are you sending?'}
                  </label>
                  <input
                    type="text"
                    value={cargoDesc}
                    onChange={(e) => setCargoDesc(e.target.value)}
                    placeholder="e.g. 3 boxes of electronics, sofa set, commercial pallet"
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                {/* Vehicle Choice selector pills */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {isAr ? 'اختر فئة المركبة المناسبة' : 'Choose Vehicle Category'}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {VEHICLE_CATALOG.slice(0, 4).map((veh) => (
                      <button
                        type="button"
                        key={veh.id}
                        onClick={() => setSelectedVehicle(veh.id)}
                        className={`p-2 rounded-lg text-center border text-[11px] font-medium transition-all ${
                          selectedVehicle === veh.id
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate">{isAr ? veh.nameAr.split(' ')[0] : veh.nameEn.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400">{veh.maxWeightKg}kg</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit action */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
                >
                  <span>{isAr ? 'متابعة وتحديد السعر واستقبال العروض' : 'Continue to Price & Driver Offers'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
