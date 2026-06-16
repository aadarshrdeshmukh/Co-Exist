import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AppPage = lazy(() => import('./pages/AppPage'));
const BusinessPage = lazy(() => import('./pages/BusinessPage'));
const WebsitePage = lazy(() => import('./pages/WebsitePage'));

/* Reset scroll + clean up Lenis residue on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    /* Remove any Lenis classes left on <html> */
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
    /* Scroll to top */
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/website" element={<WebsitePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
