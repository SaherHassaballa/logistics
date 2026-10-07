import React, { useState } from 'react';
import {
  Truck,
  Sun,
  Moon,
  Globe,
  Layers,
  ChevronRight,
  Menu,
  X,
  Compass,
  Shield,
  Activity,
  Cpu,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView, UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    currentView,
    setCurrentView,
    currentRole,
    setCurrentRole,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = language === 'ar';

  const viewOptions: { id: AppView; labelEn: string; labelAr: string; icon: any }[] = [
    { id: 'WEBSITE', labelEn: 'Public Website', labelAr: 'الموقع التعريفي', icon: Globe },
    { id: 'CUSTOMER_APP', labelEn: 'Customer Web App', labelAr: 'بوابة العميل والشحن', icon: Compass },
    { id: 'DRIVER_APP', labelEn: 'Driver Web App', labelAr: 'تطبيق الكابتن والتحصيل', icon: Truck },
    { id: 'ADMIN_DASHBOARD', labelEn: 'Admin Operations', labelAr: 'لوحة التحكم والعمليات', icon: Activity },
    { id: 'SYSTEM_SPECS', labelEn: 'Tech Specs & Expo', labelAr: 'المعمارية وقاعدة البيانات', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#070d19]/95 backdrop-blur-md transition-colors">
      {/* Top operational announcement banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        <span>
          {isAr
            ? 'منظومة لوجستية ذكية تربط الشاحنين بأسطول مركبات متعدد الفئات في مصر والعالم'
            : 'AI-Native Logistics Operating Platform · Multi-Vehicle Freight Marketplace'}
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-cyan-400 font-medium">
          {isAr ? 'عرض توضيحي حي' : 'Interactive Prototype'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('WEBSITE')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                  REQUEST <span className="text-sky-600 dark:text-sky-400">DELIVERY</span>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-sans tracking-wide">
                {isAr ? 'اطلب دليفري · بضاعتك. سعرك. كابتنك.' : 'اطلب دليفري · Your Goods. Your Price. Your Driver.'}
              </span>
            </div>
          </div>

          {/* View Switcher Segmented Control (Desktop) */}
          <div className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            {viewOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = currentView === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setCurrentView(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isAr ? opt.labelAr : opt.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Action Button */}
            <button
              onClick={() => setCurrentView('CUSTOMER_APP')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/25 active:scale-95 transition-all"
            >
              <span>{isAr ? 'طلب شحنة جديدة' : 'Request Delivery'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d19] px-4 py-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
            {isAr ? 'اختر الواجهة والتطبيق' : 'Select Ecosystem Portal'}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {viewOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = currentView === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setCurrentView(opt.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>{isAr ? opt.labelAr : opt.labelEn}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentView('CUSTOMER_APP');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-sky-600 text-white font-semibold text-center text-sm"
            >
              {isAr ? 'ابدأ طلب توصيل الآن' : 'Request a Delivery Now'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
