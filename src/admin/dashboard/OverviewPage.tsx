import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, FileText, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useStore } from '../../services/store';

export const OverviewPage: React.FC = () => {
  const { media, articles, issues } = useStore();
  const scheduledCount =
    articles.filter((a) => a.status === 'scheduled').length +
    issues.filter((i) => i.status === 'scheduled').length;

  const stats = [
    { label: 'Media Assets', value: media.length, icon: ImageIcon, to: '/admin/media' },
    { label: 'Articles', value: articles.length, icon: FileText, to: '/admin/articles' },
    { label: 'Magazine Issues', value: issues.length, icon: BookOpen, to: '/admin/issues' },
    { label: 'Scheduled Posts', value: scheduledCount, icon: Calendar, to: '/admin/scheduler' },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="font-serif italic text-3xl">Editorial Overview</h1>
        <p className="text-xs text-ivory/55 mt-1">
          Manage Veyran Life photography, articles, digital issues, and publication schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="bg-charcoal border border-white/10 hover:border-gold/50 p-5 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-ivory/60">{s.label}</span>
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div className="font-serif text-4xl text-ivory">{s.value}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-charcoal border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Recent Articles</h2>
            <Link to="/admin/articles" className="text-xs text-gold flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {articles.slice(0, 5).map((art) => (
              <div key={art.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{art.title}</div>
                  <div className="text-xs text-ivory/50">
                    {art.category} · {art.publishedAt}
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                    art.status === 'published'
                      ? 'bg-emerald-900/50 text-emerald-300'
                      : art.status === 'scheduled'
                      ? 'bg-amber-900/50 text-amber-300'
                      : 'bg-white/10 text-ivory/60'
                  }`}
                >
                  {art.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-charcoal border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Active Magazine Issues</h2>
            <Link to="/admin/issues" className="text-xs text-gold flex items-center gap-1">
              Issue Builder <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {issues.map((iss) => (
              <div key={iss.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">
                    {iss.volume} · {iss.issueNumber}: {iss.title}
                  </div>
                  <div className="text-xs text-ivory/50">
                    {iss.articleIds.length} linked articles
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-burgundy/40 text-ivory">
                  {iss.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
