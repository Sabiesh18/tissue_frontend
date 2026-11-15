import React, { useState, useEffect } from 'react';
import { Plus, Play, CheckCircle, Calendar } from 'lucide-react';
import { api } from '../api/client';
import { Batch, ProductionPlan, Product } from '../types';
import { TableSkeleton } from '../components/SkeletonLoader';

export const ProductionView: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'batches' | 'plans'>('batches');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    batchCode: '',
    plannedQuantity: 1000,
    producedQuantity: 0,
    rejectedQuantity: 0,
    wastageKg: 0,
    batchStatus: 'RUNNING',
    shift: 'DAY',
    machineName: 'High-Speed Automatic Toilet Roll Rewinder',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [batchRes, planRes, prodRes] = await Promise.all([
        api.getBatches(),
        api.getProductionPlans(),
        api.getProducts(),
      ]);

      if (batchRes && batchRes.resultData) setBatches(batchRes.resultData);
      if (planRes && planRes.resultData) setPlans(planRes.resultData);
      if (prodRes && prodRes.resultData) setProducts(prodRes.resultData);
    } catch (e) {
      console.error('Failed to load production data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBatch(newBatch);
      setShowBatchModal(false);
      setNewBatch({
        batchCode: '',
        plannedQuantity: 1000,
        producedQuantity: 0,
        rejectedQuantity: 0,
        wastageKg: 0,
        batchStatus: 'RUNNING',
        shift: 'DAY',
        machineName: 'High-Speed Automatic Toilet Roll Rewinder',
      });
      fetchData();
    } catch (e) {
      console.error('Failed to create batch', e);
      alert('Error initiating production batch');
    }
  };

  const handleCompleteBatch = async (batchId: string, planned: number) => {
    const produced = prompt('Enter final produced quantity (Packs):', planned.toString());
    if (produced === null) return;

    const waste = prompt('Enter scrap / pulp wastage (Kg):', '12.5');
    if (waste === null) return;

    try {
      await api.completeBatch(batchId, {
        producedQuantity: parseFloat(produced) || planned,
        rejectedQuantity: 0,
        wastageKg: parseFloat(waste) || 0,
      });
      fetchData();
    } catch (e) {
      console.error('Failed to complete batch', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Manufacturing & Production Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Production planning, batch scheduling, line execution, material consumption & wastage tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#FFF5F8] p-1 rounded-xl flex">
            <button
              onClick={() => setActiveSubTab('batches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'batches' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
              }`}
            >
              Batches
            </button>
            <button
              onClick={() => setActiveSubTab('plans')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'plans' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
              }`}
            >
              Plans
            </button>
          </div>
          <button
            onClick={() => {
              setNewBatch({
                batchCode: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
                plannedQuantity: 1000,
                producedQuantity: 0,
                rejectedQuantity: 0,
                wastageKg: 0,
                batchStatus: 'RUNNING',
                shift: 'DAY',
                machineName: 'High-Speed Automatic Toilet Roll Rewinder',
              });
              setShowBatchModal(true);
            }}
            className="px-4 py-2.5 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Start Production Batch</span>
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : activeSubTab === 'batches' ? (
        /* Batches Table */
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF5F8] text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3.5 px-4">Batch / Machine</th>
                  <th className="py-3.5 px-4">Product Being Manufactured</th>
                  <th className="py-3.5 px-4 text-center">Shift</th>
                  <th className="py-3.5 px-4 text-right">Planned vs Produced</th>
                  <th className="py-3.5 px-4 text-right">Wastage (Kg)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {batches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No active or historical production batches
                    </td>
                  </tr>
                ) : (
                  batches.map((batch) => (
                    <tr key={batch.batchId} className="hover:bg-[#FFF5F8]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black">{batch.batchCode}</div>
                        <div className="text-xs text-gray-500 font-semibold">{batch.machineName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-black">{batch.productName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-xs text-gray-600">
                        {batch.shift}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-black">
                          {Number(batch.producedQuantity).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {' '}
                          / {Number(batch.plannedQuantity).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                        {Number(batch.wastageKg).toFixed(2)} Kg
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                            batch.batchStatus === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700 animate-pulse'
                          }`}
                        >
                          {batch.batchStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {batch.batchStatus === 'RUNNING' && (
                          <button
                            onClick={() => handleCompleteBatch(batch.batchId, batch.plannedQuantity)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 ml-auto"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Plans Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => (
            <div key={plan.planId} className="bg-white rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D8276D] bg-[#FFF0F5] px-2.5 py-1 rounded-md">
                  {plan.planCode}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {plan.status}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-black mt-2">{plan.planName}</h3>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-medium pt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {plan.startDate} to {plan.endDate}
                  </span>
                </div>
                <div className="font-bold text-black">
                  Target: {Number(plan.targetQuantity).toLocaleString()} Packs
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-black mb-4">Start New Production Batch</h3>
            <form onSubmit={handleSaveBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Batch Code</label>
                <input
                  type="text"
                  required
                  value={newBatch.batchCode || ''}
                  onChange={(e) => setNewBatch({ ...newBatch, batchCode: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Product</label>
                <select
                  required
                  value={newBatch.productId || ''}
                  onChange={(e) => setNewBatch({ ...newBatch, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                >
                  <option value="">Select Finished Product...</option>
                  {products.map((p) => (
                    <option key={p.productId} value={p.productId}>
                      {p.productName} ({p.uom})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Planned Quantity</label>
                  <input
                    type="number"
                    required
                    value={newBatch.plannedQuantity || 1000}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, plannedQuantity: parseFloat(e.target.value || '0') })
                    }
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Shift</label>
                  <select
                    value={newBatch.shift || 'DAY'}
                    onChange={(e) => setNewBatch({ ...newBatch, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  >
                    <option value="DAY">Day Shift</option>
                    <option value="NIGHT">Night Shift</option>
                    <option value="SHIFT_A">Shift A (Morning)</option>
                    <option value="SHIFT_B">Shift B (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Manufacturing Machine</label>
                <input
                  type="text"
                  value={newBatch.machineName || ''}
                  onChange={(e) => setNewBatch({ ...newBatch, machineName: e.target.value })}
                  placeholder="e.g. Line 1 Toilet Rewinder"
                  className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Launch Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
