import React, { useState } from 'react';
import {
  FileText,
  Sliders,
  Users,
  Compass,
  KeyRound,
  Coins,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowItWorksSection: React.FC = () => {
  const { language, setCurrentView } = useApp();
  const isAr = language === 'ar';

  const [activeDriverChoice, setActiveDriverChoice] = useState<'ahmed' | 'mohamed' | 'omar'>('ahmed');

  const steps = [
    {
      num: '01',
      titleEn: 'Enter Route & Cargo Specs',
      titleAr: 'حدد خط السير وتفاصيل الشحنة',
      descEn: 'Specify pickup, destination, weight, dimensions, and handling requirements.',
      descAr: 'أدخل موقع الاستلام والتسليم والوزن التقريبي والأبعاد وأي تعليمات خاصة.',
      icon: FileText,
    },
    {
      num: '02',
      titleEn: 'AI Vehicle Recommendation',
      titleAr: 'المنصة توصي بالمركبة الهندسية الملائمة',
      descEn: 'The platform matches your cubic meters and payload to the right vehicle size.',
      descAr: 'تحسب المنصة الحجم والوزن لتوصية المركبة الأمثل لتفادي الحمولة الزائدة والتكلفة المهدورة.',
      icon: Sliders,
    },
    {
      num: '03',
      titleEn: 'Set Your Price or Receive Offers',
      titleAr: 'حدد سعرك أو استقبل عروض الكباتن',
      descEn: 'Propose your budget or receive instant counter-bids from nearby verified drivers.',
      descAr: 'اقترح ميزانيتك أو استقبل عروض أسعار تفاوضية فورية من كباتن متواجدين في محيطك.',
      icon: Users,
    },
    {
      num: '04',
      titleEn: 'Pick Your Driver & Verify Pickup',
      titleAr: 'اختر السائق وبدء الاستلام الموثق',
      descEn: 'Inspect driver ratings, vehicle plates, and confirm handover with digital OTP.',
      descAr: 'راجع تقييمات السائق ورقم اللوحة واعتمد استلام البضاعة برمز OTP موثق.',
      icon: KeyRound,
    },
    {
      num: '05',
      titleEn: 'Live GPS Tracking & Dropoff OTP',
      titleAr: 'تتبع حي لحظي وكود تسليم المستلم',
      descEn: 'Track your shipment on the live telemetry map until recipient signs off with 6-digit OTP.',
      descAr: 'راقب مسار الشحنة على الخريطة حتى يستلم المستلم برمز التحقق السداسي.',
      icon: Compass,
    },
    {
      num: '06',
      titleEn: 'Settlement & Mutual Rating',
      titleAr: 'تسوية الأجرة والتقييم المتبادل',
      descEn: 'Cash or digital payment settled with automated 5-day cycle reconciliation.',
      descAr: 'تسوية نقدية أو رقمية واضحة وموثقة ضمن سجل العمليات الآمن.',
      icon: Coins,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#060c18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
            <span>{isAr ? 'رحلة الشحن المتكاملة' : 'End-to-End Shipment Lifecycle'}</span>
            <span className="text-slate-400">·</span>
            <span>{isAr ? 'نموذج السوق الشفاف' : 'Transparent Marketplace'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'كيف تعمل منصة اطلب دليفري؟' : 'How Request Delivery Works'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'صممنا المنصة لتمنحك تحكماً كاملاً في اختيار السعر والكابتن، مع توثيق صارم لسلسلة الحيازة من لحظة التحميل وحتى التسليم النهائي.'
              : 'Designed with the simplicity of ride-hailing and the flexibility of an open marketplace. You choose who carries your goods based on reputation, vehicle, and price.'}
          </p>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-200 dark:text-slate-800">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {isAr ? step.titleAr : step.titleEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr ? step.descAr : step.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Marketplace Negotiation Showcase */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Explanation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {isAr ? 'نموذج التسعير الماركت بليس' : 'Marketplace Bidding Model'}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {isAr ? 'لا نلزمك بأرخص سعر تلقائياً. الخيار لك.' : 'Your goods. Your price. You choose the driver.'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'تعرض المنصة التقدير الاسترشادي، ويمكنك اقتراح سعرك الخاص. يستقبل الكباتن المعتمدون القريبون طلبك ويقدمون عروضهم مع توضيح وقت الوصول ونوع المركبة وتجهيزاتها.'
                  : 'Unlike rigid delivery apps that assign random couriers, Request Delivery empowers you to evaluate driver track record, vehicle condition, arrival ETA, and price.'}
              </p>

              {/* Pricing Modes Pills (informative static tags) */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {isAr ? '1. السعر التقديري الموصى به: EGP 350 – 450' : '1. Suggested estimate: EGP 350 – 450'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {isAr ? '2. عرض العميل المقترح: EGP 400' : '2. Customer proposed price: EGP 400'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {isAr ? '3. عروض الكباتن المتنافسة في الوقت الفعلي' : '3. Live competitive driver counter-offers'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Driver Comparison Card Interactive Demo */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">
                  {isAr ? 'عروض الكباتن الحالية (3 عروض)' : 'Incoming Driver Offers (3 Haulers)'}
                </span>
                <span className="text-slate-500 font-mono">Zagazig → 10th of Ramadan</span>
              </div>

              {/* Driver 1: Ahmed Hassan */}
              <div
                onClick={() => setActiveDriverChoice('ahmed')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeDriverChoice === 'ahmed'
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Ahmed"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Ahmed Hassan (أحمد حسن)
                        </span>
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Verified Hauler ✓
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> 4.94
                        </span>
                        <span>·</span>
                        <span>342 deliveries</span>
                        <span>·</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Chevrolet T-Series Pickup</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base font-extrabold text-sky-600 dark:text-sky-400">
                      EGP 450
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> 8 mins away
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic">
                  "I have ratchet straps and clean blankets for furniture protection."
                </div>
              </div>

              {/* Driver 2: Mohamed Ali */}
              <div
                onClick={() => setActiveDriverChoice('mohamed')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeDriverChoice === 'mohamed'
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Mohamed"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Mohamed Ali (محمد علي)
                        </span>
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Verified ✓
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> 4.89
                        </span>
                        <span>·</span>
                        <span>218 deliveries</span>
                        <span>·</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Suzuki Carry Cargo Van</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                      EGP 420
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> 14 mins away
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver 3: Omar Samir */}
              <div
                onClick={() => setActiveDriverChoice('omar')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeDriverChoice === 'omar'
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                      alt="Omar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Omar Samir (عمر سمير)
                        </span>
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Verified ✓
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> 4.96
                        </span>
                        <span>·</span>
                        <span>412 deliveries</span>
                        <span>·</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Dayun Cargo Tricycle</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      EGP 400
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> 18 mins away
                    </div>
                  </div>
                </div>
              </div>

                {/* Live Multi-Round Negotiation Timeline Demo Box */}
                <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-sky-500" />
                      <span>{isAr ? 'سجل جولات التفاوض المباشر' : 'Live Direct Negotiation Timeline'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Price Agreed ✓
                    </span>
                  </div>

                  {/* Compact Timeline Rows */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-slate-600 dark:text-slate-300 font-sans">1. Customer Offer:</span>
                      <span className="font-bold">EGP 400</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
                      <span className="font-sans">2. Driver Ahmed Counter-Offer:</span>
                      <span className="font-bold">EGP 450</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-slate-600 dark:text-slate-300 font-sans">3. Customer Counter-Offer:</span>
                      <span className="font-bold">EGP 425</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
                      <span className="font-sans">4. Driver Ahmed Counter-Offer:</span>
                      <span className="font-bold">EGP 435</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-slate-600 dark:text-slate-300 font-sans">5. Customer Counter-Offer:</span>
                      <span className="font-bold">EGP 430</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                      <span className="font-sans">6. Driver Ahmed Accepts:</span>
                      <span className="font-extrabold text-xs">FINAL AGREED PRICE: EGP 430 ✓</span>
                    </div>
                  </div>

                  {/* Transparent Calculation Breakdown */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Agreed Transportation Price:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">EGP 430.00</span>
                    </div>
                    <div className="flex justify-between text-sky-600 dark:text-sky-400">
                      <span>Platform Fee (3% configurable):</span>
                      <span className="font-mono font-bold">- EGP 12.90</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Driver Net Earnings:</span>
                      <span className="font-mono">EGP 417.10</span>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right pt-0.5 font-mono">
                      [Example calculation]
                    </div>
                  </div>
                </div>

                {/* Confirm selection CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('CUSTOMER_APP')}
                    className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>{isAr ? 'تجربة التفاوض المباشر واختيار الكابتن بالتطبيق' : 'Try Direct In-App Negotiation & Tracking'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
