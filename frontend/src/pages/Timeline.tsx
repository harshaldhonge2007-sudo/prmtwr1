import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CalendarDays, CheckCircle2, Circle } from 'lucide-react';

interface TimelineEvent {
  stage: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
}

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch('/api/timeline');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching timeline:', error);
        // Fallback data if API fails
        setEvents([
          { stage: 'Announcement', description: 'Election Commission announces poll dates.', date: 'Oct 10, 2026', status: 'completed' },
          { stage: 'Nomination', description: 'Candidates file their nomination papers.', date: 'Oct 15 - Oct 22, 2026', status: 'completed' },
          { stage: 'Campaigning', description: 'Parties and candidates campaign for votes.', date: 'Oct 25 - Nov 10, 2026', status: 'current' },
          { stage: 'Voting Day', description: 'Registered voters cast their ballots.', date: 'Nov 12, 2026', status: 'upcoming' },
          { stage: 'Counting & Results', description: 'Votes are counted and results declared.', date: 'Nov 15, 2026', status: 'upcoming' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <CalendarDays className="text-primary-500 w-10 h-10" />
          Election Timeline
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Follow the stages of the election process from announcement to results.</p>
      </div>

      <div className="relative border-l-2 border-primary-200 dark:border-primary-900/50 ml-4 md:ml-8 space-y-8">
        {events.map((event, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-8 md:pl-12"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[11px] top-1.5 bg-background-light dark:bg-background-dark">
              {event.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 bg-white dark:bg-gray-900 rounded-full" />
              ) : event.status === 'current' ? (
                <div className="w-5 h-5 rounded-full border-4 border-primary-500 bg-white dark:bg-gray-900 animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 bg-white dark:bg-gray-900 rounded-full" />
              )}
            </div>

            <div 
              className={`glass-panel rounded-xl overflow-hidden cursor-pointer transition-all ${
                expandedId === idx ? 'ring-2 ring-primary-500/50' : 'hover:border-primary-300 dark:hover:border-primary-700'
              }`}
              onClick={() => setExpandedId(expandedId === idx ? null : idx)}
            >
              <div className="p-5 flex justify-between items-center">
                <div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block ${
                    event.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    event.status === 'current' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {event.date}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.stage}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === idx ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {expandedId === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300">
                      <p>{event.description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
