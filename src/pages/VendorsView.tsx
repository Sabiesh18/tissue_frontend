import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Vendor } from '../types';
import { Truck, Plus, Search, Trash2, Edit2, Phone, Mail, MapPin } from 'lucide-react';
import { TableSkeleton } from '../components/SkeletonLoader';

export const VendorsView: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Partial<Vendor> | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.getVendors(search ? { search } : {});
      if (res.success && res.data) {
        setVendors(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor?.vendorCode || !editingVendor?.vendorName) {
      alert('Code and Vendor Name are required');
      return;
    }

    try {
      await api.saveVendor(editingVendor);
      setShowModal(false);
      fetchVendors();
    } catch (e) {
      alert('Failed to save vendor');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this vendor?')) {
      try {
        await api.deleteVendor(id);
        fetchVendors();
      } catch (e) {
        alert('Failed to delete vendor');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Vendors & Raw Material Suppliers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Wood pulp mills, parent reel suppliers, core manufacturers, packaging films & spare parts.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingVendor({
              vendorCode: `VND-${Math.floor(100 + Math.random() * 900)}`,
              vendorName: '',
              companyName: '',
              contactPerson: '',
              email: '',
              phone: '',
              vendorStatus: 'ACTIVE',
              creditPeriodDays: 30,
            });
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Vendors Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-[#F8B4D0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF5F8] border-b border-[#F8B4D0] text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3.5 px-4">Vendor Code / Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Credit Terms</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No vendors registered yet
                    </td>
                  </tr>
                ) : (
                  vendors.map((v) => (
                    <tr key={v.vendorId} className="hover:bg-[#FFF5F8]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black">{v.vendorName}</div>
                        <div className="text-xs text-[#D8276D] font-bold">{v.vendorCode}</div>
                        {v.companyName && (
                          <div className="text-xs text-gray-500">{v.companyName}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-[#D8276D]" />
                          <span>{v.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{v.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {v.city ? `${v.city}, ${v.state}` : 'India'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 rounded-md">
                          {v.creditPeriodDays} Days
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                          {v.vendorStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingVendor(v);
                              setShowModal(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-[#D8276D]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(v.vendorId)}
                            className="p-1.5 text-gray-500 hover:text-rose-600"
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

      {/* Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#F8B4D0]">
            <h3 className="text-xl font-black text-black mb-4">
              {editingVendor?.vendorId ? 'Edit Vendor Details' : 'Register New Vendor'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vendor Code</label>
                  <input
                    type="text"
                    required
                    value={editingVendor?.vendorCode || ''}
                    onChange={(e) => setEditingVendor({ ...editingVendor, vendorCode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brand</label>
                  <input
                    type="text"
                    value={editingVendor?.companyName || ''}
                    onChange={(e) => setEditingVendor({ ...editingVendor, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Vendor Entity Name</label>
                <input
                  type="text"
                  required
                  value={editingVendor?.vendorName || ''}
                  onChange={(e) => setEditingVendor({ ...editingVendor, vendorName: e.target.value })}
                  placeholder="e.g. TNPL Pulp Corporation"
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingVendor?.phone || ''}
                    onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingVendor?.email || ''}
                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingVendor?.city || ''}
                    onChange={(e) => setEditingVendor({ ...editingVendor, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Credit Days</label>
                  <input
                    type="number"
                    value={editingVendor?.creditPeriodDays || 30}
                    onChange={(e) =>
                      setEditingVendor({
                        ...editingVendor,
                        creditPeriodDays: parseInt(e.target.value || '30', 10),
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
