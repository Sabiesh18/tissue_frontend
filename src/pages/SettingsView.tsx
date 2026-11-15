import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SystemSetting, ActivityLog, User } from '../types';
import { Settings, Shield, History, Users, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'logs'>('settings');
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, uRes, lRes] = await Promise.all([
        api.getSettings(),
        api.getUsers(),
        api.getLogs(),
      ]);
      if (sRes.success) setSettings(sRes.data || []);
      if (uRes.success) setUsers(uRes.data || []);
      if (lRes.success) setLogs(lRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSetting = async (key: string, val: string) => {
    try {
      await api.saveSetting({ settingKey: key, settingValue: val });
      alert(`Setting ${key} updated successfully`);
      fetchData();
    } catch (e) {
      alert('Error saving setting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Settings & Administration</h2>
          <p className="text-sm text-gray-600 mt-1">
            Plant system configurations, user RBAC privileges and immutable PostgreSQL activity logs.
          </p>
        </div>
        <div className="bg-[#FFF5F8] p-1 rounded-xl border border-[#F8B4D0] flex">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'settings' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
            }`}
          >
            System Parameters
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'logs' ? 'bg-[#D8276D] text-white shadow' : 'text-gray-600'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#F8B4D0]">
          <h3 className="text-lg font-black text-black mb-4">Enterprise Parameters</h3>
          <div className="divide-y divide-gray-100">
            {settings.map((s) => (
              <div key={s.settingId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-black">{s.settingKey}</p>
                  <p className="text-xs text-gray-500">{s.description || 'System setting'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    defaultValue={s.settingValue}
                    onBlur={(e) => {
                      if (e.target.value !== s.settingValue) {
                        handleSaveSetting(s.settingKey, e.target.value);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#D8276D]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-[#F8B4D0] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF5F8] border-b border-[#F8B4D0] text-xs font-bold text-gray-600 uppercase">
                <th className="py-3.5 px-4">Username / Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.map((u) => (
                <tr key={u.userId} className="hover:bg-[#FFF5F8]/50">
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-black">{u.fullName}</div>
                    <div className="text-xs text-[#D8276D] font-bold">@{u.username}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{u.roleName}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{u.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl shadow-md border border-[#F8B4D0] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF5F8] border-b border-[#F8B4D0] text-xs font-bold text-gray-600 uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {logs.map((log) => (
                <tr key={log.activityId} className="hover:bg-[#FFF5F8]/50">
                  <td className="py-2.5 px-4 text-gray-500">{log.createdAt}</td>
                  <td className="py-2.5 px-4 font-bold text-black">{log.module}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-pink-100 text-[#D8276D] font-semibold">
                      {log.activityType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-gray-700">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
