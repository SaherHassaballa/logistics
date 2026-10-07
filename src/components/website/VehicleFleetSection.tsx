import React, { useState } from 'react';
import {
  Bike,
  Zap,
  Truck,
  Package,
  Car,
  ShieldAlert,
  Container,
  Anchor,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_CATALOG } from '../../data/mockData';
import { VehicleCategory } from '../../types';

export const VehicleFleetSection: React.FC = () => {
  const { language, setCurrentView, createDeliveryRequest } = useApp();
  const isAr = language === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LIGHT' | 'MEDIUM' | 'HEAVY'>('ALL');

  const filteredVehicles = VEHICLE_CATALOG.filter((v) => {
    if (selectedFilter === 'LIGHT') return v.maxWeightKg <= 450;
    if (selectedFilter === 'MEDIUM') return v.maxWeightKg > 450 && v.maxWeightKg <= 3500;
    if (selectedFilter === 'HEAVY') return v.maxWeightKg > 3500;
    return true;
  });

  const getVehicleIcon = (cat: VehicleCategory) => {
    switch (cat) {
      case 'MOTORCYCLE':
        return <Bike className="w-5 h-5" />;
      case 'SCOOTER':
        return <Zap className="w-5 h-5" />;
      case 'CARGO_TRICYCLE':
        return <Truck className="w-5 h-5" />;
      case 'VAN':
        return <Package className="w-5 h-5" />;
      case 'PICKUP':
        return <Car className="w-5 h-5" />;
      case 'SMALL_TRUCK':
        return <ShieldAlert className="w-5 h-5" />;
      case 'MEDIUM_TRUCK':
        return <Container className="w-5 h-5" />;
      case 'LARGE_TRUCK':
        return <Anchor className="w-5 h-5" />;
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  const handleSelectAndBook = (category: VehicleCategory) => {
    createDeliveryRequest({
      selectedVehicle: category,
      recommendedVehicle: category,
    });
    setCurrentView('CUSTOMER_APP');
  };

  return (
    <section id="vehicles" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
              <span>{isAr ? 'أسطول النقل الشامل' : 'Comprehensive Logistics Fleet'}</span>
              <span className="text-slate-400">·</span>
              <span>{isAr ? '8 فئات معتمدة' : '8 Certified Categories'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'من طرد صغير إلى حمولة شاحنة كاملة' : 'From a package to a full truckload.'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {isAr
                ? 'مهما كانت طبيعة أو وزن أو أبعاد بضاعتك، توفر المنصة الفئة الهندسية الملائمة مع كباتن مرخصين ومعدات تأمين متخصصة.'
                : 'Whatever you need to transport, Request Delivery matches your cargo dimensions and weight to verified drivers equipped with appropriate vehicles.'}
            </p>
          </div>

          {/* Filter tabs (functional buttons adhering to zero-pill discipline) */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'جميع المركبات' : 'All Fleet'}
            </button>
            <button
              onClick={() => setSelectedFilter('LIGHT')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                selectedFilter === 'LIGHT'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'خفيف (حتى 450 كجم)' : 'Light (≤450kg)'}
            </button>
            <button
              onClick={() => setSelectedFilter('MEDIUM')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                selectedFilter === 'MEDIUM'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'متوسط (نصف نقل وجامبو)' : 'Medium (Pickup/Jumbo)'}
            </button>
            <button
              onClick={() => setSelectedFilter('HEAVY')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                selectedFilter === 'HEAVY'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'ثقيل (تريلا ومقطورات)' : 'Heavy (Semi-Trailer)'}
            </button>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredVehicles.map((vehicle) => {
            const isMediumOrHeavy = vehicle.maxWeightKg >= 1500;
            return (
              <div
                key={vehicle.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 hover:border-sky-500/60 dark:hover:border-sky-500/60 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Capacity */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                      {getVehicleIcon(vehicle.id)}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                        {isAr ? 'الحمولة القصوى' : 'Payload'}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {vehicle.maxWeightKg >= 1000
                          ? `${(vehicle.maxWeightKg / 1000).toFixed(1)} ${isAr ? 'طن' : 'Tons'}`
                          : `${vehicle.maxWeightKg} ${isAr ? 'كجم' : 'kg'}`}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Name */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {isAr ? vehicle.nameAr : vehicle.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {vehicle.exampleVehicle}
                    </p>
                  </div>

                  {/* Ideal Use Case */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {isAr ? 'الاستخدام الأمثل: ' : 'Ideal for: '}
                    </span>
                    {isAr ? vehicle.idealForAr : vehicle.idealForEn}
                  </div>

                  {/* Dimensions specs */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{isAr ? 'الأبعاد التقريبية:' : 'Dimensions:'}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {isAr ? vehicle.dimensionsAr : vehicle.dimensionsEn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{isAr ? 'سعر البداية التقريبي:' : 'Base estimate:'}</span>
                      <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                        EGP {vehicle.baseFareEgp} + {vehicle.perKmEgp}/km
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleSelectAndBook(vehicle.id)}
                    className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:hover:bg-sky-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{isAr ? 'طلب هذه المركبة' : 'Select Vehicle'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
