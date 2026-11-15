import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { ToiletPaperLoader } from './components/ToiletPaperLoader';
import { DashboardSkeleton, TableSkeleton } from './components/SkeletonLoader';

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

  if (isLoading) {
    return <ToiletPaperLoader message="Loading Plant Systems..." />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardView />
          </Suspense>
        );
      case 'production':
        return (
          <Suspense fallback={<TableSkeleton rows={6} columns={7} />}>
            <ProductionView />
          </Suspense>
        );
      case 'inventory':
        return (
          <Suspense fallback={<TableSkeleton rows={6} columns={7} />}>
            <InventoryView />
          </Suspense>
        );
      case 'assets':
        return (
          <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
            <AssetsView />
          </Suspense>
        );
      case 'vendors':
        return (
          <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
            <VendorsView />
          </Suspense>
        );
      case 'customers':
        return (
          <Suspense fallback={<TableSkeleton rows={5} columns={5} />}>
            <CustomersView />
          </Suspense>
        );
      case 'orders':
        return (
          <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
            <OrdersView />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<TableSkeleton rows={6} columns={4} />}>
            <SettingsView />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardView />
          </Suspense>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF0F5]">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto py-3 pr-4 pl-1 md:py-3.5 md:pr-5 md:pl-1">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
