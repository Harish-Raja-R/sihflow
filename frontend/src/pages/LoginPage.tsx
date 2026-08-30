import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, KeyRound, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';

const DEMO_ACCOUNTS = [
  { name: 'Harish R', role: 'Team Lead', email: 'lead@sihflow.io' },
  { name: 'Vikas Sharma', role: 'Blockchain Engineer', email: 'blockchain@sihflow.io' },
  { name: 'Ananya Roy', role: 'Security Engineer', email: 'security@sihflow.io' },
  { name: 'Rohan Patel', role: 'Backend Engineer', email: 'backend@sihflow.io' },
  { name: 'Sneha Kulkarni', role: 'Frontend Engineer', email: 'frontend@sihflow.io' },
  { name: 'Kavya Nair', role: 'QA & Documentation', email: 'qa@sihflow.io' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('lead@sihflow.io');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Use Demo@123.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoAccount = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('Demo@123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SihFlow ERP</h1>
          <p className="text-xs text-slate-500 font-medium">
            Internal Project Management System for SIH Team • AcadShield
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lead@sihflow.io"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo@123"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white text-xs"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors shadow-xs"
            >
              {loading ? 'Authenticating...' : 'Sign In to Mission Control'}
            </button>
          </form>
        </Card>

        {/* 1-Click Demo Accounts */}
        <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>1-Click Demo Role Switcher</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectDemoAccount(acc.email)}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                  email === acc.email
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold text-slate-800 truncate">{acc.name}</div>
                <div className="text-[10px] text-emerald-700 font-medium truncate">{acc.role}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
