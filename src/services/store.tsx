import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, Article, MagazineIssue, MediaAsset, SiteSettings } from '../types';
import { SEED_ARTICLES, SEED_ISSUES, SEED_MEDIA, SEED_SETTINGS } from './seedData';
import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEY = 'veyran_life_cms_v2';

interface StoreState {
  media: MediaAsset[];
  articles: Article[];
  issues: MagazineIssue[];
  settings: SiteSettings;
}

interface StoreContextValue extends StoreState {
  user: AdminUser | null;
  authLoading: boolean;
  isLiveBackend: boolean;
  loginDemo: () => void;
  loginWithSupabase: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  getMediaUrl: (mediaId: string) => string;
  addMedia: (asset: Omit<MediaAsset, 'id' | 'createdAt'>, file?: File) => Promise<MediaAsset>;
  updateMedia: (id: string, patch: Partial<MediaAsset>) => Promise<void>;
  replaceMediaFile: (id: string, file: File) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  saveArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  saveIssue: (issue: MagazineIssue) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadLocalState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoreState;
    }
  } catch {
    // ignore storage errors
  }
  return {
    media: SEED_MEDIA,
    articles: SEED_ARTICLES,
    issues: SEED_ISSUES,
    settings: SEED_SETTINGS,
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(loadLocalState);
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('veyran_admin_user');
    return saved ? (JSON.parse(saved) as AdminUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota limits
    }
  }, [state]);

  useEffect(() => {
    if (!supabase) return;
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.email?.split('@')[0] || 'Editor',
          role: 'admin',
        });
      }
      setAuthLoading(false);
    });
  }, []);

  const loginDemo = () => {
    const demoUser: AdminUser = {
      id: 'demo-admin',
      email: 'editor@veyranlife.rep',
      name: 'Editorial Director',
      role: 'admin',
    };
    setUser(demoUser);
    sessionStorage.setItem('veyran_admin_user', JSON.stringify(demoUser));
  };

  const loginWithSupabase = async (email: string, password: string): Promise<string | null> => {
    if (!supabase) {
      loginDemo();
      return null;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || email,
        name: email.split('@')[0],
        role: 'admin',
      });
    }
    return null;
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('veyran_admin_user');
    setUser(null);
  };

  const getMediaUrl = (mediaId: string): string => {
    const found = state.media.find((m) => m.id === mediaId);
    return found?.url || SEED_MEDIA[0].url;
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    if (supabase) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('veyran-media').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('veyran-media').getPublicUrl(path);
        return data.publicUrl;
      }
    }
    return fileToDataUrl(file);
  };

  const addMedia = async (
    asset: Omit<MediaAsset, 'id' | 'createdAt'>,
    file?: File
  ): Promise<MediaAsset> => {
    const url = file ? await uploadFileToStorage(file) : asset.url;
    const created: MediaAsset = {
      ...asset,
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({ ...prev, media: [created, ...prev.media] }));
    return created;
  };

  const updateMedia = async (id: string, patch: Partial<MediaAsset>) => {
    setState((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  };

  const replaceMediaFile = async (id: string, file: File) => {
    const url = await uploadFileToStorage(file);
    setState((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, url } : m)),
    }));
  };

  const deleteMedia = async (id: string) => {
    setState((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  const saveArticle = async (article: Article) => {
    setState((prev) => {
      const exists = prev.articles.some((a) => a.id === article.id);
      return {
        ...prev,
        articles: exists
          ? prev.articles.map((a) => (a.id === article.id ? article : a))
          : [article, ...prev.articles],
      };
    });
  };

  const deleteArticle = async (id: string) => {
    setState((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.id !== id),
      issues: prev.issues.map((iss) => ({
        ...iss,
        articleIds: iss.articleIds.filter((aid) => aid !== id),
      })),
    }));
  };

  const saveIssue = async (issue: MagazineIssue) => {
    setState((prev) => {
      const exists = prev.issues.some((i) => i.id === issue.id);
      return {
        ...prev,
        issues: exists
          ? prev.issues.map((i) => (i.id === issue.id ? issue : i))
          : [issue, ...prev.issues],
      };
    });
  };

  const deleteIssue = async (id: string) => {
    setState((prev) => ({
      ...prev,
      issues: prev.issues.filter((i) => i.id !== id),
    }));
  };

  const updateSettings = (patch: Partial<SiteSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  };

  const resetDemoData = () => {
    const fresh: StoreState = {
      media: SEED_MEDIA,
      articles: SEED_ARTICLES,
      issues: SEED_ISSUES,
      settings: SEED_SETTINGS,
    };
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  return (
    <StoreContext.Provider
      value={{
        ...state,
        user,
        authLoading,
        isLiveBackend: isSupabaseConfigured,
        loginDemo,
        loginWithSupabase,
        logout,
        getMediaUrl,
        addMedia,
        updateMedia,
        replaceMediaFile,
        deleteMedia,
        saveArticle,
        deleteArticle,
        saveIssue,
        deleteIssue,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
