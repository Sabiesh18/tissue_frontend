import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PurchaseOrder, SalesOrder } from '../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';

export const OrdersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchase'>('sales');
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [soRes, poRes] = await Promise.all([api.getSalesOrders(), api.getPurchaseOrders()]);
      if (soRes.success) setSalesOrders(soRes.data || []);
      if (poRes.success) setPurchaseOrders(poRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Commercial Orders & Invoicing</h2>
          <p className="text-sm text-gray-600 mt-1">
            Finished tissue sales orders & raw material procurement purchase orders.
          </p>
        </div>
        <div className="bg-[#FFF5F8] p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sales' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Sales Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'purchase' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Purchase Orders</span>
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : activeTab === 'sales' ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF5F8] text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3.5 px-4">SO Number</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Payment</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {salesOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No customer sales orders recorded yet
                    </td>
                  </tr>
                ) : (
                  salesOrders.map((so) => (
                    <tr key={so.soId} className="hover:bg-[#FFF5F8]/50">
                      <td className="py-3.5 px-4 font-extrabold text-[#D8276D]">{so.soNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-black">{so.customerName}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">{so.orderDate}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-black">
                        ₹{Number(so.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs font-semibold">
                        {so.paymentStatus}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                          {so.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF5F8] text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3.5 px-4">PO Number</th>
                  <th className="py-3.5 px-4">Vendor Supplier</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No purchase orders recorded yet
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((po) => (
                    <tr key={po.poId} className="hover:bg-[#FFF5F8]/50">
                      <td className="py-3.5 px-4 font-extrabold text-[#D8276D]">{po.poNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-black">{po.vendorName}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">{po.orderDate}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-black">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">
                          {po.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
