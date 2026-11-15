import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faIndustry,
  faBoxesStacked,
  faCogs,
  faTruckFast,
  faUsers,
  faArrowTrendUp,
  faTriangleExclamation,
  faArrowsRotate,
  faCircleDot,
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/client';
import { DashboardSkeleton } from '../components/SkeletonLoader';

interface DashboardMetrics {
  totalAssets: number;
  operationalAssets: number;
  totalProduction: number;
  todayProduction: number;
  totalWastageKg: number;
  lowStockCount: number;
  totalVendors: number;
  totalCustomers: number;
  totalProducts: number;
  productionTrend: Array<{ day: string; produced: number }>;
  recentBatches: Array<{
    batchId: string;
    batchCode: string;
    batchStatus: string;
    producedQuantity: number;
    productName: string;
    machineName: string;
  }>;
}

export const DashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardMetrics();
      if (res && res.resultData) {
        setMetrics(res.resultData);
      }
    } catch (e) {
      console.error('Failed to load metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculated circular gauges
  const operationalRatio =
    metrics?.totalAssets && metrics.totalAssets > 0
      ? Math.round(((metrics.operationalAssets || 0) / metrics.totalAssets) * 100)
      : 100;

  const totalProd = Number(metrics?.totalProduction || 0);
  const totalWaste = Number(metrics?.totalWastageKg || 0);
  const totalVolume = totalProd + totalWaste;
  const yieldEfficiency =
    totalVolume > 0 ? Math.min(100, Math.round((totalProd / totalVolume) * 100)) : 99;

  return (
    <div className="space-y-6 font-roboto">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D8276D] to-[#DF538B] flex items-center justify-center text-white shadow-lg shadow-[#D8276D]/30">
            <FontAwesomeIcon icon={faChartPie} className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-black">Manufacturing Plant Executive Dashboard</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Live telemetry, graphical production analytics, circular yield meters & line status.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFF0F5] text-[#D8276D]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Plant: Operational</span>
          </div>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <FontAwesomeIcon icon={faArrowsRotate} />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Circular Gauge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Production Card with Progress Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Output</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] text-[#D8276D] flex items-center justify-center">
              <FontAwesomeIcon icon={faIndustry} />
            </div>
          </div>
          <div className="my-3">
            <p className="text-3xl font-black text-black">
              {Number(metrics?.totalProduction || 0).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-gray-500 mt-1">Finished Tissue Packs Produced</p>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <span>Today: {Number(metrics?.todayProduction || 0).toLocaleString()}</span>
            </span>
            <span className="text-gray-400">Packs</span>
          </div>
        </div>

        {/* Circular Progress Gauge 1: Machinery Operational Rate */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Plant Uptime</span>
            <p className="text-2xl font-black text-black mt-2">
              {metrics?.operationalAssets || 0} / {metrics?.totalAssets || 0}
            </p>
            <p className="text-xs font-bold text-emerald-600 mt-1">
              {operationalRatio}% Machinery Online
            </p>
          </div>
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#D8276D]"
                strokeDasharray={`${operationalRatio}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-black">{operationalRatio}%</span>
          </div>
        </div>

        {/* Circular Progress Gauge 2: Production Yield Efficiency */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Yield Efficiency</span>
            <p className="text-2xl font-black text-black mt-2">{yieldEfficiency}%</p>
            <p className="text-xs font-bold text-[#D8276D] mt-1">
              Wastage: {Number(metrics?.totalWastageKg || 0).toFixed(1)} kg
            </p>
          </div>
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray={`${yieldEfficiency}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-black">{yieldEfficiency}%</span>
          </div>
        </div>

        {/* Low Stock Alert Circular Indicator */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Stock Threshold</span>
            <p className="text-2xl font-black text-black mt-2">
              {metrics?.lowStockCount || 0}
            </p>
            <p className="text-xs font-bold text-rose-600 mt-1">Reorder Required</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 shadow-inner">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Graphical Bar Charts & Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphical Weekly Production Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-lg text-black">Weekly Production Output (Graphical)</h3>
              <p className="text-xs text-gray-400 font-medium">Daily manufactured pack volumes</p>
            </div>
            <span className="px-3 py-1 bg-[#FFF5F8] text-[#D8276D] font-bold text-xs rounded-full">
              7-Day Trend
            </span>
          </div>

          {/* SVG Vector Bar Graph with High-Density Curves */}
          <div className="h-64 flex items-end justify-between gap-3 px-2 pt-6 pb-2">
            {metrics?.productionTrend && metrics.productionTrend.length > 0 ? (
              metrics.productionTrend.map((item, idx) => {
                const prod = Number(item.produced || 0);
                const maxProd = Math.max(
                  ...metrics.productionTrend.map((t) => Number(t.produced || 0)),
                  1000
                );
                const barHeight = Math.max(12, Math.round((prod / maxProd) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-bold text-[#D8276D] opacity-0 group-hover:opacity-100 transition-opacity">
                      {prod.toLocaleString()}
                    </span>
                    <div
                      style={{ height: `${barHeight}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#D8276D] to-[#DF538B] rounded-2xl shadow-md group-hover:from-[#be185d] group-hover:to-[#D8276D] transition-all transform group-hover:scale-105 relative"
                    >
                      {prod > 0 && (
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80"></div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-600 group-hover:text-[#D8276D]">
                      {item.day}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center text-gray-400 py-12">No trend data available</div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-semibold px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D8276D]"></span>
              <span>Finished Goods Yield (Packs)</span>
            </div>
            <span>Daily Capacity Limit: 10,000 Packs</span>
          </div>
        </div>

        {/* Circular Distribution / Donut Composition Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-black text-lg text-black mb-1">Production vs Wastage</h3>
            <p className="text-xs text-gray-400 font-medium mb-6">Material conversion breakdown</p>

            {/* Circular Visual Ring */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#FFF0F5"
                  strokeWidth="5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#D8276D"
                  strokeWidth="5"
                  strokeDasharray={`${yieldEfficiency}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-black">{yieldEfficiency}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Yield Rate</span>
              </div>
            </div>

            {/* Circular Ring Legend */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF5F8]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#D8276D]"></span>
                  <span className="text-xs font-bold text-gray-800">Finished Goods</span>
                </div>
                <span className="text-xs font-black text-black">
                  {totalProd.toLocaleString()} Packs
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF5F8]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="text-xs font-bold text-gray-800">Scrap / Pulp Loss</span>
                </div>
                <span className="text-xs font-black text-rose-600">
                  {totalWaste.toFixed(2)} Kg
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-bold">
            <span>Plant Target: &gt;95% Yield</span>
            <span className="text-emerald-600">Optimal Standard</span>
          </div>
        </div>
      </div>

      {/* Circle Stat Bubbles & Live Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plant Hub Metrics in Circle Pods */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="font-black text-lg text-black mb-4">Plant Asset & Partner Circles</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-[#FFF5F8] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D8276D] to-[#DF538B] text-white flex items-center justify-center text-lg shadow-md mb-2">
                <FontAwesomeIcon icon={faCogs} />
              </div>
              <p className="text-2xl font-black text-black">{metrics?.totalAssets || 0}</p>
              <p className="text-[11px] font-bold text-gray-500">Plant Machines</p>
            </div>

            <div className="p-4 rounded-3xl bg-[#FFF5F8] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D8276D] to-[#DF538B] text-white flex items-center justify-center text-lg shadow-md mb-2">
                <FontAwesomeIcon icon={faTruckFast} />
              </div>
              <p className="text-2xl font-black text-black">{metrics?.totalVendors || 0}</p>
              <p className="text-[11px] font-bold text-gray-500">Pulp Vendors</p>
            </div>

            <div className="p-4 rounded-3xl bg-[#FFF5F8] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D8276D] to-[#DF538B] text-white flex items-center justify-center text-lg shadow-md mb-2">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <p className="text-2xl font-black text-black">{metrics?.totalCustomers || 0}</p>
              <p className="text-[11px] font-bold text-gray-500">Wholesale Clients</p>
            </div>

            <div className="p-4 rounded-3xl bg-[#FFF5F8] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D8276D] to-[#DF538B] text-white flex items-center justify-center text-lg shadow-md mb-2">
                <FontAwesomeIcon icon={faBoxesStacked} />
              </div>
              <p className="text-2xl font-black text-black">{metrics?.totalProducts || 0}</p>
              <p className="text-[11px] font-bold text-gray-500">Catalog SKUs</p>
            </div>
          </div>
        </div>

        {/* Live Active Batches Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="font-black text-lg text-black mb-4">Live Production Lines</h3>
          <div className="space-y-3">
            {metrics?.recentBatches && metrics.recentBatches.length > 0 ? (
              metrics.recentBatches.map((b) => (
                <div
                  key={b.batchId}
                  className="p-4 rounded-2xl bg-[#FFF5F8]/50 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#D8276D] font-black text-xs shadow-sm">
                      <FontAwesomeIcon icon={faCircleDot} className="animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#D8276D]">{b.batchCode}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            b.batchStatus === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700 animate-pulse'
                          }`}
                        >
                          {b.batchStatus}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-black mt-0.5">{b.productName}</p>
                      <p className="text-[11px] text-gray-400">{b.machineName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-black">
                      {Number(b.producedQuantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">Packs Output</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-400 text-sm">No batches queued</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
