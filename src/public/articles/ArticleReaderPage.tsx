import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Clock, Maximize2 } from 'lucide-react';
import { useStore } from '../../services/store';
import { Lightbox } from '../../components/Lightbox';
import { MediaAsset } from '../../types';

export const ArticleReaderPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles, media, getMediaUrl } = useStore();
  const [zoomAsset, setZoomAsset] = useState<MediaAsset | null>(null);

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Archive Entry Unavailable</h1>
        <p className="text-sm text-charcoal/60 mb-6">
          This article may have been moved or removed from the public Veyran Life index.
        </p>
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-burgundy underline">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const spreadAsset = article.spreadMediaId
    ? media.find((m) => m.id === article.spreadMediaId) || null
    : null;

  const related = articles
    .filter((a) => a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  return (
    <article className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="text-xs text-charcoal/55 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-burgundy">Home</Link>
          <span>/</span>
          <Link to={`/${article.category.toLowerCase()}`} className="hover:text-burgundy">
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-charcoal">{article.featuredPerson || article.location}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          <div className="lg:col-span-5">
            {article.pageNumber && (
              <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-burgundy mb-2">
                Vol. 07 · The Coastal Issue · Page {article.pageNumber}
              </span>
            )}
            <h1 className="font-serif italic text-4xl sm:text-5xl text-charcoal leading-tight mb-4">
              {article.title}
            </h1>
            <p className="font-serif text-lg text-charcoal/80 mb-4">{article.subtitle}</p>
            <p className="text-sm text-charcoal/65 leading-relaxed mb-8">{article.excerpt}</p>

            <div className="flex items-center justify-between border-t border-charcoal/15 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-charcoal text-ivory flex items-center justify-center font-serif italic text-sm">
                  VL
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal">{article.authorName}</div>
                  <div className="text-xs text-charcoal/55">
                    Veyran Life · {article.publishedAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-charcoal/60">
                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="hover:text-burgundy"
                  title="Copy Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[16/10] overflow-hidden bg-charcoal/10">
              <img
                src={getMediaUrl(article.coverMediaId)}
                alt={article.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-base leading-[1.9] text-charcoal/85">
            {article.body.map((paragraph, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-burgundy'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {article.pullQuote && (
            <blockquote className="my-10 pl-6 border-l-2 border-burgundy font-serif italic text-2xl text-charcoal">
              “{article.pullQuote}”
              {article.featuredPerson && (
                <footer className="mt-2 text-xs not-italic uppercase tracking-[0.2em] text-charcoal/60">
                  — {article.featuredPerson}
                </footer>
              )}
            </blockquote>
          )}

          {article.profileMeta && (
            <div className="my-10 bg-white/70 border border-charcoal/15 p-6">
              <h3 className="font-serif italic text-xl mb-4">Model Profile</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-burgundy">Field</dt>
                  <dd className="mt-0.5 text-charcoal">{article.profileMeta.field}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-burgundy">Base</dt>
                  <dd className="mt-0.5 text-charcoal">{article.profileMeta.base}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-burgundy">Focus</dt>
                  <dd className="mt-0.5 text-charcoal">{article.profileMeta.focus}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-burgundy">Known For</dt>
                  <dd className="mt-0.5 text-charcoal">{article.profileMeta.knownFor}</dd>
                </div>
              </dl>
            </div>
          )}

          {spreadAsset && (
            <div className="my-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-[0.22em] text-charcoal/65">
                  Original Print Magazine Spread {article.pageNumber ? `· Page ${article.pageNumber}` : ''}
                </span>
                <button
                  onClick={() => setZoomAsset(spreadAsset)}
                  className="text-xs uppercase tracking-[0.18em] text-burgundy hover:underline inline-flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Full-Screen Reader
                </button>
              </div>
              <button
                onClick={() => setZoomAsset(spreadAsset)}
                className="block w-full border border-charcoal/15 shadow-xl overflow-hidden cursor-zoom-in"
              >
                <img src={spreadAsset.url} alt={spreadAsset.title} className="w-full h-auto" />
              </button>
            </div>
          )}

          {article.archiveNote && (
            <div className="mt-10 p-4 border-l-2 border-burgundy bg-charcoal/5 text-xs text-charcoal/70 flex items-start gap-3">
              <Clock className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
              <span>{article.archiveNote}</span>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-charcoal/15 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-[0.18em] px-3 py-1 border border-charcoal/15 text-charcoal/70"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-burgundy hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Veyran Life
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-charcoal/15">
            <h2 className="font-serif italic text-2xl mb-6">Continue Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} to={`/article/${rel.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-3">
                    <img
                      src={getMediaUrl(rel.coverMediaId)}
                      alt={rel.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-burgundy">
                    {rel.category}
                  </span>
                  <h3 className="font-serif text-xl group-hover:text-burgundy mt-1">
                    {rel.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Lightbox asset={zoomAsset} onClose={() => setZoomAsset(null)} />
    </article>
  );
};
