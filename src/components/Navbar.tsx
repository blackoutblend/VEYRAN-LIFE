import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { useStore } from '../services/store';

const NAV_LINKS = [
  { label: 'ISSUES', to: '/issues' },
  { label: 'TRAVEL', to: '/travel' },
  { label: 'PEOPLE', to: '/people' },
  { label: 'CULTURE', to: '/culture' },
  { label: 'GALLERY', to: '/gallery' },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { articles } = useStore();
  const navigate = useNavigate();

  const matches = query.trim()
    ? articles
        .filter(
          (a) =>
            a.status === 'published' &&
            (a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.location.toLowerCase().includes(query.toLowerCase()) ||
              a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-charcoal/95 backdrop-blur border-b border-white/10 text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1.5 text-ivory/80 hover:text-ivory"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="font-serif text-2xl tracking-wide flex items-baseline gap-1">
            <span className="font-semibold italic text-ivory">VEYRAN</span>
            <span className="font-normal italic text-burgundy">LIFE</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.2em] font-medium">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? 'text-gold' : 'text-ivory/80 hover:text-ivory'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-ivory/80 hover:text-ivory transition-colors"
            aria-label="Search Archive"
          >
            <Search className="w-4 h-4" />
          </button>
          <Link
            to="/issues"
            className="bg-burgundy hover:bg-burgundy-dark text-ivory text-[11px] tracking-[0.18em] uppercase px-4 py-2 transition-colors"
          >
            Subscribe
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 bg-obsidian px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 border-b border-white/20 pb-2">
              <Search className="w-4 h-4 text-gold" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Veyran archives, Asterfall, personalities..."
                className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-ivory/60 hover:text-ivory">
                <X className="w-4 h-4" />
              </button>
            </div>
            {matches.length > 0 && (
              <div className="mt-3 divide-y divide-white/10">
                {matches.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery('');
                      navigate(`/article/${art.slug}`);
                    }}
                    className="w-full text-left py-2.5 flex items-center justify-between hover:text-gold transition-colors"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-burgundy mr-3">
                        {art.category}
                      </span>
                      <span className="font-serif text-base">{art.title}</span>
                    </div>
                    <span className="text-xs text-ivory/50">{art.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden bg-obsidian border-t border-white/10 px-6 py-4 flex flex-col gap-3 text-xs tracking-[0.2em]">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="py-1.5 text-ivory/80 hover:text-gold"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
