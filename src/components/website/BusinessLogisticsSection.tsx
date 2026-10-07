import React from 'react';
import { Building2, Layers, Receipt, Shield, Route, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BusinessLogisticsSection: React.FC = () => {
  const { language, setCurrentView } = useApp();
  const isAr = language === 'ar';

  const benefits = [
    {
      titleEn: 'Batch Multi-Drop Routing',
      titleAr: 'توجيه الشحنات متعددة المحطات',
      descEn: 'Upload up to 50 delivery points in one batch; our algorithm chains optimal routing for cargo vans and jumbo trucks.',
      descAr: 'ارفع حتى 50 نقطة تسليم دفعة واحدة؛ تُرتب المنصة خط السير الأمثل لتقليل التكلفة وزمن الرحلة.',
    },
    {
      titleEn: 'Consolidated Tax Invoicing',
      titleAr: 'فواتير ضريبية مجمعة للشركات',
      descEn: 'Monthly or bi-weekly electronic invoicing with VAT compliant itemized shipment manifests.',
      descAr: 'فواتير إلكترونية معتمدة ضريبياً دورية مع كشف تفصيلي بكل بوليصة شحن مستلمة.',
    },
    {
      titleEn: 'Dedicated Hauler Reservation',
      titleAr: 'حجز أسطول كباتن مخصص',
      descEn: 'Pre-schedule pickup trucks and vans for your morning warehouse shifts with SLA commitments.',
      descAr: 'حجز مسبق لسيارات نصف نقل وفانات لورديات التوزيع الصباحية بضمانات تشغيل مؤكدة.',
    },
    {
      titleEn: 'Restricted Item Safeguards',
      titleAr: 'تأمين الحمولات والامتثال',
      descEn: 'Pre-vetted cargo protocols ensuring compliance with state transport and warehouse regulations.',
      descAr: 'فحص مسبق لسلامة البضائع ومطابقتها لمعايير السلامة والنقل التجاري.',
    },
  ];

  return (
    <section id="for-business" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Warehouse Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              <img
                src="/src/assets/images/commercial_warehouse_dispatch_1791414320871.jpg"
                alt="Commercial Logistics Warehouse Dispatch"
                className="w-full h-96 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                  B2B COMMERCIAL LOGISTICS
                </span>
                <h4 className="text-base font-bold">
                  {isAr ? 'شحن المصانع والمستودعات والتجارة الإلكترونية' : 'Warehousing, Wholesale & Retail Replenishment'}
                </h4>
              </div>
            </div>

            {/* Floating metric chip */}
            <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white">Commercial Tier</div>
                <div className="text-slate-500 text-[11px]">B2B portal with volume billing</div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
              <span>{isAr ? 'حلول الأعمال والتجارة' : 'Enterprise & B2B Solutions'}</span>
              <span className="text-slate-400">·</span>
              <span>{isAr ? 'انقل أكثر. أدر أقل.' : 'Move more. Manage less.'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'انقل أكثر. أدر أقل.' : 'Move more. Manage less.'}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'توفر منصة Request Delivery للشركات والمصانع وتجار الجملة بنية تحتية لوجستية ذكية تتكامل مع عملياتك اليومية، وتخلصك من أعباء التفاوض الفردي وصيانة أساطيل النقل الخاصة.'
                : 'Replace fragmented freight brokers with an on-demand multi-vehicle logistics grid. Access transparent pricing, verified drivers with payload guarantees, and single-click invoicing.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {isAr ? b.titleAr : b.titleEn}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isAr ? b.descAr : b.descEn}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('CUSTOMER_APP')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <span>{isAr ? 'فتح حساب تجاري وتجربة الشحن' : 'Launch B2B Shipper Console'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
