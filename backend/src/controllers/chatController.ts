import { Request, Response } from 'express';
import geminiService from '../services/geminiService';
import { getCache, setCache } from '../utils/cache';

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Check Cache
    const cacheKey = `chat_${message.trim().toLowerCase()}`;
    const cachedReply = getCache(cacheKey);
    if (cachedReply) {
      return res.json({ reply: cachedReply, cached: true });
    }

    const finalSessionId = sessionId || 'default-session';
    const reply = await geminiService.getChatResponse(finalSessionId, message);

    // Set Cache (expires in 5 mins)
    setCache(cacheKey, reply);

    res.json({ reply });

  } catch (error: any) {
    console.error('[CHAT CONTROLLER ERROR]', error.message);
    
    // 4. Safe Error Handling
    res.status(500).json({ 
      reply: "I'm having trouble connecting to the election database right now. Please try again in a moment!" 
    });
  }
};
