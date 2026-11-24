import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useStore } from '../services/store';

export const LoginPage: React.FC = () => {
  const { loginDemo, loginWithSupabase, isLiveBackend } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = await loginWithSupabase(email, password);
    if (err) {
      setError(err);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-charcoal border border-white/10 p-8">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl tracking-wide mb-1">
            <span className="font-semibold italic">VEYRAN</span>{' '}
            <span className="italic text-burgundy">LIFE</span>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Editorial Studio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-ivory/60 mb-1.5">
              Editor Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@veyranlife.rep"
              className="w-full bg-obsidian border border-white/15 px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold"
              required={isLiveBackend}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-ivory/60 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-obsidian border border-white/15 px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold"
              required={isLiveBackend}
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-[0.22em] py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Sign In to Studio
          </button>
        </form>

        {!isLiveBackend && (
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-ivory/50 mb-3">
              Supabase keys not set — local preview mode enabled.
            </p>
            <button
              onClick={() => {
                loginDemo();
                navigate('/admin');
              }}
              className="w-full border border-gold/50 hover:bg-gold hover:text-charcoal text-gold text-xs uppercase tracking-[0.2em] py-2.5 transition-colors"
            >
              One-Click Demo Sign In
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-ivory/50 hover:text-ivory">
            Return to Public Magazine
          </Link>
        </div>
      </div>
    </div>
  );
};
