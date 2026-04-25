import { Request, Response } from 'express';
import geminiService from '../services/geminiService';

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    // 1. Input Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long. Max 1000 characters.' });
    }

    const finalSessionId = sessionId || 'default-session';

    // 2. Call Gemini Service
    const reply = await geminiService.getChatResponse(finalSessionId, message);

    // 3. Success Response
    res.json({ reply });

  } catch (error: any) {
    console.error('[CHAT CONTROLLER ERROR]', error.message);
    
    // 4. Safe Error Handling
    res.status(500).json({ 
      reply: "I'm having trouble connecting to the election database right now. Please try again in a moment!" 
    });
  }
};
