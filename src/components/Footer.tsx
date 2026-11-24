import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-ivory/80 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl tracking-wide mb-3">
            <span className="font-semibold italic text-ivory">VEYRAN</span>{' '}
            <span className="italic text-burgundy">LIFE</span>
          </div>
          <p className="text-sm text-ivory/60 max-w-md leading-relaxed">
            An independent coastal republic publication dedicated to architecture, travel,
            maritime culture, and the personalities shaping Veyran. Published monthly from
            Port Veyran.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-gold mb-4">Sections</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/issues" className="hover:text-ivory">Magazine Issues</Link></li>
            <li><Link to="/travel" className="hover:text-ivory">Travel & Coast</Link></li>
            <li><Link to="/people" className="hover:text-ivory">People & Profiles</Link></li>
            <li><Link to="/culture" className="hover:text-ivory">Lifestyle & Culture</Link></li>
            <li><Link to="/gallery" className="hover:text-ivory">Photography Archive</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-gold mb-4">Masthead</h4>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li>Port Veyran · Republic of Veyran</li>
            <li>ISSN 2409-8821</li>
            <li className="pt-2">
              <Link
                to="/admin"
                className="text-xs uppercase tracking-[0.18em] text-gold/80 hover:text-gold border-b border-gold/30 pb-0.5"
              >
                Editorial Studio Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-4 sm:px-6 text-center text-xs text-ivory/40 tracking-wider">
        © {new Date().getFullYear()} VEYRAN LIFE Publishing House. All rights reserved.
      </div>
    </footer>
  );
};
