import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, onAuthStateChanged, trackEvent } from './firebase/config';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Timeline from './pages/Timeline';
import VotingGuide from './pages/VotingGuide';
import LocationInfo from './pages/LocationInfo';
import FAQ from './pages/FAQ';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) trackEvent('login', { method: 'google' });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    trackEvent('page_view', { page: window.location.pathname });
  }, []);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = 
      fontSize === 'large' ? '18px' : 
      fontSize === 'xlarge' ? '20px' : '16px';
  }, [fontSize]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
        <main id="main-content" className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/guide" element={<VotingGuide />} />
            <Route path="/location" element={<LocationInfo />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
