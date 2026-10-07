import React from 'react';
import {
  Wallet,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DriverSettlementSection: React.FC = () => {
  const { language, setCurrentView, platformFeePercentage } = useApp();
  const isAr = language === 'ar';

  return (
    <section id="for-drivers" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#060c18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Driver Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
              <span>{isAr ? 'شراكة الكباتن والناقلين' : 'Driver Partner Economics'}</span>
              <span className="text-slate-400">·</span>
              <span>{isAr ? 'دورة تسوية كل 5 أيام' : '5-Day Settlement Cycle'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? (
                <>
                  أرباحك بيدك. <br />
                  تسويات نقدية واضحة بدون تأخير.
                </>
              ) : (
                <>
                  Your Earnings. Your Terms. <br />
                  Transparent 5-Day Cash Cycles.
                </>
              )}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'تحصيل نقدي يومي مباشر من العملاء، مع دورة تسوية واضحة كل 5 أيام تخصم عمولة المنصة المخفضة البالغة 3% فقط دون أي استقطاعات خفية. نظام ذكي يرسل لك كشف حساب مفصل على هاتفك.'
                : 'Direct cash collection on the road with an automated 5-day reconciliation cycle. Transparent platform fee (currently configurable at 3%) with itemized digital statements and zero hidden deductions.'}
            </p>

            {/* 5-Day Workflow Steps */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>{isAr ? 'مسار دورة التسوية (5 أيام)' : '5-Day Settlement Cycle Workflow'}</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">1. الرحلات</div>
                  <div className="text-[10px] text-slate-400">تحصيل الأجرة نقداً</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">2. المطابقة</div>
                  <div className="text-[10px] text-slate-400">مراجعة الذكاء الاصطناعي</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">3. الكشف</div>
                  <div className="text-[10px] text-slate-400">إشعار فوري للسائق</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">4. الإغلاق</div>
                  <div className="text-[10px] text-slate-400">اعتماد الإدارة والمحفظة</div>
                </div>
              </div>
            </div>

            {/* Verification checklist */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-slate-900 dark:text-slate-200">
                {isAr ? 'متطلبات اعتماد الكابتن الفوري:' : 'Driver Verification Checklist:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? 'بطاقة الرقم القومي سارية' : 'Valid National ID Document'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? 'رخصة قيادة سارية' : 'Professional Driver License'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? 'رخصة تسيير المركبة وفحصها' : 'Vehicle Registration & Inspection'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? 'صورة شخصية وسيلفي أمان' : 'Liveness Selfie Face Match'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('DRIVER_APP')}
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
              >
                <span>{isAr ? 'فتح بوابة الكابتن وتجربة التحصيل' : 'Launch Driver Portal & Test Settlements'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Right Column: Driver Portrait & Realistic Statement Breakdown Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Real photography portrait */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src="/src/assets/images/driver_courier_trust_1791414308243.jpg"
                alt="Verified Request Delivery Partner"
                className="w-full h-56 object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Verified Hauler ✓</span>
              </div>
            </div>

            {/* Authentic 5-Day Statement Card (labeled DEMO DATA as instructed) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    DEMO DATA STATEMENT
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    5-Day Settlement Cycle (#stl-5d-001)
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Ready to Settle
                </span>
              </div>

              {/* Driver info */}
              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Driver Partner:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Ahmed Hassan (أحمد حسن)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Settlement Window:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">Oct 02 – Oct 06 (5 Days)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Completed Deliveries:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">42 shipments</span>
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Cash Collected:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">EGP 18,750.00</span>
                </div>
                <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
                  <span className="flex items-center gap-1">
                    <span>Platform Fee ({platformFeePercentage}%):</span>
                  </span>
                  <span className="font-mono font-bold">- EGP 562.50</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Driver Net Earnings:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">EGP 18,187.50</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Outstanding Remittance:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">EGP 4,250.00</span>
                </div>
              </div>

              {/* Push notification preview */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-sky-50/60 dark:bg-sky-950/30 p-2.5 rounded-lg border border-sky-100 dark:border-sky-900/50">
                <span className="font-semibold text-sky-700 dark:text-sky-300">Driver SMS/Push notification: </span>
                "Hi Ahmed, your statement for the last 5 days is ready. Total collected: EGP 18,750, Platform fee: EGP 562.50. Tap to review in Request app."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
