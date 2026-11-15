import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import TissueLoader from './components/TissueLoader';

// Code-split all module pages with React.lazy
const DashboardView = lazy(() =>
  import('./pages/DashboardView').then((m) => ({ default: m.DashboardView }))
);
const ProductionView = lazy(() =>
  import('./pages/ProductionView').then((m) => ({ default: m.ProductionView }))
);
const InventoryView = lazy(() =>
  import('./pages/InventoryView').then((m) => ({ default: m.InventoryView }))
);
const AssetsView = lazy(() =>
  import('./pages/AssetsView').then((m) => ({ default: m.AssetsView }))
);
const VendorsView = lazy(() =>
  import('./pages/VendorsView').then((m) => ({ default: m.VendorsView }))
);
const CustomersView = lazy(() =>
  import('./pages/CustomersView').then((m) => ({ default: m.CustomersView }))
);
const OrdersView = lazy(() =>
  import('./pages/OrdersView').then((m) => ({ default: m.OrdersView }))
);
const SettingsView = lazy(() =>
  import('./pages/SettingsView').then((m) => ({ default: m.SettingsView }))
);

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const handleTabChange = (tab: string) => {
    if (tab === currentTab) return;
    setIsNavigating(true);
    setCurrentTab(tab);
    // Smooth transition inside right content area only
    setTimeout(() => {
      setIsNavigating(false);
    }, 450);
  };

  // If not authenticated and not in initial loading state, show login
  if (!isLoading && !isAuthenticated) {
    return <LoginPage />;
  }

  const getModuleDisplayName = (tab: string) => {
    const map: Record<string, string> = {
      dashboard: 'Executive Dashboard',
      production: 'Manufacturing & Batches',
      inventory: 'Inventory & Stock Records',
      assets: 'Plant Machinery & Assets',
      vendors: 'Vendors & Suppliers Directory',
      customers: 'Client Accounts & Credit Records',
      orders: 'Commercial Sales & Purchase Orders',
      settings: 'System Administration & Security',
    };
    return map[tab] || 'Module';
  };

  const renderModuleView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'production':
        return <ProductionView />;
      case 'inventory':
        return <InventoryView />;
      case 'assets':
        return <AssetsView />;
      case 'vendors':
        return <VendorsView />;
      case 'customers':
        return <CustomersView />;
      case 'orders':
        return <OrdersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF0F5]">
      {/* Sidebar Navigation - Stays visible and interactive */}
      <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Right Content Area Only - TissueLoader is scoped specifically here */}
      <main className="flex-1 overflow-y-auto py-3 pr-4 pl-1 md:py-3.5 md:pr-5 md:pl-1 relative">
        <div className="max-w-7xl mx-auto min-h-full">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#F8B4D0] flex items-center justify-center min-h-[550px]">
              <TissueLoader text="Loading Tissue Manufacturing System..." />
            </div>
          ) : isNavigating ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#F8B4D0] flex items-center justify-center min-h-[550px]">
              <TissueLoader text={`Loading ${getModuleDisplayName(currentTab)}...`} />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#F8B4D0] flex items-center justify-center min-h-[550px]">
                  <TissueLoader text={`Loading ${getModuleDisplayName(currentTab)}...`} />
                </div>
              }
            >
              {renderModuleView()}
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
