import React, { useState } from 'react';
import { User } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import { Mail, Lock, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }
      onLogin(data.user);
    } catch (err: any) {
      // Fallback check against INITIAL_USERS if backend error
      const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        onLogin(found);
      } else {
        setError(err.message || 'User not found. Please register an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (found) {
      onLogin(found);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back to EduSphere</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to access your dashboard, courses, and AI tutor.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@lms.edu"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('student@lms.edu')}
              className="p-2 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-xl text-center transition-all group"
            >
              <span className="block text-xs font-bold text-slate-700 group-hover:text-indigo-700">Student</span>
              <span className="text-[10px] text-slate-400">Alex</span>
            </button>
            <button
              onClick={() => handleDemoLogin('marcus.chen@lms.edu')}
              className="p-2 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-xl text-center transition-all group"
            >
              <span className="block text-xs font-bold text-slate-700 group-hover:text-indigo-700">Instructor</span>
              <span className="text-[10px] text-slate-400">Marcus</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin@lms.edu')}
              className="p-2 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-xl text-center transition-all group"
            >
              <span className="block text-xs font-bold text-slate-700 group-hover:text-indigo-700">Admin</span>
              <span className="text-[10px] text-slate-400">Eleanor</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-semibold text-indigo-600 hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};
