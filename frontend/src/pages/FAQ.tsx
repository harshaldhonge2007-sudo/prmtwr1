import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search } from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Who is eligible to vote in India?",
      answer: "Any Indian citizen who is 18 years of age or older on the qualifying date (usually January 1st of the year) and is enrolled in the electoral roll can vote. Non-resident Indians (NRIs) can also vote but must be physically present at the polling booth."
    },
    {
      question: "How can I register to vote?",
      answer: "You can register online through the National Voters' Services Portal (NVSP) by filling Form 6. You can also register offline by submitting Form 6 to the Electoral Registration Officer (ERO) of your assembly constituency."
    },
    {
      question: "What documents do I need to carry to the polling booth?",
      answer: "You must carry your Voter ID (EPIC). If you don't have it, you can use other approved photo ID proofs like Aadhaar Card, PAN Card, Driving License, Indian Passport, or Bank Passbook with a photograph."
    },
    {
      question: "What is a VVPAT machine?",
      answer: "VVPAT stands for Voter Verifiable Paper Audit Trail. It is an independent verification system attached to the EVM that allows voters to verify that their vote was cast correctly. A paper slip is generated and shown for 7 seconds before falling into a secure box."
    },
    {
      question: "What should I do if my name is not on the voter list?",
      answer: "You cannot vote if your name is not on the electoral roll, even if you have a Voter ID. You should verify your name on the electoral roll well in advance of the election date."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Find answers to common questions about the election process.</p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-12 pr-4 py-4 glass-panel rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg dark:text-white transition-shadow"
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div 
            key={index} 
            className="glass-panel rounded-xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="font-semibold text-lg pr-8">{faq.question}</span>
              <div className={`p-1 rounded-full flex-shrink-0 transition-colors ${
                openIndex === index ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                    <div className="pt-4">{faq.answer}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
