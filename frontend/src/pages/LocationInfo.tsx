import { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationInfo = () => {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setResults({
          upcomingElection: "State Assembly Elections 2026",
          date: "November 12, 2026",
          booth: "St. Xavier's High School, Main Hall",
          address: "123 Education Lane, Downtown",
          candidates: 5,
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Local Election Info</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Enter your city, state, or pincode to find your polling booth.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Mumbai, Maharashtra or 400001"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-lg dark:text-white"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !location.trim()}
            className="btn-primary flex items-center gap-2 px-8"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </div>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">Upcoming Election</h3>
            <p className="text-2xl font-bold mb-2">{results.upcomingElection}</p>
            <p className="inline-block bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-lg text-sm font-medium">
              {results.date}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">Your Polling Booth</h3>
            <p className="text-xl font-bold mb-2">{results.booth}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{results.address}</p>
            <button className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
              <Navigation className="w-4 h-4" /> Get Directions
            </button>
          </div>
          
          {/* Map placeholder */}
          <div className="md:col-span-2 glass-panel p-2 rounded-2xl h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=India&zoom=4&size=800x400&sensor=false')] bg-cover bg-center opacity-30 blur-[2px]"></div>
             <div className="relative z-10 bg-white/90 dark:bg-gray-900/90 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-3">
               <MapPin className="text-red-500 w-6 h-6" />
               <span className="font-medium">Google Maps Integration Area</span>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LocationInfo;
