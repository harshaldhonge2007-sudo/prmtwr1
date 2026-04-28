import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';
import { auth, saveChatHistory } from '../firebase/config';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'How do elections work in India?',
  'What are the steps to vote?',
  'What documents do I need to vote?',
] as const;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your Election Process Education Assistant powered by Google Gemini. I can help you understand how elections work, how to register to vote, and what to do on voting day. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const speak = useCallback((text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
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
        content: data.reply || "I'm sorry, I couldn't process that right now.",
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Persist to Firestore if authenticated
      if (user) {
        saveChatHistory(user.uid, text, data.reply || '');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting to my server right now. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [user]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(input);
      }
    },
    [handleSend, input]
  );

  return (
    <div
      className="max-w-4xl mx-auto flex flex-col h-[80vh] glass-panel rounded-2xl overflow-hidden"
      role="region"
      aria-label="Election Assistant Chat Interface"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary-500" aria-hidden="true" />
          Election Assistant
        </h1>
        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
          Powered by Google Gemini
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6" role="log" aria-live="polite" aria-relevant="additions">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl p-4 relative group ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {msg.role === 'assistant' && msg.id !== 'welcome' && (
                  <button
                    onClick={() => speak(msg.content)}
                    className="absolute -right-10 top-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm focus:opacity-100"
                    aria-label={isSpeaking ? 'Stop reading' : 'Listen to this response'}
                    title={isSpeaking ? 'Stop' : 'Listen'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-5 h-5" />
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
              role="status"
              aria-label="Assistant is thinking"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" aria-hidden="true" />
                <span className="text-gray-500 text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Suggested questions">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">Type your question</label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className="flex-grow bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
            autoComplete="off"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:outline-none"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {!user && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Sign in to save your chat history securely via Google Firestore.
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
