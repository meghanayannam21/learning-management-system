import React from 'react';
import { User, Course, Enrollment } from '../../types';
import { Shield, Users, BookOpen, Award, CheckCircle, Activity, Server, Database } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  courses,
  enrollments,
}) => {
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalInstructors = users.filter(u => u.role === 'instructor').length;
  const totalRevenue = enrollments.length * 89.99;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">Administrator Control Center</span>
        </div>
        <h1 className="text-3xl font-extrabold">Platform Administration</h1>
        <p className="text-slate-300 text-sm mt-1">Monitor system performance, user directories, and course moderation.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div>
            <span className="block text-2xl font-bold text-white">{users.length}</span>
            <span className="text-xs text-slate-400">Total Users</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">{courses.length}</span>
            <span className="text-xs text-slate-400">Active Courses</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">{enrollments.length}</span>
            <span className="text-xs text-slate-400">Total Enrollments</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</span>
            <span className="text-xs text-slate-400">Platform Revenue</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-bold text-slate-900 text-sm">Express Server</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational (Port 3000)</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-bold text-slate-900 text-sm">In-Memory Database</span>
            <span className="text-xs text-indigo-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Synced & Active</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-bold text-slate-900 text-sm">Gemini AI Service</span>
            <span className="text-xs text-violet-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span>gemini-3.6-flash Connected</span>
            </span>
          </div>
        </div>
      </div>

      {/* User Directory */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Platform User Directory</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-slate-900">{u.name}</span>
                  </td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-rose-50 text-rose-700' :
                      u.role === 'instructor' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
