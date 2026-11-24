import React from 'react';
import { RotateCcw, Database } from 'lucide-react';
import { useStore } from '../../services/store';

export const SettingsPage: React.FC = () => {
  const { settings, issues, updateSettings, resetDemoData, isLiveBackend } = useStore();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif italic text-3xl">Studio Settings</h1>

      <div className="bg-charcoal border border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold">
          <Database className="w-4 h-4" /> Backend Status
        </div>
        <p className="text-sm text-ivory/80">
          {isLiveBackend
            ? 'Connected to Supabase PostgreSQL, Auth, and Storage.'
            : 'Running in Local Preview Mode (changes persist in your browser). Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel to enable cloud persistence.'}
        </p>
      </div>

      <div className="bg-charcoal border border-white/10 p-6 space-y-4">
        <h2 className="font-serif text-xl">Homepage Highlights</h2>
        <div>
          <label className="block text-xs text-ivory/60 mb-1">Featured Issue Banner</label>
          <select
            value={settings.featuredIssueId}
            onChange={(e) => updateSettings({ featuredIssueId: e.target.value })}
            className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
          >
            {issues.map((i) => (
              <option key={i.id} value={i.id}>
                {i.volume} · {i.issueNumber} — {i.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isLiveBackend && (
        <div className="bg-charcoal border border-white/10 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Reset Local Demo Data</h3>
            <p className="text-xs text-ivory/50">
              Restore the default Veyran Life seed articles, issues, and photography.
            </p>
          </div>
          <button
            onClick={resetDemoData}
            className="border border-white/20 hover:border-red-400 hover:text-red-400 text-xs px-4 py-2 flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}
    </div>
  );
};
