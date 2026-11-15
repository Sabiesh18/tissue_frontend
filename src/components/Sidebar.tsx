import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Truck,
  Users,
  Factory,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'production', label: 'Manufacturing & Batches', icon: Factory },
    { id: 'inventory', label: 'Inventory & Raw Material', icon: Package },
    { id: 'assets', label: 'Plant Assets & Machinery', icon: Cpu },
    { id: 'vendors', label: 'Vendors & Suppliers', icon: Truck },
    { id: 'customers', label: 'Customers & Clients', icon: Users },
    { id: 'orders', label: 'Sales & Purchase Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings & Administration', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white flex flex-col h-screen shadow-xl border-r border-[#F8B4D0] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#F8B4D0] bg-white flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DF538B] to-[#D8276D] flex items-center justify-center text-white shadow-md">
          <Factory className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-black tracking-tight leading-tight">
            Tissue Manufacturing
          </h1>
          <p className="text-xs text-gray-500 font-medium">Enterprise Management System</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#D8276D] text-white shadow-md shadow-[#D8276D]/20 translate-x-1'
                  : 'text-gray-700 hover:bg-[#FFF0F5] hover:text-[#D8276D]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#D8276D]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout footer */}
      <div className="p-4 border-t border-[#F8B4D0] bg-[#FFF5F8]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D8276D] text-white flex items-center justify-center font-bold text-sm shadow">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-black truncate max-w-[120px]">{user?.fullName || 'User'}</p>
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-[#DF538B]/20 text-[#D8276D] rounded">
                {user?.roleCode || user?.roleName || 'STAFF'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-gray-500 hover:text-[#D8276D] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#F8B4D0]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PostgreSQL (tissues): Connected</span>
        </div>
      </div>
    </aside>
  );
};
