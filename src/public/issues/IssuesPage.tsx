import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useStore } from '../../services/store';
import { MagazineIssue } from '../../types';

const FILTERS = ['All Issues', 'Travel', 'Lifestyle', 'Culture', 'Specials'] as const;

export const IssuesPage: React.FC = () => {
  const { issues, articles, getMediaUrl } = useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All Issues');
  const [activeIssue, setActiveIssue] = useState<MagazineIssue | null>(null);

  const publishedIssues = issues.filter((i) => i.status === 'published');
  const filtered =
    filter === 'All Issues'
      ? publishedIssues
      : publishedIssues.filter((i) => i.category === filter);

  const selected = activeIssue || filtered[0] || null;
  const issueArticles = selected
    ? selected.articleIds
        .map((id) => articles.find((a) => a.id === id && a.status === 'published'))
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
    : [];

  return (
    <div className="bg-charcoal text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <h1 className="font-serif italic text-4xl">Issues</h1>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs tracking-wider px-4 py-1.5 border transition-colors ${
                  filter === f
                    ? 'bg-burgundy border-burgundy text-ivory'
                    : 'border-white/15 text-ivory/70 hover:text-ivory'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {filtered.map((issue) => (
            <button
              key={issue.id}
              onClick={() => setActiveIssue(issue)}
              className={`group text-left transition-all ${
                selected?.id === issue.id ? 'ring-2 ring-gold p-1.5 bg-white/5' : ''
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-obsidian mb-3">
                <img
                  src={getMediaUrl(issue.coverMediaId)}
                  alt={issue.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute top-3 inset-x-3 text-center font-serif text-xl tracking-wide">
                  <span className="italic font-semibold text-ivory">VEYRAN</span>{' '}
                  <span className="italic text-burgundy">LIFE</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-serif italic text-2xl leading-tight text-ivory">
                    {issue.title}
                  </p>
                </div>
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-ivory/60">
                {issue.volume} · {issue.issueNumber}
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="bg-ivory text-charcoal p-8 sm:p-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-burgundy font-semibold">
                  {selected.volume} · {selected.issueNumber}
                </span>
                <h2 className="font-serif italic text-3xl mt-1 mb-4">{selected.title}</h2>
                <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50 mb-4 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-burgundy" /> Editor’s Letter
                </p>
                <p className="text-sm leading-relaxed text-charcoal/80">{selected.editorsLetter}</p>
              </div>
              <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-charcoal/10 pt-6 lg:pt-0 lg:pl-10">
                <h3 className="text-xs uppercase tracking-[0.22em] text-charcoal/60 mb-5">
                  Inside This Edition ({issueArticles.length} Features)
                </h3>
                <div className="divide-y divide-charcoal/10">
                  {issueArticles.map((art, i) => (
                    <Link
                      key={art.id}
                      to={`/article/${art.slug}`}
                      className="py-4 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-serif italic text-lg text-burgundy">
                          {art.pageNumber ? `p.${art.pageNumber}` : String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="font-serif text-xl group-hover:text-burgundy transition-colors">
                            {art.title}
                          </div>
                          <div className="text-xs text-charcoal/60">
                            {art.category} · {art.location}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-charcoal/40 group-hover:text-burgundy shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {selected.campaignAdMediaId && (
              <div className="pt-8 border-t border-charcoal/15">
                <p className="text-[10px] uppercase tracking-[0.24em] text-charcoal/55 mb-3">
                  Featured Campaign Spread · Véranté Swimwear
                </p>
                <img
                  src={getMediaUrl(selected.campaignAdMediaId)}
                  alt="Campaign Spread"
                  className="w-full h-auto border border-charcoal/15"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
