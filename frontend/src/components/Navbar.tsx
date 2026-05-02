import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Settings, Volume2, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout } from '../firebase/config';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

const Navbar = ({ darkMode, toggleDarkMode, fontSize, setFontSize }: NavbarProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2" aria-label="CivicSync Home">
          <span className="bg-primary-600 text-white p-2 rounded-lg">✓</span>
          CivicSync
        </Link>

        <div className="hidden md:flex space-x-1" role="navigation">
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
          {user ? (
            <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-gray-700 mr-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                <button onClick={logout} className="text-[10px] text-red-500 hover:underline">Logout</button>
              </div>
              <img src={user.photoURL || ''} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full ring-2 ring-primary-500" />
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              aria-label="Login with Google"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}

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
                  aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Text Size</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1" role="group" aria-label="Adjust text size">
                  {['normal', 'large', 'xlarge'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        fontSize === size 
                          ? 'bg-white dark:bg-gray-600 shadow-sm' 
                          : 'hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                      aria-pressed={fontSize === size}
                    >
                      {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voice Narration</span>
                <button className="p-2 rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors" aria-label="Toggle voice narration">
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

