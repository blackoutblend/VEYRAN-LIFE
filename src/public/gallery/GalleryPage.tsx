import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { MediaAsset } from '../../types';
import { Lightbox } from '../../components/Lightbox';

export const GalleryPage: React.FC = () => {
  const { media } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);

  const published = media.filter((m) => m.status === 'published');
  const categories = ['All', 'People', 'Campaign', 'Travel', 'Culture', 'Feature'];
  const filtered =
    selectedCategory === 'All'
      ? published
      : published.filter((m) => m.category === selectedCategory);

  return (
    <div className="bg-charcoal text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-2">Photography</p>
            <h1 className="font-serif italic text-4xl sm:text-5xl">Gallery, Spreads & Campaigns</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-3.5 py-1.5 border transition-colors ${
                  selectedCategory === c
                    ? 'bg-burgundy border-burgundy text-ivory'
                    : 'border-white/15 text-ivory/70 hover:text-ivory'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveAsset(item)}
              className="group relative aspect-[4/3] overflow-hidden bg-obsidian text-left"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                  {item.location || item.category}
                </span>
                <span className="font-serif text-xl text-ivory">{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Lightbox asset={activeAsset} onClose={() => setActiveAsset(null)} />
    </div>
  );
};
