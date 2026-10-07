import React from 'react';
import { Truck, ShieldCheck, FileText, Lock, Globe, MapPin, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { language, setCurrentView } = useApp();
  const isAr = language === 'ar';

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060c18] text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight uppercase">
                REQUEST <span className="text-sky-600 dark:text-sky-400">DELIVERY</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              {isAr
                ? 'المنصة التقنية الذكية لربط أصحاب البضائع والشركات بكباتن ومركبات النقل المعتمدة. من الطرد البريدي وحتى التريلا الكاملة، مع تتبع حي وتسويات مالية منتظمة.'
                : 'The AI-native logistics marketplace and operating system connecting shippers, e-commerce, and commercial enterprises with verified haulers across multi-vehicle fleets.'}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>Cairo · Zagazig · 10th of Ramadan</span>
              </span>
              <span>·</span>
              <span className="font-mono text-sky-600 dark:text-sky-400">RD-OPS-v2.6</span>
            </div>
          </div>

          {/* Platform Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              {isAr ? 'المنصة والخدمات' : 'Ecosystem'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('CUSTOMER_APP')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  <span>{isAr ? 'طلب شحنة (العميل)' : 'Shipper Web App'}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('DRIVER_APP')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  <span>{isAr ? 'تطبيق الكابتن والتحصيل' : 'Driver Partner App'}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('ADMIN_DASHBOARD')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  <span>{isAr ? 'غرفة العمليات المركزية' : 'Operations Command'}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('SYSTEM_SPECS')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  <span>{isAr ? 'المعمارية والـ API' : 'Tech Specs & Schema'}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Fleet Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              {isAr ? 'فئات الأسطول' : 'Vehicle Fleet'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>{isAr ? 'دراجات وسكوتر (طرود سريعة)' : 'Motorcycles & Scooters'}</li>
              <li>{isAr ? 'تروسيكل بضائع (شحن أحياء)' : 'Cargo Tricycle (تروسيكل)'}</li>
              <li>{isAr ? 'فان بضائع مغلق (تجزئة)' : 'Enclosed Cargo Vans'}</li>
              <li>{isAr ? 'سيارات نصف نقل (أثاث ومعدات)' : 'Pickup Trucks (نصف نقل)'}</li>
              <li>{isAr ? 'جامبو وشاحنات متوسطة (3-7 طن)' : 'Jumbo & Medium Trucks'}</li>
              <li>{isAr ? 'تريلات شحن ثقيل (25 طن)' : 'Heavy Commercial Semi-Trailers'}</li>
            </ul>
          </div>

          {/* Trust & Safety Policy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              {isAr ? 'الأمان والامتثال' : 'Trust & Compliance'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isAr ? 'تحقق إلزامي من هوية السائقين' : 'Driver Identity Screening'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5 text-sky-500" />
                <span>{isAr ? 'تسليم برمز تحقق OTP سداسي' : 'Mandatory 6-Digit Recipient OTP'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'سياسة المواد المحظورة والممنوعة' : 'Strict Prohibited Items Policy'}</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                {isAr
                  ? 'يمنع منعاً باتاً نقل المواد القابلة للاشتعال غير المرخصة أو الممنوعات القانونية.'
                  : 'Hazardous chemicals, weapons, and contraband strictly forbidden.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} REQUEST DELIVERY (اطلب دليفري). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sky-600 dark:text-sky-400 font-medium">
              {isAr ? 'Your Goods. Your Price. Your Driver.' : '"Your Goods. Your Price. Your Driver."'}
            </span>
            <span className="text-slate-400">·</span>
            <span>Cairo, Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
