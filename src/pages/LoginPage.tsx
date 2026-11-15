import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Factory, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ username, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
      } else {
        setError(res.message || 'Invalid username or password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF0F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-[#F8B4D0]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#D8276D] to-[#DF538B] flex items-center justify-center text-white shadow-lg shadow-[#D8276D]/30">
            <Factory className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">Tissue Manufacturing</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Enterprise Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-[#D8276D] focus:border-transparent transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FFF5F8] border border-[#F8B4D0] rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-[#D8276D] focus:border-transparent transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#D8276D] hover:bg-[#be185d] text-white font-bold rounded-xl shadow-lg shadow-[#D8276D]/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Plant System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Default credentials: <span className="font-semibold text-black">admin</span> /{' '}
            <span className="font-semibold text-black">admin123</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-1">PostgreSQL Database: tissues @ local-dev</p>
        </div>
      </div>
    </div>
  );
};
