import { motion } from 'framer-motion';
import { UserPlus, CreditCard, Map, CheckSquare } from 'lucide-react';

const VotingGuide = () => {
  const steps = [
    {
      id: 1,
      title: "Voter Registration",
      icon: UserPlus,
      content: "First, ensure you are registered to vote. You must be 18 years or older and a citizen. You can register online through the Election Commission portal or offline at designated centers."
    },
    {
      id: 2,
      title: "Get your Voter ID (EPIC)",
      icon: CreditCard,
      content: "Once registered, you will receive an Electors Photo Identity Card (EPIC). Keep this safe, as it's the primary document required to cast your vote."
    },
    {
      id: 3,
      title: "Find Your Polling Booth",
      icon: Map,
      content: "Check the voter slip sent to your home or search online to find your designated polling booth. You can only vote at this specific location."
    },
    {
      id: 4,
      title: "Casting Your Vote",
      icon: CheckSquare,
      content: "At the booth, your ID will be verified. Your finger will be marked with indelible ink. Proceed to the Electronic Voting Machine (EVM), press the button next to your chosen candidate, and verify your vote via the VVPAT slip."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Step-by-Step Voting Guide</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to know to cast your vote successfully.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Connection lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 to-primary-200 dark:from-primary-900/50 dark:to-primary-900/50 -translate-y-1/2 z-0" />
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative z-10 glass-panel p-8 rounded-2xl group hover:border-primary-400 transition-colors"
          >
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              {step.id}
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
              <step.icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VotingGuide;
