import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useStore } from '../../services/store';
import { Article, CategoryName, ContentStatus } from '../../types';

const CATEGORIES: CategoryName[] = ['Travel', 'Lifestyle', 'Culture', 'People', 'Feature', 'Campaign'];

export const ArticleEditorPage: React.FC = () => {
  const { articles, media, saveArticle, deleteArticle } = useStore();
  const [editing, setEditing] = useState<Article>(articles[0]);
  const [savedNotice, setSavedNotice] = useState(false);

  const createNew = () => {
    const fresh: Article = {
      id: `art-${Date.now()}`,
      slug: `untitled-${Date.now()}`,
      title: 'Untitled Feature',
      subtitle: '',
      category: 'Travel',
      authorName: 'Editorial Team',
      location: 'Asterfall Coast',
      coverMediaId: media[0]?.id || '',
      excerpt: '',
      body: ['Begin writing your Veyran Life dispatch here.'],
      tags: ['veyran'],
      archiveNote: '',
      isFeatured: false,
      status: 'draft',
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    setEditing(fresh);
  };

  const handleSave = async () => {
    const slug =
      editing.slug.trim() ||
      editing.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    await saveArticle({ ...editing, slug });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif italic text-2xl">Articles</h1>
          <button
            onClick={createNew}
            className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs px-3 py-1.5 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
        <div className="bg-charcoal border border-white/10 divide-y divide-white/10">
          {articles.map((art) => (
            <button
              key={art.id}
              onClick={() => setEditing(art)}
              className={`w-full text-left p-3.5 transition-colors ${
                editing.id === art.id ? 'bg-burgundy/25 border-l-2 border-burgundy' : 'hover:bg-white/5'
              }`}
            >
              <div className="text-sm font-medium">{art.title}</div>
              <div className="text-[11px] text-ivory/50 mt-0.5 flex justify-between">
                <span>{art.category}</span>
                <span className="uppercase">{art.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 bg-charcoal border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-serif text-xl">Article Editor</h2>
          <div className="flex items-center gap-3">
            {savedNotice && <span className="text-xs text-emerald-400">Saved</span>}
            <button
              onClick={() => deleteArticle(editing.id)}
              className="text-ivory/50 hover:text-red-400 p-2"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save & Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Title</label>
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-ivory"
            />
          </div>
          <div>
            <label className="block text-xs text-ivory/60 mb-1">URL Slug</label>
            <input
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-ivory"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-ivory/60 mb-1">Subtitle</label>
          <input
            value={editing.subtitle}
            onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
            className="w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-ivory"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Category</label>
            <select
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value as CategoryName })
              }
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Publish Date</label>
            <input
              type="date"
              value={editing.publishedAt}
              onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Cover Image (from Media Library)</label>
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
          <div>
            <label className="block text-xs text-ivory/60 mb-1">Location</label>
            <input
              value={editing.location}
              onChange={(e) => setEditing({ ...editing, location: e.target.value })}
              className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-ivory/60 mb-1">
            Article Body (separate paragraphs with a blank line)
          </label>
          <textarea
            rows={8}
            value={editing.body.join('\n\n')}
            onChange={(e) =>
              setEditing({
                ...editing,
                body: e.target.value.split(/\n\s*\n/).filter(Boolean),
              })
            }
            className="w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-ivory leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs text-ivory/60 mb-1">
            Archival Revision Note (optional narrative / lore footnote)
          </label>
          <input
            value={editing.archiveNote || ''}
            onChange={(e) => setEditing({ ...editing, archiveNote: e.target.value })}
            placeholder="e.g. Revised following Maritime Registry notice..."
            className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
          />
        </div>
      </div>
    </div>
  );
};
