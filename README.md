# VEYRAN LIFE — Digital Publication & Editorial Studio

A full-stack editorial magazine and private CMS set in the coastal republic of Veyran.

## Architecture
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Supabase (PostgreSQL, Auth, Storage with RLS)
- **Hosting**: Vercel (SPA routing configured in `vercel.json`)
- **Zero-Config Demo Mode**: Works immediately on Vercel using `localStorage` if Supabase environment variables are not yet configured. Once `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are added, it connects directly to your Supabase backend.

## Local Setup
```bash
npm install
npm run dev
```

## Deploying to Vercel + Supabase
1. Push this folder to a GitHub repository.
2. Create a Supabase project and run `supabase/migrations/001_init.sql` in the Supabase SQL Editor.
3. In Supabase Authentication -> Users, create an admin account and update their role to `'admin'` in `public.profiles`.
4. Import the GitHub repository into Vercel.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Vercel Project Settings -> Environment Variables.
6. Deploy. Public site lives at `/`, private CMS lives at `/admin`.
