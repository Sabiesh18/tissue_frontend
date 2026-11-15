import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardMetrics } from '../types';
import {
  Factory,
  Package,
  Cpu,
  Truck,
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const res = await api.getDashboardMetrics();
      if (res.success && res.data) {
        setMetrics(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, 30000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-[#D8276D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Manufacturing Plant Operations</h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time production, raw material consumption, machinery telemetry & order fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFF0F5] text-[#D8276D] border border-[#F8B4D0]">
            Plant Status: NORMAL
          </span>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-xs font-bold shadow transition-all"
          >
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#F8B4D0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Production</span>
            <div className="p-2.5 rounded-xl bg-[#FFF0F5] text-[#D8276D]">
              <Factory className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-black mt-3">
            {Number(metrics?.totalProduction || 0).toLocaleString()} <span className="text-sm font-semibold text-gray-500">Packs</span>
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Today: {Number(metrics?.todayProduction || 0).toLocaleString()} Packs</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#F8B4D0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Batches</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-black mt-3">
            {metrics?.activeBatches || 0} <span className="text-sm font-semibold text-gray-500">Lines</span>
          </p>
          <p className="mt-2 text-xs text-gray-500 font-medium">Running & Scheduled Machine Jobs</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#F8B4D0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Operational Assets</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-black mt-3">
            {metrics?.operationalAssets || 0} / {metrics?.totalAssets || 0}
          </p>
          <p className="mt-2 text-xs text-emerald-600 font-semibold">100% Machinery Operational</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#F8B4D0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Low Stock Alerts</span>
            <div className={`p-2.5 rounded-xl ${metrics?.lowStockCount ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-black mt-3">
            {metrics?.lowStockCount || 0} <span className="text-sm font-semibold text-gray-500">Items</span>
          </p>
          <p className="mt-2 text-xs text-rose-600 font-semibold">Below minimum reorder threshold</p>
        </div>
      </div>

      {/* Production & Wastage Trends + Plant Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Trend Table / Visualization */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg text-black">Weekly Production & Material Wastage</h3>
            <span className="text-xs font-semibold text-gray-500">Last 7 Days (PG Function Aggregation)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F8B4D0] text-xs font-bold text-gray-500 uppercase">
                  <th className="py-3 px-3">Day / Date</th>
                  <th className="py-3 px-3 text-right">Finished Goods (Packs)</th>
                  <th className="py-3 px-3 text-right">Pulp Wastage (Kg)</th>
                  <th className="py-3 px-3 text-right">Yield Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {metrics?.productionTrend && metrics.productionTrend.length > 0 ? (
                  metrics.productionTrend.map((row, idx) => {
                    const prod = Number(row.produced || 0);
                    const waste = Number(row.wastage || 0);
                    const efficiency = prod > 0 ? ((prod / (prod + waste * 2)) * 100).toFixed(1) + '%' : '-';
                    return (
                      <tr key={idx} className="hover:bg-[#FFF5F8] transition-colors">
                        <td className="py-3 px-3 font-bold text-black">
                          {row.day} <span className="text-xs font-normal text-gray-500">({row.date})</span>
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-[#D8276D]">
                          {prod.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700">{waste.toFixed(2)} kg</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">{efficiency}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      No production history recorded for the current week
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plant Overview & Counts */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0] flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-black mb-4">Enterprise Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF5F8] border border-[#F8B4D0]/50">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#D8276D]" />
                  <span className="text-sm font-bold text-black">Approved Vendors</span>
                </div>
                <span className="font-extrabold text-base text-[#D8276D]">{metrics?.totalVendors || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF5F8] border border-[#F8B4D0]/50">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#D8276D]" />
                  <span className="text-sm font-bold text-black">Active Customers</span>
                </div>
                <span className="font-extrabold text-base text-[#D8276D]">{metrics?.totalCustomers || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF5F8] border border-[#F8B4D0]/50">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#D8276D]" />
                  <span className="text-sm font-bold text-black">Catalog Products</span>
                </div>
                <span className="font-extrabold text-base text-[#D8276D]">{metrics?.totalProducts || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF5F8] border border-[#F8B4D0]/50">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-[#D8276D]" />
                  <span className="text-sm font-bold text-black">Total Wastage Recorded</span>
                </div>
                <span className="font-extrabold text-base text-rose-600">
                  {Number(metrics?.totalWastageKg || 0).toFixed(2)} kg
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Database: local-dev (tissues)</span>
            <span className="text-emerald-600 font-bold">Synchronized</span>
          </div>
        </div>
      </div>

      {/* Recent Production Batches & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Batches */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0]">
          <h3 className="font-extrabold text-lg text-black mb-4">Recent Production Batches</h3>
          <div className="space-y-3">
            {metrics?.recentBatches && metrics.recentBatches.length > 0 ? (
              metrics.recentBatches.map((batch) => (
                <div
                  key={batch.batchId}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-[#F8B4D0] bg-[#FFF5F8]/40 flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#D8276D]">{batch.batchCode}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          batch.batchStatus === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : batch.batchStatus === 'RUNNING'
                            ? 'bg-amber-100 text-amber-700 animate-pulse'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {batch.batchStatus}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-black mt-1">{batch.productName}</p>
                    <p className="text-[11px] text-gray-500">{batch.machineName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-black">
                      {Number(batch.producedQuantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-500">Produced</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">No batches recorded</p>
            )}
          </div>
        </div>

        {/* Live Manufacturing Line Equipment Status */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0]">
          <h3 className="font-extrabold text-lg text-black mb-4">Primary Plant Equipment</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#FFF5F8]/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black">High-Speed Automatic Toilet Roll Rewinder</p>
                <p className="text-xs text-gray-500">Line 1 · 2800mm Web Width · Auto Core Feeder</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                ONLINE
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#FFF5F8]/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black">Facial Tissue Interfolding & Box Filling Line</p>
                <p className="text-xs text-gray-500">Line 2 · 400 pulls/min · Vacuum Folding</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                ONLINE
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#FFF5F8]/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black">Double Steel-to-Rubber Embossing Unit</p>
                <p className="text-xs text-gray-500">Line 1 · Heated Cylinders · Deslitter</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                ONLINE
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#FFF5F8]/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black">Automatic Shrink Wrap & Poly Bagging Machine</p>
                <p className="text-xs text-gray-500">Packaging Bay · 80 Packs/min · Thermal Tunnel</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
