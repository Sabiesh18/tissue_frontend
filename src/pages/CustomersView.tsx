import React, { useState, useEffect } from 'react';
import { Plus, Phone } from 'lucide-react';
import { api } from '../api/client';
import { Customer } from '../types';
import { TableSkeleton } from '../components/SkeletonLoader';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCust, setNewCust] = useState<Partial<Customer>>({
    customerCode: '',
    customerName: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    creditLimit: 200000,
    customerStatus: 'ACTIVE',
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomers();
      if (res && res.resultData) {
        setCustomers(res.resultData);
      }
    } catch (e) {
      console.error('Failed to load customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCustomer(newCust);
      setShowModal(false);
      setNewCust({
        customerCode: '',
        customerName: '',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        creditLimit: 200000,
        customerStatus: 'ACTIVE',
      });
      fetchCustomers();
    } catch (e) {
      console.error('Failed to create customer', e);
      alert('Error saving customer record');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Customer & Wholesale Accounts</h2>
          <p className="text-sm text-gray-600 mt-1">
            Hotels, hospital networks, retail supermarkets, restaurants & distributors.
          </p>
        </div>
        <button
          onClick={() => {
            setNewCust({
              customerCode: `CUST-${Math.floor(100 + Math.random() * 900)}`,
              customerName: '',
              companyName: '',
              contactPerson: '',
              email: '',
              phone: '',
              creditLimit: 200000,
              customerStatus: 'ACTIVE',
            });
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-[#D8276D] hover:bg-[#be185d] text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Customers Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF5F8] text-xs font-bold text-gray-600 uppercase">
                  <th className="py-3.5 px-4">Customer / Organization</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">City / Region</th>
                  <th className="py-3.5 px-4 text-right">Credit Limit</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No customers registered yet
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.customerId} className="hover:bg-[#FFF5F8]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black">{c.customerName}</div>
                        <div className="text-xs text-[#D8276D] font-bold">{c.customerCode}</div>
                        {c.companyName && (
                          <div className="text-xs text-gray-500">{c.companyName}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs space-y-1">
                        <div className="font-bold text-gray-800">{c.contactPerson || 'Direct'}</div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">
                        {c.city ? `${c.city}, ${c.state || 'India'}` : 'Tamil Nadu'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-black">
                        ₹{Number(c.creditLimit).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                          {c.customerStatus}
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

      {/* Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-black mb-4">Register Client Account</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Customer Code</label>
                  <input
                    type="text"
                    required
                    value={newCust.customerCode || ''}
                    onChange={(e) => setNewCust({ ...newCust, customerCode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brand</label>
                  <input
                    type="text"
                    value={newCust.companyName || ''}
                    onChange={(e) => setNewCust({ ...newCust, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCust.customerName || ''}
                  onChange={(e) => setNewCust({ ...newCust, customerName: e.target.value })}
                  placeholder="e.g. Apollo Hospitals"
                  className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newCust.phone || ''}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={newCust.creditLimit || 0}
                    onChange={(e) =>
                      setNewCust({ ...newCust, creditLimit: parseFloat(e.target.value || '0') })
                    }
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
