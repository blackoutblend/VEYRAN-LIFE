import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Camera, Mic, Archive, Sparkles } from 'lucide-react';
import { useStore } from '../../services/store';
import { Lightbox } from '../../components/Lightbox';
import { MediaAsset } from '../../types';

export const HomePage: React.FC = () => {
  const { articles, issues, media, settings, getMediaUrl } = useStore();
  const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null);

  const publishedArticles = articles.filter((a) => a.status === 'published');
  const heroSlides = settings.heroSlideArticleIds
    .map((id) => publishedArticles.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const [slideIdx, setSlideIdx] = useState(0);
  const currentHero = heroSlides[slideIdx] || publishedArticles[0];
  const heroBg =
    slideIdx === 0
      ? getMediaUrl('media-hero-landing')
      : getMediaUrl(currentHero?.coverMediaId || 'media-hero-landing');

  const latestFour = publishedArticles.filter((a) => a.id !== currentHero?.id).slice(0, 4);
  const featuredIssue =
    issues.find((i) => i.id === settings.featuredIssueId) ||
    issues.find((i) => i.status === 'published');
  const campaignAd = media.find((m) => m.id === settings.featuredCampaignMediaId);
  const modelFeatures = publishedArticles.filter((a) => Boolean(a.spreadMediaId));

  return (
    <div className="bg-ivory">
      {currentHero && (
        <section className="relative h-[80vh] min-h-[560px] bg-charcoal text-ivory overflow-hidden">
          <img
            src={heroBg}
            alt={currentHero.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/35 to-charcoal/30" />

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
            <div className="max-w-xl">
              <div className="w-10 h-0.5 bg-burgundy mb-4" />
              <p className="text-xs uppercase tracking-[0.28em] text-ivory/85 mb-3">
                THE COASTAL ISSUE
              </p>
              <h1 className="font-serif italic text-5xl sm:text-7xl leading-[1.02] mb-5">
                {slideIdx === 0 ? 'Coastal Escape' : currentHero.title}
              </h1>
              <p className="text-sm sm:text-base text-ivory/85 max-w-md leading-relaxed mb-8">
                {currentHero.subtitle}
              </p>
              <Link
                to={`/article/${currentHero.slug}`}
                className="inline-flex items-center gap-3 bg-burgundy hover:bg-burgundy-dark text-ivory text-[11px] uppercase tracking-[0.22em] px-6 py-3.5 transition-colors"
              >
                Read Feature <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="hidden md:flex flex-col items-end gap-4 text-[11px] tracking-[0.26em] text-ivory/75">
              <Link to="/travel" className="hover:text-gold transition-colors">TRAVEL</Link>
              <Link to="/culture" className="hover:text-gold transition-colors">FASHION</Link>
              <Link to="/culture" className="hover:text-gold transition-colors">LIFESTYLE</Link>
              <Link to="/culture" className="hover:text-gold transition-colors">CULTURE</Link>
              <Link to="/people" className="hover:text-gold transition-colors">PEOPLE</Link>
            </div>
          </div>

          {heroSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSlideIdx(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-0.5 transition-all ${
                    idx === slideIdx ? 'w-10 bg-ivory' : 'w-4 bg-ivory/40 hover:bg-ivory/70'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <div className="border-b border-charcoal/10 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs tracking-wider text-charcoal/80">
          <Link to="/issues" className="flex items-center gap-2 hover:text-burgundy">
            <BookOpen className="w-4 h-4 text-burgundy" /> Latest Issue
          </Link>
          <Link to="/travel" className="flex items-center gap-2 hover:text-burgundy">
            <Compass className="w-4 h-4 text-burgundy" /> Travel Guides
          </Link>
          <Link to="/gallery" className="flex items-center gap-2 hover:text-burgundy">
            <Camera className="w-4 h-4 text-burgundy" /> Photo Stories
          </Link>
          <Link to="/people" className="flex items-center gap-2 hover:text-burgundy">
            <Mic className="w-4 h-4 text-burgundy" /> Model Features
          </Link>
          <Link to="/issues" className="flex items-center gap-2 hover:text-burgundy">
            <Archive className="w-4 h-4 text-burgundy" /> Archives
          </Link>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-serif italic text-3xl text-charcoal">Latest from Veyran</h2>
          <div className="h-0.5 w-16 bg-burgundy" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestFour.map((article) => (
            <Link key={article.id} to={`/article/${article.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/10 mb-3">
                <img
                  src={getMediaUrl(article.coverMediaId)}
                  alt={article.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-burgundy text-ivory text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                  {article.category}
                </span>
              </div>
              <h3 className="font-serif text-xl leading-snug text-charcoal group-hover:text-burgundy transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-charcoal/60 mt-1.5 line-clamp-2">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {campaignAd && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
          <div className="border border-charcoal/15 bg-white/60 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.26em] text-charcoal/55 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-burgundy" /> Veyra Resort Series · Campaign Advertisement
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-burgundy">
                Véranté Swimwear
              </span>
            </div>
            <button
              onClick={() => setLightboxAsset(campaignAd)}
              className="block w-full overflow-hidden group cursor-zoom-in"
            >
              <img
                src={campaignAd.url}
                alt={campaignAd.title}
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
            </button>
          </div>
        </section>
      )}

      {featuredIssue && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
          <div className="bg-charcoal text-ivory p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 items-center gap-8 border border-gold/20">
            <div className="flex justify-center">
              <img
                src={getMediaUrl(featuredIssue.coverMediaId)}
                alt={featuredIssue.title}
                className="w-40 aspect-[3/4] object-cover object-top shadow-2xl border border-white/15 -rotate-3"
              />
            </div>
            <div className="text-center md:text-left">
              <div className="font-serif text-3xl sm:text-4xl tracking-wide mb-1">
                <span className="font-semibold italic">VEYRAN</span>{' '}
                <span className="italic text-burgundy">LIFE</span>
              </div>
              <p className="font-serif italic text-xl text-gold">{featuredIssue.title}</p>
              <p className="text-xs text-ivory/65 mt-2">{featuredIssue.subtitle}</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="text-xs uppercase tracking-[0.22em] text-ivory/75 text-center md:text-right">
                {featuredIssue.volume} · {featuredIssue.issueNumber}
                <br />
                Now Available
              </div>
              <Link
                to="/issues"
                className="border border-gold/60 hover:bg-gold hover:text-charcoal text-ivory text-[11px] uppercase tracking-[0.22em] px-6 py-2.5 transition-colors"
              >
                View Issue
              </Link>
            </div>
          </div>
        </section>
      )}

      {modelFeatures.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="font-serif italic text-3xl text-charcoal">
                Inside Vol. 07 — Model Editorials
              </h2>
              <div className="h-0.5 w-16 bg-burgundy" />
            </div>
            <Link
              to="/people"
              className="text-xs uppercase tracking-[0.2em] text-burgundy hover:underline"
            >
              All Features
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {modelFeatures.map((person) => (
              <Link
                key={person.id}
                to={`/article/${person.slug}`}
                className="group bg-white/75 border border-charcoal/10 overflow-hidden flex flex-col"
              >
                <div className="aspect-[3/4] overflow-hidden bg-charcoal/10 relative">
                  <img
                    src={getMediaUrl(person.coverMediaId)}
                    alt={person.featuredPerson || person.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {person.pageNumber && (
                    <span className="absolute top-2.5 right-2.5 bg-charcoal/85 text-ivory text-[10px] tracking-[0.18em] px-2 py-0.5">
                      P. {person.pageNumber}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-burgundy block mb-1">
                      {person.location}
                    </span>
                    <h3 className="font-serif text-lg text-charcoal group-hover:text-burgundy transition-colors">
                      {person.featuredPerson || person.title}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/70 mt-3 inline-flex items-center gap-1">
                    Open Spread <ArrowRight className="w-3 h-3 text-burgundy" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Lightbox asset={lightboxAsset} onClose={() => setLightboxAsset(null)} />
    </div>
  );
};
