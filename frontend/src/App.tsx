import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { auth, onAuthStateChanged, trackEvent } from './firebase/config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy-loaded pages for code splitting and performance
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Timeline = lazy(() => import('./pages/Timeline'));
const VotingGuide = lazy(() => import('./pages/VotingGuide'));
const LocationInfo = lazy(() => import('./pages/LocationInfo'));
const FAQ = lazy(() => import('./pages/FAQ'));

/** Loading fallback for lazy-loaded routes */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading page">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <span className="text-gray-500 dark:text-gray-400 text-sm">Loading...</span>
    </div>
  </div>
);

/** Route change announcer for screen readers */
function RouteAnnouncer() {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const pageName = location.pathname.replace('/', '') || 'home';
    setAnnouncement(`Navigated to ${pageName} page`);
    trackEvent('page_view', { page: location.pathname });
  }, [location.pathname]);

  return (
    <div className="sr-only" aria-live="assertive" aria-atomic="true" role="status">
      {announcement}
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  // Track auth state for analytics
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) trackEvent('login', { method: 'google' });
    });
    return () => unsubscribe();
  }, []);

  // Respect system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Apply font size preference
  useEffect(() => {
    const sizes: Record<string, string> = {
      normal: '16px',
      large: '18px',
      xlarge: '20px',
    };
    document.documentElement.style.fontSize = sizes[fontSize] || '16px';
  }, [fontSize]);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);
  const handleSetFontSize = useCallback((size: string) => setFontSize(size), []);

  return (
    <Router>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
        <RouteAnnouncer />
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          fontSize={fontSize}
          setFontSize={handleSetFontSize}
        />
        <main id="main-content" className="flex-grow container mx-auto px-4 py-8" role="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/guide" element={<VotingGuide />} />
              <Route path="/location" element={<LocationInfo />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
