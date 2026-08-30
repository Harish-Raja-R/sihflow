import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import { apiClient } from '../api/client';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('lead@sihflow.io');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.success) {
        login(res.data.data.token, res.data.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickSwitch = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-sm">
            SF
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">SihFlow ERP Sign In</h1>
          <p className="text-xs text-slate-500">Internal Project Management for 6-member SIH Team</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick Switch Demo Member (Password: Demo@123)
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => quickSwitch('lead@sihflow.io')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium text-left truncate"
            >
              👑 Member 1 (Lead)
            </button>
            <button
              onClick={() => quickSwitch('github@sihflow.io')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium text-left truncate"
            >
              🐙 Member 2 (GitHub)
            </button>
            <button
              onClick={() => quickSwitch('security@sihflow.io')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium text-left truncate"
            >
              🔒 Member 3 (Security)
            </button>
            <button
              onClick={() => quickSwitch('backend@sihflow.io')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium text-left truncate"
            >
              ⚙️ Member 4 (Backend)
            </button>
            <button
              onClick={() => quickSwitch('frontend@sihflow.io')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium text-left truncate"
            >
              🎨 Member 5 (Frontend)
            </button>
            <button
              onClick={() => quickSwitch('qa@sihflow.io')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium text-left truncate"
            >
              🧪 Member 6 (QA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
