import React from 'react';
import { User } from '../types';
import { GraduationCap, BookOpen, Award, User as UserIcon, LogOut, ShieldAlert, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAITutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAITutor,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              EduSphere LMS
            </span>
            <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              {currentUser ? `${currentUser.role} portal` : 'Learning Platform'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        {currentUser && (
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Course Catalog
            </button>
            {currentUser.role === 'student' && (
              <button
                onClick={() => setActiveTab('my-learning')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'my-learning'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Learning
              </button>
            )}
            {currentUser.role === 'instructor' && (
              <button
                onClick={() => setActiveTab('instructor-courses')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'instructor-courses'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Manage Courses
              </button>
            )}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-panel')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'admin-panel'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Admin Panel
              </button>
            )}
          </nav>
        )}

        {/* Right Action / Profile */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              <button
                onClick={onOpenAITutor}
                className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-sm hover:opacity-95 transition-opacity"
              >
                <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
                <span>AI Tutor</span>
              </button>

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                  <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
