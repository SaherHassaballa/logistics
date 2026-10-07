import React from 'react';
import {
  Package,
  Briefcase,
  Layers,
  ShoppingBag,
  Armchair,
  FileText,
  Smartphone,
  UtensilsCrossed,
  Wrench,
  Hammer,
  Truck,
  Container,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShipmentCategory } from '../../types';

export const ShipmentTypesSection: React.FC = () => {
  const { language, setCurrentView, createDeliveryRequest } = useApp();
  const isAr = language === 'ar';

  const categories = [
    {
      id: 'FURNITURE' as ShipmentCategory,
      titleEn: 'Furniture & Living Spaces',
      titleAr: 'أثاث منزلي ومكتبي',
      descEn: 'Sofas, bed sets, cabinets, and appliances with protective tie-downs.',
      descAr: 'صالونات، غرف نوم، دواليب وأجهزة منزلية مع أحزمة تثبيت وبطاطين حماية.',
      icon: Armchair,
      vehicle: 'Pickup Truck (نصف نقل)',
    },
    {
      id: 'COMMERCIAL_FREIGHT' as ShipmentCategory,
      titleEn: 'Commercial Freight & Wholesale',
      titleAr: 'بضائع تجارية وباليتات مصانع',
      descEn: 'Palletized cartons, FMCG inventory, and multi-crate merchant distribution.',
      descAr: 'شحنات جملة، طبالي خشبية، وتوزيع كراتين للمعارض والمتاجر.',
      icon: Container,
      vehicle: 'Small/Medium Truck (جامبو)',
    },
    {
      id: 'ELECTRONICS' as ShipmentCategory,
      titleEn: 'Electronics & High Value',
      titleAr: 'أجهزة وإلكترونيات حساسة',
      descEn: 'Screens, computers, industrial controllers in enclosed weather-sealed vans.',
      descAr: 'شاشات، حواسيب، ومعدات إلكترونية في سيارات فان مغلقة ومحمية.',
      icon: Smartphone,
      vehicle: 'Enclosed Cargo Van',
    },
    {
      id: 'DOCUMENTS' as ShipmentCategory,
      titleEn: 'Legal Documents & Contracts',
      titleAr: 'عقود ومستندات رسمية هامة',
      descEn: 'Express tamper-evident pouch delivery with instant signature verification.',
      descAr: 'توصيل مستندات وسندات رسمية في أظرف مؤمنة مع تأكيد فوري بالـ OTP.',
      icon: FileText,
      vehicle: 'Motorcycle Express',
    },
    {
      id: 'SPARE_PARTS' as ShipmentCategory,
      titleEn: 'Automotive & Industrial Parts',
      titleAr: 'قطع غيار سيارات ومعدات',
      descEn: 'Machinery spares, engines, gears, and factory replacement parts.',
      descAr: 'قطع غيار سيارات، مواتير، وتروس ومعدات صيانة للمصانع والورش.',
      icon: Wrench,
      vehicle: 'Cargo Tricycle / Pickup',
    },
    {
      id: 'CONSTRUCTION' as ShipmentCategory,
      titleEn: 'Construction & Raw Materials',
      titleAr: 'مواد بناء وتجهيز مواقع',
      descEn: 'Paints, sanitary fixtures, ceramic tiles, and construction gear.',
      descAr: 'دهانات، أطقم صحية، سيراميك ومستلزمات المقاولات والديكور.',
      icon: Hammer,
      vehicle: 'Pickup / Medium Truck',
    },
    {
      id: 'WAREHOUSE_TRANSFER' as ShipmentCategory,
      titleEn: 'Warehouse-to-Store Logistics',
      titleAr: 'مناقلات المخازن والفروع',
      descEn: 'Inter-branch stock balances and scheduled inventory relocations.',
      descAr: 'نقل مخزون بين الفروع والمستودعات الإقليمية بكفاءة وتوثيق.',
      icon: Layers,
      vehicle: 'Medium / Large Truck',
    },
    {
      id: 'FOOD_PERISHABLES' as ShipmentCategory,
      titleEn: 'Perishables & Food Supply',
      titleAr: 'مواد غذائية وتوريدات مطاعم',
      descEn: 'Restaurant wholesale supplies, bakery crates, and dry bulk provisions.',
      descAr: 'توريدات مطاعم وفنادق، كراتين أغذية ومستلزمات تموينية.',
      icon: UtensilsCrossed,
      vehicle: 'Cargo Van / Tricycle',
    },
  ];

  const handleCategoryClick = (cat: ShipmentCategory) => {
    createDeliveryRequest({
      shipmentCategory: cat,
    });
    setCurrentView('CUSTOMER_APP');
  };

  return (
    <section className="py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
            <span>{isAr ? 'تنوع الحمولات والبضائع' : 'Versatile Cargo Classification'}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'ما الذي يمكن نقله عبر المنصة؟' : 'Specialized for Every Cargo Type'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'سواء كنت مواطناً ينقل أثاث منزله، أو شركة تصنيع تشحن طبالي بضائع بين المحافظات، هناك كابتن مجهز لحمولتك.'
              : 'From personal courier runs to industrial manufacturing logistics, Request Delivery handles your exact freight protocol.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleCategoryClick(item.id)}
                className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 hover:bg-white dark:hover:bg-slate-800 hover:border-sky-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isAr ? item.descAr : item.descEn}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500 dark:text-slate-400">{item.vehicle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
