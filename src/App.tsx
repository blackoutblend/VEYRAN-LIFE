import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { StoreProvider } from './services/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './public/home/HomePage';
import { IssuesPage } from './public/issues/IssuesPage';
import { ArticleReaderPage } from './public/articles/ArticleReaderPage';
import { TravelPage } from './public/travel/TravelPage';
import { PeoplePage } from './public/people/PeoplePage';
import { CulturePage } from './public/culture/CulturePage';
import { GalleryPage } from './public/gallery/GalleryPage';
import { AdminLayout } from './admin/AdminLayout';
import { LoginPage } from './admin/LoginPage';
import { OverviewPage } from './admin/dashboard/OverviewPage';
import { MediaLibraryPage } from './admin/media-library/MediaLibraryPage';
import { ArticleEditorPage } from './admin/article-editor/ArticleEditorPage';
import { IssueBuilderPage } from './admin/issue-builder/IssueBuilderPage';
import { SchedulerPage } from './admin/scheduler/SchedulerPage';
import { SettingsPage } from './admin/settings/SettingsPage';

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/article/:slug" element={<ArticleReaderPage />} />
            <Route path="/travel" element={<TravelPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/culture" element={<CulturePage />} />
            <Route path="/lifestyle" element={<CulturePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="articles" element={<ArticleEditorPage />} />
            <Route path="issues" element={<IssueBuilderPage />} />
            <Route path="scheduler" element={<SchedulerPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
