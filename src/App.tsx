import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { PageSkeleton } from './components/SkeletonLoader';

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
    }, 300);
  };

  // If not authenticated and not in initial loading state, show login
  if (!isLoading && !isAuthenticated) {
    return <LoginPage />;
  }

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
      {/* Sidebar Navigation - Always stays visible on the left and interactive */}
      <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Right Content Area Only - Borderless and clean */}
      <main className="flex-1 overflow-y-auto py-3 pr-4 pl-1 md:py-3.5 md:pr-5 md:pl-1 relative">
        <div className="max-w-7xl mx-auto min-h-full">
          {isLoading || isNavigating ? (
            <PageSkeleton tab={currentTab} />
          ) : (
            <Suspense fallback={<PageSkeleton tab={currentTab} />}>
              {renderModuleView()}
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
