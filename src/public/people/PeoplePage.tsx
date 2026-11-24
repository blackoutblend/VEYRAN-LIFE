import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../services/store';

export const PeoplePage: React.FC = () => {
  const { articles, getMediaUrl } = useStore();
  const items = articles.filter((a) => a.status === 'published' && a.category === 'People');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="border-b border-charcoal/15 pb-6 mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-burgundy mb-2">Portraits</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl">People & Interviews</h1>
        <p className="text-sm text-charcoal/65 mt-2 max-w-xl">
          Architects, diplomats, maritime stewards, and cultural figures defining Veyran.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {items.map((art) => (
          <Link key={art.id} to={`/article/${art.slug}`} className="group block">
            <div className="aspect-[16/11] overflow-hidden bg-charcoal/10 mb-4">
              <img
                src={getMediaUrl(art.coverMediaId)}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-burgundy mb-1">
              {art.featuredPerson || art.location}
            </div>
            <h2 className="font-serif text-3xl group-hover:text-burgundy transition-colors">
              {art.title}
            </h2>
            <p className="text-sm text-charcoal/65 mt-2">{art.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
