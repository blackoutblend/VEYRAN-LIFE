import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../services/store';

export const SchedulerPage: React.FC = () => {
  const { articles, saveArticle } = useStore();
  const scheduled = articles.filter((a) => a.status === 'scheduled');

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif italic text-3xl">Publication Schedule</h1>
        <p className="text-xs text-ivory/55 mt-1">
          Queue upcoming Veyran Life features and coordinate story drops.
        </p>
      </div>

      <div className="bg-charcoal border border-white/10 divide-y divide-white/10">
        {scheduled.length === 0 ? (
          <div className="p-8 text-center text-xs text-ivory/50">
            No scheduled articles right now. Set any article’s status to “Scheduled” in the Article Editor.
          </div>
        ) : (
          scheduled.map((art) => (
            <div key={art.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gold mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Scheduled for {art.publishedAt}
                </div>
                <div className="font-serif text-xl">{art.title}</div>
                <div className="text-xs text-ivory/55">{art.category} · {art.location}</div>
              </div>
              <button
                onClick={() => saveArticle({ ...art, status: 'published' })}
                className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Publish Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
