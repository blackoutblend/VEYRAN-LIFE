import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2, RefreshCw, Check } from 'lucide-react';
import { useStore } from '../../services/store';
import { CategoryName } from '../../types';

const CATEGORIES: CategoryName[] = ['Travel', 'Lifestyle', 'Culture', 'People', 'Feature', 'Campaign'];

export const MediaLibraryPage: React.FC = () => {
  const { media, addMedia, updateMedia, replaceMediaFile, deleteMedia } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(media[0]?.id || null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const selected = media.find((m) => m.id === selectedId) || media[0] || null;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    let lastId = selectedId;
    for (const file of Array.from(fileList)) {
      const created = await addMedia(
        {
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          url: '',
          category: 'Travel',
          collection: 'The Coastal Issue',
          featuredPerson: '',
          location: 'Asterfall Coast',
          caption: '',
          tags: ['coastal'],
          status: 'published',
        },
        file
      );
      lastId = created.id;
    }
    setSelectedId(lastId);
    setUploading(false);
  };

  const handleReplace = async (fileList: FileList | null) => {
    if (!selected || !fileList?.[0]) return;
    await replaceMediaFile(selected.id, fileList[0]);
  };

  const addTag = () => {
    if (!selected || !tagInput.trim()) return;
    const clean = tagInput.trim().toLowerCase();
    if (!selected.tags.includes(clean)) {
      updateMedia(selected.id, { tags: [...selected.tags, clean] });
    }
    setTagInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif italic text-3xl">Gallery / Media</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-[0.18em] px-4 py-2"
          >
            {uploading ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-gold/60 bg-charcoal p-8 text-center cursor-pointer transition-colors"
        >
          <UploadCloud className="w-8 h-8 text-ivory/60 mx-auto mb-3" />
          <p className="text-sm font-medium">Drag & drop images here or click to upload</p>
          <p className="text-xs text-ivory/45 mt-1">
            JPG, PNG, WEBP · Select multiple posters or photographs at once
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => {
            const isSelected = selected?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`relative aspect-[3/4] overflow-hidden bg-charcoal border transition-all text-left ${
                  isSelected ? 'border-burgundy ring-2 ring-burgundy' : 'border-white/10'
                }`}
              >
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-burgundy text-ivory flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
                  <div className="text-xs font-medium truncate">{item.title}</div>
                  <div className="text-[10px] text-ivory/60">{item.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-4">
        {selected ? (
          <div className="bg-charcoal border border-white/10 p-5 space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-lg">Publish Details</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => replaceInputRef.current?.click()}
                  title="Replace image without breaking linked articles"
                  className="text-xs text-gold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Replace
                </button>
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleReplace(e.target.files)}
                />
                <button
                  onClick={() => deleteMedia(selected.id)}
                  className="text-ivory/50 hover:text-red-400 p-1"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="aspect-[16/10] bg-obsidian overflow-hidden">
              <img src={selected.url} alt={selected.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <label className="block text-[11px] text-ivory/60 mb-1">Title</label>
              <input
                value={selected.title}
                onChange={(e) => updateMedia(selected.id, { title: e.target.value })}
                className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-ivory/60 mb-1">Category</label>
                <select
                  value={selected.category}
                  onChange={(e) =>
                    updateMedia(selected.id, { category: e.target.value as CategoryName })
                  }
                  className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-ivory/60 mb-1">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateMedia(selected.id, { status: e.target.value as 'published' | 'draft' })
                  }
                  className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-ivory/60 mb-1">Collection / Issue</label>
              <input
                value={selected.collection}
                onChange={(e) => updateMedia(selected.id, { collection: e.target.value })}
                className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-ivory/60 mb-1">Featured Person</label>
                <input
                  value={selected.featuredPerson}
                  onChange={(e) => updateMedia(selected.id, { featuredPerson: e.target.value })}
                  placeholder="Lyra Serrin"
                  className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
                />
              </div>
              <div>
                <label className="block text-[11px] text-ivory/60 mb-1">Location</label>
                <input
                  value={selected.location}
                  onChange={(e) => updateMedia(selected.id, { location: e.target.value })}
                  placeholder="Asterfall Coast"
                  className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-ivory/60 mb-1">Caption</label>
              <textarea
                rows={2}
                value={selected.caption}
                onChange={(e) => updateMedia(selected.id, { caption: e.target.value })}
                className="w-full bg-obsidian border border-white/15 px-3 py-2 text-xs text-ivory"
              />
            </div>

            <div>
              <label className="block text-[11px] text-ivory/60 mb-1">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selected.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 bg-white/10 text-ivory flex items-center gap-1"
                  >
                    {t}
                    <button
                      onClick={() =>
                        updateMedia(selected.id, {
                          tags: selected.tags.filter((x) => x !== t),
                        })
                      }
                      className="text-ivory/50 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="flex-1 bg-obsidian border border-white/15 px-2.5 py-1.5 text-xs text-ivory"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-charcoal border border-white/10 p-6 text-xs text-ivory/50">
            Select or upload an image to edit its metadata.
          </div>
        )}
      </div>
    </div>
  );
};
