import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Volume2 } from 'lucide-react';
import { auth, saveChatHistory } from '../firebase/config';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your Election Process Education Assistant. I can help you understand how elections work, how to register to vote, and what to do on voting day. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const quickPrompts = [
    "How do elections work in India?",
    "What are the steps to vote?",
    "What documents do I need to vote?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm sorry, I couldn't process that right now."
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Save to Firebase if user is logged in
      if (user) {
        saveChatHistory(user.uid, text, data.reply || "");
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my server right now. Please try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] glass-panel rounded-2xl overflow-hidden" role="main" aria-label="Election Assistant Chat Interface">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary-500" aria-hidden="true" />
          Election Assistant
        </h2>
        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
          Powered by Google Gemini
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6" role="log" aria-live="polite">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-4 relative group ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-none'
              }`} aria-label={`${msg.role === 'user' ? 'Your message' : 'Assistant message'}: ${msg.content}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => speak(msg.content)}
                    className="absolute -right-10 top-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    aria-label="Listen to response"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center flex-shrink-0">
                  {user && user.photoURL ? (
                    <img src={user.photoURL} alt="Your profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 justify-start"
              aria-label="Assistant is typing"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                <span className="text-gray-500 text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Suggested questions">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Type your question here..."
            className="flex-grow bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
            aria-label="Chat input"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {!user && (
          <p className="text-[10px] text-gray-400 mt-2 text-center italic">Login to save your chat history securely in your Google Account.</p>
        )}
      </div>
    </div>
  );
};

export default Chat;

