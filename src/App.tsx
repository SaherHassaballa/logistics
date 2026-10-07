import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/website/HeroSection';
import { VehicleFleetSection } from './components/website/VehicleFleetSection';
import { ShipmentTypesSection } from './components/website/ShipmentTypesSection';
import { HowItWorksSection } from './components/website/HowItWorksSection';
import { AIOperationsSection } from './components/website/AIOperationsSection';
import { BusinessLogisticsSection } from './components/website/BusinessLogisticsSection';
import { DriverSettlementSection } from './components/website/DriverSettlementSection';
import { TrustSafetyRoadmapSection } from './components/website/TrustSafetyRoadmapSection';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { DriverPortal } from './components/driver/DriverPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SystemSpecsPortal } from './components/architecture/SystemSpecsPortal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#060c18] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        {currentView === 'WEBSITE' && (
          <>
            <HeroSection />
            <VehicleFleetSection />
            <ShipmentTypesSection />
            <HowItWorksSection />
            <AIOperationsSection />
            <BusinessLogisticsSection />
            <DriverSettlementSection />
            <TrustSafetyRoadmapSection />
          </>
        )}

        {currentView === 'CUSTOMER_APP' && <CustomerPortal />}

        {currentView === 'DRIVER_APP' && <DriverPortal />}

        {currentView === 'ADMIN_DASHBOARD' && <AdminDashboard />}

        {currentView === 'SYSTEM_SPECS' && <SystemSpecsPortal />}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
