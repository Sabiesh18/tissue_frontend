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
  faCircleCheck,
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
    <aside className="w-80 p-5 flex flex-col h-screen select-none font-roboto">
      {/* Floating Card Container with four curved edges */}
      <div className="bg-white rounded-3xl h-full shadow-2xl border border-[#F8B4D0] flex flex-col overflow-hidden">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#F8B4D0]/60 bg-gradient-to-b from-[#FFF5F8] to-white flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D8276D] to-[#DF538B] flex items-center justify-center text-white shadow-lg shadow-[#D8276D]/30 flex-shrink-0">
            <FontAwesomeIcon icon={faIndustry} className="text-xl" />
          </div>
          <div>
            <h1 className="font-black text-lg text-black tracking-tight leading-tight">
              Tissue Mills
            </h1>
            <p className="text-[11px] text-gray-500 font-semibold tracking-wide uppercase">
              Plant Operations
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#D8276D] text-white shadow-lg shadow-[#D8276D]/30 translate-x-1'
                    : 'text-gray-700 hover:bg-[#FFF0F5] hover:text-[#D8276D]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FFF5F8] text-[#D8276D] group-hover:bg-[#D8276D] group-hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 m-3 rounded-2xl bg-[#FFF5F8] border border-[#F8B4D0]/60">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D8276D] to-[#DF538B] text-white flex items-center justify-center font-black text-sm shadow">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-xs font-black text-black truncate max-w-[125px]">
                  {user?.fullName || 'Administrator'}
                </p>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-white text-[#D8276D] rounded-full border border-[#F8B4D0]">
                  {user?.roleCode || user?.roleName || 'ADMIN'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-gray-500 hover:text-white hover:bg-[#D8276D] rounded-xl transition-all shadow-sm bg-white border border-[#F8B4D0]"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold pt-2 border-t border-[#F8B4D0]/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL: tissues (Active)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
