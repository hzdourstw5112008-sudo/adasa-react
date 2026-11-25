import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import './react-shell.css';

function LegacyPage({ page }) {
  const location = useLocation();
  const params = useParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    window.AdasaLegacy.initData().then(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const app = window.AdasaLegacy;
    const path = location.pathname;
    app.state.currentRoute = path;
    window.scrollTo({ top: 0, behavior: 'instant' });
    app.renderNavbar();
    app.renderFooter();

    if (page === 'home') app.renderHome();
    else if (page === 'blog') {
      const category = new URLSearchParams(location.search).get('category');
      app.renderBlog(category || undefined);
    }
    else if (page === 'details') app.renderBlogDetails(params.slug);
    else if (page === 'about') app.renderAbout();
    else if (page === 'privacy') app.renderPrivacy();
    else if (page === 'terms') app.renderTerms();
    else app.renderNotFound();
  }, [ready, location.pathname, location.search, params.slug, page]);

  return (
    <>
      <div id="navbar-container" />
      <main id="main-content" className="flex-grow pt-20">
        {!ready && <div className="loading-screen">جاري تحميل عدسة...</div>}
      </main>
      <div id="footer-container" />
      <div id="toast-container" />
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LegacyPage page="home" />} />
        <Route path="/blog" element={<LegacyPage page="blog" />} />
        <Route path="/blog/:slug" element={<LegacyPage page="details" />} />
        <Route path="/about" element={<LegacyPage page="about" />} />
        <Route path="/privacy" element={<LegacyPage page="privacy" />} />
        <Route path="/terms" element={<LegacyPage page="terms" />} />
        <Route path="/404" element={<LegacyPage page="not-found" />} />
        <Route path="*" element={<LegacyPage page="not-found" />} />
      </Routes>
    </HashRouter>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
