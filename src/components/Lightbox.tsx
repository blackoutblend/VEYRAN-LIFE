import React from 'react';
import { X, MapPin, User, Tag } from 'lucide-react';
import { MediaAsset } from '../types';

interface LightboxProps {
  asset: MediaAsset | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full bg-charcoal border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lg:col-span-2 bg-black flex items-center justify-center max-h-[75vh]">
          <img
            src={asset.url}
            alt={asset.title}
            className="w-full h-full object-contain max-h-[75vh]"
          />
        </div>
        <div className="p-6 text-ivory flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.22em] bg-burgundy px-2.5 py-1">
                {asset.category}
              </span>
              <button
                onClick={onClose}
                className="text-ivory/60 hover:text-ivory p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-serif text-2xl mb-2">{asset.title}</h3>
            <p className="text-sm text-ivory/70 leading-relaxed mb-6">{asset.caption}</p>
            <div className="space-y-2.5 text-xs text-ivory/70 border-t border-white/10 pt-4">
              {asset.collection && (
                <div>
                  <span className="text-ivory/40 uppercase tracking-wider">Collection: </span>
                  {asset.collection}
                </div>
              )}
              {asset.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{asset.location}</span>
                </div>
              )}
              {asset.featuredPerson && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span>{asset.featuredPerson}</span>
                </div>
              )}
            </div>
          </div>
          {asset.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
              <Tag className="w-3 h-3 text-gold mr-1" />
              {asset.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/5 text-ivory/70"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
