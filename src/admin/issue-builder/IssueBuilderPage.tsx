import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Plus, Save, Trash2 } from 'lucide-react';
import { useStore } from '../../services/store';
import { ContentStatus, MagazineIssue } from '../../types';

export const IssueBuilderPage: React.FC = () => {
  const { issues, articles, media, saveIssue, deleteIssue, getMediaUrl } = useStore();
  const [editing, setEditing] = useState<MagazineIssue>(issues[0]);
  const [saved, setSaved] = useState(false);

  const createNewIssue = () => {
    setEditing({
      id: `issue-${Date.now()}`,
      volume: 'Vol. 07',
      issueNumber: `No. ${String(issues.length + 1).padStart(2, '0')}`,
      title: 'New Edition',
      subtitle: '',
      category: 'Specials',
      coverMediaId: media[0]?.id || '',
      editorsLetter: '',
      articleIds: [],
      publishedAt: new Date().toISOString().slice(0, 10),
      status: 'draft',
    });
  };

  const toggleArticle = (articleId: string) => {
    const exists = editing.articleIds.includes(articleId);
    setEditing({
      ...editing,
      articleIds: exists
        ? editing.articleIds.filter((id) => id !== articleId)
        : [...editing.articleIds, articleId],
    });
  };

  const moveArticle = (index: number, dir: -1 | 1) => {
    const next = [...editing.articleIds];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setEditing({ ...editing, articleIds: next });
  };

  const handleSave = async () => {
    await saveIssue(editing);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif italic text-2xl">Magazine Issues</h1>
          <button
            onClick={createNewIssue}
            className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs px-3 py-1.5 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Issue
          </button>
        </div>

        <div className="bg-charcoal border border-white/10 divide-y divide-white/10">
          {issues.map((iss) => (
            <button
              key={iss.id}
              onClick={() => setEditing(iss)}
              className={`w-full text-left p-3.5 flex items-center gap-3 ${
                editing.id === iss.id ? 'bg-burgundy/25 border-l-2 border-burgundy' : 'hover:bg-white/5'
              }`}
            >
              <img
                src={getMediaUrl(iss.coverMediaId)}
                alt={iss.title}
                className="w-10 h-14 object-cover shrink-0"
              />
              <div>
                <div className="text-sm font-medium">{iss.title}</div>
                <div className="text-[11px] text-ivory/50">
                  {iss.volume} · {iss.issueNumber} ({iss.articleIds.length} articles)
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 bg-charcoal border border-white/10 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-serif text-xl">Issue Builder</h2>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-emerald-400">Saved</span>}
            <button
              onClick={() => deleteIssue(editing.id)}
              className="text-ivory/50 hover:text-red-400 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Issue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Volume</label>
            <input
              value={editing.volume}
              onChange={(e) => setEditing({ ...editing, volume: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            />
          </div>
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Issue No.</label>
            <input
              value={editing.issueNumber}
              onChange={(e) => setEditing({ ...editing, issueNumber: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            />
          </div>
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Status</label>
            <select
              value={editing.status}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value as ContentStatus })
              }
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Issue Title</label>
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-ivory"
            />
          </div>
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Cover Photograph</label>
            <select
              value={editing.coverMediaId}
              onChange={(e) => setEditing({ ...editing, coverMediaId: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            >
              {media.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-ivory/60 mb-1">Editor’s Letter</label>
          <textarea
            rows={3}
            value={editing.editorsLetter}
            onChange={(e) => setEditing({ ...editing, editorsLetter: e.target.value })}
            className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gold mb-2">
              Ordered Table of Contents
            </h3>
            <div className="bg-obsidian border border-white/10 divide-y divide-white/10">
              {editing.articleIds.map((aid, idx) => {
                const art = articles.find((a) => a.id === aid);
                if (!art) return null;
                return (
                  <div key={aid} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate">
                      {idx + 1}. {art.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => moveArticle(idx, -1)} className="p-1 hover:text-gold">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveArticle(idx, 1)} className="p-1 hover:text-gold">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleArticle(aid)}
                        className="p-1 text-red-400 hover:underline"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
              {editing.articleIds.length === 0 && (
                <div className="p-4 text-xs text-ivory/40">No articles assigned yet.</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-ivory/60 mb-2">
              Available Articles
            </h3>
            <div className="bg-obsidian border border-white/10 divide-y divide-white/10 max-h-64 overflow-y-auto">
              {articles.map((art) => {
                const included = editing.articleIds.includes(art.id);
                return (
                  <button
                    key={art.id}
                    onClick={() => toggleArticle(art.id)}
                    className="w-full text-left p-2.5 text-xs flex items-center justify-between hover:bg-white/5"
                  >
                    <span className="truncate">{art.title}</span>
                    <span className={included ? 'text-emerald-400' : 'text-gold'}>
                      {included ? 'Added' : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
