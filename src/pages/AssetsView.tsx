import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react';
import { api } from '../api/client';
import { Asset } from '../types';
import { TableSkeleton } from '../components/SkeletonLoader';

export const AssetsView: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await api.getAssets({
        search: search || undefined,
        category: category || undefined,
      });
      if (res && res.resultData) {
        setAssets(res.resultData);
      }
    } catch (e) {
      console.error('Failed to fetch assets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    try {
      if (editingAsset.assetId) {
        await api.updateAsset(editingAsset.assetId, editingAsset);
      } else {
        await api.createAsset(editingAsset);
      }
      setShowModal(false);
      setEditingAsset(null);
      fetchAssets();
    } catch (e) {
      console.error('Failed to save asset', e);
      alert('Error saving asset details');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this machinery/asset?')) return;
    try {
      await api.deleteAsset(id);
      fetchAssets();
    } catch (e) {
      console.error('Failed to delete asset', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Plant Machinery & Asset Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track rewinding lines, embossing units, interfolders, packaging machines & utility equipment.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAsset({
              assetCode: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
              assetName: '',
              category: 'MACHINERY',
              conditionStatus: 'OPERATIONAL',
              quantity: 1,
              purchaseCost: 0,
              currentValue: 0,
              locationArea: 'Plant Floor Line 1',
            });
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset code, machinery name or floor location..."
            className="w-full pl-10 pr-4 py-2 bg-[#FFF5F8] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
          />
        </form>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 bg-[#FFF5F8] rounded-xl text-sm font-semibold text-black focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="MACHINERY">Manufacturing Machinery</option>
          <option value="VEHICLE">Plant Forklifts & Vehicles</option>
          <option value="TOOLS">Precision Tools & Dies</option>
          <option value="ELECTRICAL">Transformers & Generators</option>
        </select>
      </div>

      {/* Asset Table */}
      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF5F8] text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3.5 px-4">Code / Asset Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Purchase Cost</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No plant assets found matching the criteria
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.assetId} className="hover:bg-[#FFF5F8]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black">{asset.assetName}</div>
                        <div className="text-xs text-[#D8276D] font-bold">{asset.assetCode}</div>
                        {asset.serialNumber && (
                          <div className="text-[11px] text-gray-400">SN: {asset.serialNumber}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-pink-50 text-pink-700">
                          {asset.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        <div className="flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-[#D8276D]" />
                          <span>{asset.locationArea || 'Main Facility'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-black">
                        ₹{Number(asset.purchaseCost).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                            asset.conditionStatus === 'OPERATIONAL'
                              ? 'bg-emerald-100 text-emerald-700'
                              : asset.conditionStatus === 'MAINTENANCE'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {asset.conditionStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingAsset(asset);
                              setShowModal(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-[#D8276D] hover:bg-white rounded-lg shadow-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(asset.assetId)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-white rounded-lg shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-black mb-4">
              {editingAsset?.assetId ? 'Edit Plant Asset' : 'Register New Asset'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Asset Code</label>
                  <input
                    type="text"
                    required
                    value={editingAsset?.assetCode || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, assetCode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingAsset?.category || 'MACHINERY'}
                    onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  >
                    <option value="MACHINERY">Machinery</option>
                    <option value="VEHICLE">Vehicle</option>
                    <option value="TOOLS">Tools</option>
                    <option value="ELECTRICAL">Electrical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Asset / Machine Name</label>
                <input
                  type="text"
                  required
                  value={editingAsset?.assetName || ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, assetName: e.target.value })}
                  placeholder="e.g. Automatic Napkin Folding Line"
                  className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location Area</label>
                  <input
                    type="text"
                    value={editingAsset?.locationArea || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, locationArea: e.target.value })}
                    placeholder="e.g. Line 1, Bay B"
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Operational Status</label>
                  <select
                    value={editingAsset?.conditionStatus || 'OPERATIONAL'}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, conditionStatus: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="IDLE">IDLE</option>
                    <option value="SCRAPPED">SCRAPPED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={editingAsset?.purchaseCost || 0}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, purchaseCost: parseFloat(e.target.value || '0') })
                    }
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={editingAsset?.serialNumber || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, serialNumber: e.target.value })}
                    placeholder="e.g. SN-2024-88"
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
