import React from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useStore } from '../services/store';

const SIDEBAR_ITEMS = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Media Library', to: '/admin/media', icon: ImageIcon, end: false },
  { label: 'Articles', to: '/admin/articles', icon: FileText, end: false },
  { label: 'Magazine Issues', to: '/admin/issues', icon: BookOpen, end: false },
  { label: 'Scheduling', to: '/admin/scheduler', icon: Calendar, end: false },
  { label: 'Settings', to: '/admin/settings', icon: Settings, end: false },
];

export const AdminLayout: React.FC = () => {
  const { user, authLoading, logout, isLiveBackend } = useStore();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex items-center justify-center text-xs uppercase tracking-[0.25em]">
        Verifying Editorial Access...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex">
      <aside className="w-64 bg-charcoal border-r border-white/10 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
            <div className="font-serif text-xl">
              <span className="italic font-semibold">VEYRAN</span>{' '}
              <span className="italic text-burgundy">LIFE</span>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-[10px] uppercase tracking-[0.22em] text-gold">
              Editorial Studio
            </span>
            <div className="text-[11px] text-ivory/45 mt-0.5">
              {isLiveBackend ? 'Supabase Connected' : 'Local Preview Mode'}
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-xs tracking-wider rounded transition-colors ${
                      isActive
                        ? 'bg-burgundy text-ivory'
                        : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-ivory/70 hover:text-gold px-3 py-2"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs text-ivory/60 hover:text-red-400 px-3 py-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-charcoal/80 border-b border-white/10 px-6 flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-ivory/60">
            Dashboard · {user.name}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/media"
              className="bg-burgundy hover:bg-burgundy-dark text-ivory text-[11px] uppercase tracking-[0.18em] px-4 py-2 transition-colors"
            >
              Upload Media
            </Link>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-gold/40 flex items-center justify-center font-serif italic text-xs">
              VL
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
