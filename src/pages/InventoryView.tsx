import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { InventoryItem, Product } from '../types';
import { Package, AlertTriangle, ArrowDownUp, RefreshCw, Layers } from 'lucide-react';
import { formatLabel } from '../utils/formatters';

export const InventoryView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [adjustModal, setAdjustModal] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<string>('INWARD_PURCHASE');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.getInventory({ lowStockOnly: lowStockFilter ? 'true' : 'false' });
      if (res.success && res.data) {
        setInventory(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockFilter]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModal) return;

    try {
      await api.adjustStock({
        productId: adjustModal.productId,
        movementType: adjustType,
        quantity: adjustQty,
        referenceType: 'MANUAL_ADJUST',
        notes: 'Manual inventory adjustment via management portal',
      });
      alert('Stock successfully updated!');
      setAdjustModal(null);
      fetchInventory();
    } catch (e) {
      alert('Error updating stock');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Inventory & Raw Material Stock</h2>
          <p className="text-sm text-gray-600 mt-1">
            Virgin pulp parent reels, cardboard cores, packaging film, shrink rolls & finished goods.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              lowStockFilter
                ? 'bg-rose-600 text-white border-rose-600 shadow'
                : 'bg-[#FFF5F8] text-[#D8276D] border-[#F8B4D0]'
            }`}
          >
            {lowStockFilter ? 'Showing Low Stock Alerts' : 'Filter Low Stock Only'}
          </button>
          <button
            onClick={fetchInventory}
            className="p-2.5 bg-white border border-[#F8B4D0] text-gray-600 hover:text-[#D8276D] rounded-xl shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-md border border-[#F8B4D0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF5F8] border-b border-[#F8B4D0] text-xs font-bold text-gray-600 uppercase">
                <th className="py-3.5 px-4">Item Code / Product Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Current Stock</th>
                <th className="py-3.5 px-4 text-right">Min Level</th>
                <th className="py-3.5 px-4 text-center">Stock Health</th>
                <th className="py-3.5 px-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Loading inventory records...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No inventory records match the current view
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.inventoryId} className="hover:bg-[#FFF5F8]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-black">{item.productName}</div>
                      <div className="text-xs text-[#D8276D] font-bold">{item.productCode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                        {formatLabel(item.productType)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">
                      {formatLabel(item.warehouseLocation)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-black text-base">
                        {Number(item.currentStock).toLocaleString()}
                      </span>{' '}
                      <span className="text-xs font-bold text-gray-500">{item.uom}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-gray-500">
                      {Number(item.minimumStockLevel).toLocaleString()} {item.uom}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                          <AlertTriangle className="w-3 h-3" />
                          <span>LOW STOCK</span>
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                          HEALTHY
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustModal(item);
                          setAdjustQty(100);
                          setAdjustType('INWARD_PURCHASE');
                        }}
                        className="px-3 py-1.5 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 ml-auto"
                      >
                        <ArrowDownUp className="w-3.5 h-3.5" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F8B4D0]">
            <h3 className="text-xl font-black text-black mb-1">Stock Adjustment</h3>
            <p className="text-xs text-gray-500 mb-4">{adjustModal.productName}</p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm font-semibold"
                >
                  <option value="INWARD_PURCHASE">Stock Inward (+)</option>
                  <option value="OUTWARD_SALE">Dispatch / Sale Outward (-)</option>
                  <option value="PROD_OUTPUT">Production Output (+)</option>
                  <option value="WASTAGE">Damaged / Scrap (-)</option>
                  <option value="ADJUSTMENT">Direct Stock Calibration (=)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Quantity ({adjustModal.uom})
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseFloat(e.target.value || '0'))}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 text-xs text-gray-600 flex justify-between">
                <span>Current Stock:</span>
                <span className="font-bold text-black">
                  {adjustModal.currentStock} {adjustModal.uom}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
