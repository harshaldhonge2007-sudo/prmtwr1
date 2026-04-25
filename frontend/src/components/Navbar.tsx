import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Settings, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

const Navbar = ({ darkMode, toggleDarkMode, fontSize, setFontSize }: NavbarProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chat Assistant', path: '/chat' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Voting Guide', path: '/guide' },
    { name: 'Location Info', path: '/location' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
          <span className="bg-primary-600 text-white p-2 rounded-lg">✓</span>
          ElecGuide
        </Link>

        <div className="hidden md:flex space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                location.pathname === link.path
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Accessibility Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-xl p-4 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Text Size</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {['normal', 'large', 'xlarge'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        fontSize === size 
                          ? 'bg-white dark:bg-gray-600 shadow-sm' 
                          : 'hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                    >
                      {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voice Narration</span>
                <button className="p-2 rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
