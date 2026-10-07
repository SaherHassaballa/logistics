import React from 'react';
import {
  ShieldAlert,
  Lock,
  Camera,
  MapPin,
  KeyRound,
  FileCheck2,
  AlertTriangle,
  Milestone,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrustSafetyRoadmapSection: React.FC = () => {
  const { language, setCurrentView } = useApp();
  const isAr = language === 'ar';

  const roadmapPhases = [
    {
      phase: 'PHASE 01',
      titleEn: 'Multi-Vehicle Marketplace MVP',
      titleAr: 'إطلاق سوق الشحن متعدد المركبات (MVP)',
      status: 'CURRENT',
      descEn: 'Customer order flow, driver counter-offers, OTP verification, 5-day cash settlements.',
      descAr: 'طلب الشحنة، عروض الكباتن، كود التسليم OTP، ودورة تسوية الـ 5 أيام.',
    },
    {
      phase: 'PHASE 02',
      titleEn: 'Native Mobile Apps (React Native + Expo)',
      titleAr: 'تطبيقات الهاتف الأصلية (iOS وأندرويد)',
      status: 'NEXT',
      descEn: 'Background GPS geofencing, native camera cargo capture, push notifications.',
      descAr: 'تتبع جغرافي بالخلفية، رفع صور التحميل الأصلية، وتنبيهات فورية.',
    },
    {
      phase: 'PHASE 03',
      titleEn: 'Autonomous AI Operations Sentinel',
      titleAr: 'حراس العمليات بالذكاء الاصطناعي',
      descEn: 'Real-time bottleneck detection, route rerouting, automated fraud & dispute triaging.',
      descAr: 'اكتشاف التكدس المروري، إعادة توجيه المسارات، وفحص النزاعات آلياً.',
    },
    {
      phase: 'PHASE 04',
      titleEn: 'Enterprise B2B TMS Suite',
      titleAr: 'بوابة الشركات وإدارة أساطيل المصانع',
      descEn: 'Multi-warehouse batch dispatch, API webhooks, consolidated e-invoices.',
      descAr: 'شحن دفعات المستودعات، ربط برمجي API، وفواتير إلكترونية معتمدة.',
    },
    {
      phase: 'PHASE 05',
      titleEn: 'Regional MENA Expansion',
      titleAr: 'التوسع الإقليمي (الخليج وشمال أفريقيا)',
      status: 'FUTURE',
      descEn: 'Cross-border freight documentation and regional multi-currency support.',
      descAr: 'تخليص بوالص الشحن عبر الحدود ودعم العملات الإقليمية.',
    },
  ];

  const prohibitedGoods = [
    { en: 'Flammables & unlicensed gas cylinders', ar: 'المواد القابلة للاشتعال واسطوانات الغاز غير المرخصة' },
    { en: 'Weapons, explosives & military gear', ar: 'الأسلحة والذخائر والمعدات العسكرية' },
    { en: 'Illegal narcotics & contraband items', ar: 'المخدرات والممنوعات القانونية بكافة أشكالها' },
    { en: 'Uninspected hazardous corrosive chemicals', ar: 'المواد الكيميائية السامة والأحماض الحارقة' },
  ];

  return (
    <section className="py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Chain of Custody Trust Pillar */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{isAr ? 'حماية البضائع وسلسلة الحيازة' : 'Chain of Custody & Security'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'توثيق أمان كامل لكل خطوة في الطريق' : 'Zero Ambiguity. Cryptographic Handover.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isAr
                ? 'لا يتم تسليم أي بضاعة بدون إدخال رمز التحقق الرقمي OTP الصادر لهاتف المستلم، مع تسجيل التوقيت والإحداثيات وصور التحميل.'
                : 'Every package handover is mathematically recorded with 6-digit OTP recipient tokens, precise GPS coordinates, and inspection photography.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2">
              <Camera className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'صور التحميل والاستلام' : 'Loading Inspection'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'توثيق حالة البضاعة قبل انطلاق المركبة لحماية الطرفين.' : 'Driver captures cargo condition before departure to seal physical condition.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2">
              <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'مسار GPS غير قابل للتعديل' : 'Tamper-Proof GPS'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'تسجيل إحداثيات خط السير وسرعة المركبة بصورة مستمرة.' : 'Continuous route sampling and telemetry logs stored in audit registry.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2">
              <KeyRound className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'رمز OTP سداسي عند التسليم' : '6-Digit Recipient OTP'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'لا تكتمل الرحلة في النظام إلا بعد إدخال الكود المرسل للمستلم.' : 'Delivery closes only when recipient provides their dynamic verification token.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2">
              <FileCheck2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'مركز فض النزاعات' : 'Dispute Evidence Desk'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'تحقيق فوري في أي تلف أو نقص بالرجوع لسجل الأدلة المتكامل.' : 'Dedicated operations panel with photo, GPS, and timestamp chain-of-custody.'}
              </p>
            </div>
          </div>
        </div>

        {/* Prohibited Items Policy Callout */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>{isAr ? 'سياسة المواد المحظورة والممنوعة قانوناً' : 'Strict Prohibited & Restricted Cargo Policy'}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {isAr
              ? 'تلتزم منصة Request Delivery بالقوانين المنظمة للنقل البري للبضائع. يُحظر تماماً نقل أي من المواد التالية، ويتحمل المرسل كامل المسؤولية القانونية:'
              : 'Request Delivery strictly prohibits transportation of unlawful or hazardous goods. All haulers are instructed to decline pickup upon suspicion:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            {prohibitedGoods.map((item, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{isAr ? item.ar : item.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Startup Product Roadmap (Honest, Early-Stage, Transparent) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <Milestone className="w-3.5 h-3.5" />
              <span>{isAr ? 'خارطة طريق تطوير المنصة' : 'Product Evolution Roadmap'}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'خطوات بناء منصة النقل الذكية' : 'Architected for Global Scale'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'رؤية تقنية واضحة للانتقال من نموذج السوق إلى شبكة لوجستية ذكية عابرة للحدود.'
                : 'A disciplined multi-phase release path with unified backend APIs and cross-platform native clients.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roadmapPhases.map((rp, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  rp.status === 'CURRENT'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-1 ring-sky-500/50'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-sky-600 dark:text-sky-400">{rp.phase}</span>
                    {rp.status === 'CURRENT' && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-sans">Active MVP</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                    {isAr ? rp.titleAr : rp.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isAr ? rp.descAr : rp.descEn}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                  {rp.status === 'CURRENT' ? 'Live Prototype' : 'Scheduled Architecture'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 lg:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isAr ? 'جاهز لنقل شحنتك بالسعر الذي تختاره؟' : 'Ready to Move Your Goods with Verified Haulers?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'جرب الآن واجهة طلب الشحنات أو استعرض عروض الكباتن ونظام التتبع المباشر.'
                : 'Experience the Request Delivery ecosystem. Propose your fare, receive multi-vehicle counter-offers, and track with live GPS.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('CUSTOMER_APP')}
                className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95"
              >
                {isAr ? 'ابدأ طلب توصيل الآن' : 'Request Delivery Now'}
              </button>
              <button
                onClick={() => setCurrentView('DRIVER_APP')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                {isAr ? 'بوابة الكباتن والتحصيل' : 'Driver Partner Cockpit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
