import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faIndustry,
  faBoxesStacked,
  faCogs,
  faTruckFast,
  faUsers,
  faCartShopping,
  faSliders,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartPie },
    { id: 'production', label: 'Manufacturing & Batches', icon: faIndustry },
    { id: 'inventory', label: 'Inventory & Stock', icon: faBoxesStacked },
    { id: 'assets', label: 'Plant Machinery', icon: faCogs },
    { id: 'vendors', label: 'Vendors & Suppliers', icon: faTruckFast },
    { id: 'customers', label: 'Customers & Clients', icon: faUsers },
    { id: 'orders', label: 'Commercial Orders', icon: faCartShopping },
    { id: 'settings', label: 'Administration', icon: faSliders },
  ];

  return (
    <aside className="w-72 py-3 pl-3 pr-2 flex flex-col h-screen select-none font-roboto">
      {/* Floating Card Container with sleek rounded edges and clean shadow - no borders */}
      <div className="bg-white rounded-2xl h-full shadow-xl flex flex-col overflow-hidden">
        {/* Brand Header - Compact */}
        <div className="px-4 py-3.5 bg-gradient-to-b from-[#FFF5F8] to-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D8276D] to-[#DF538B] flex items-center justify-center text-white shadow-md shadow-[#D8276D]/20 flex-shrink-0">
            <FontAwesomeIcon icon={faIndustry} className="text-base" />
          </div>
          <div>
            <h1 className="font-black text-base text-black tracking-tight leading-tight">
              Tissue Mills
            </h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
              Plant Operations
            </p>
          </div>
        </div>

        {/* Navigation List - Reduced gaps between model buttons */}
        <nav className="flex-1 px-2.5 py-2.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#D8276D] text-white shadow-md shadow-[#D8276D]/25 translate-x-0.5'
                    : 'text-gray-700 hover:bg-[#FFF0F5] hover:text-[#D8276D]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors flex-shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FFF5F8] text-[#D8276D] group-hover:bg-[#D8276D] group-hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout Footer - Clean borderless */}
        <div className="p-2.5 m-2 rounded-xl bg-[#FFF5F8]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D8276D] to-[#DF538B] text-white flex items-center justify-center font-black text-xs shadow">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-[11px] font-black text-black truncate max-w-[120px]">
                  {user?.fullName || 'Administrator'}
                </p>
                <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold bg-white text-[#D8276D] rounded-full shadow-sm">
                  {user?.roleCode || user?.roleName || 'ADMIN'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-gray-500 hover:text-white hover:bg-[#D8276D] rounded-lg transition-all shadow-sm bg-white"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold pt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL: tissues (Active)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
