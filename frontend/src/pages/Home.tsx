import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Calendar, MapPin, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const features = [
    { icon: MessageSquare, title: 'Chat Assistant', desc: 'Ask any question about the election process', link: '/chat', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
    { icon: Calendar, title: 'Election Timeline', desc: 'Track important dates and phases', link: '/timeline', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' },
    { icon: CheckSquare, title: 'How to Vote', desc: 'Step-by-step guide for election day', link: '/guide', color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
    { icon: MapPin, title: 'Local Info', desc: 'Find your polling booth and candidates', link: '/location', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        className="text-center max-w-3xl mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Understand Elections in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">Minutes</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          Your simple, step-by-step, interactive guide to participating in democracy. We make the election process clear and accessible for everyone.
        </p>
        <Link to="/chat" className="btn-primary text-lg inline-flex items-center gap-2 group">
          Start Learning
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Link 
              to={feature.link}
              className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 h-full group"
            >
              <div className={`p-4 rounded-xl mb-4 ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.section 
        className="max-w-4xl w-full glass-panel p-8 md:p-12 rounded-3xl mt-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6">About Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          <strong>The Problem:</strong> Elections can be confusing, and misinformation spreads rapidly. Millions of first-time voters struggle to find accurate, unbiased information on how to register, where to vote, and what the process entails.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Our Solution:</strong> CivicSync leverages AI to provide a safe, simple, and completely objective educational platform. We guide citizens step-by-step to ensure they can confidently and securely participate in the democratic process.
        </p>
      </motion.section>
    </div>
  );
};

export default Home;
