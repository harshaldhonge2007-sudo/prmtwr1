import { type Request, type Response } from 'express';
import geminiService from '../services/geminiService';
import { getCache, setCache } from '../utils/cache';
import { logger } from '../utils/logger';

/** Maximum allowed message length (characters) */
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Handle incoming chat messages.
 * Validates input, checks cache, and forwards to Gemini API.
 */
export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, sessionId } = req.body as { message?: string; sessionId?: string };

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` });
      return;
    }

    // Check cache for repeated queries
    const cacheKey = `chat_${message.trim().toLowerCase()}`;
    const cachedReply = getCache<string>(cacheKey);
    if (cachedReply) {
      logger.debug(`Cache hit for: "${message.substring(0, 50)}..."`);
      res.json({ reply: cachedReply, cached: true });
      return;
    }

    // Forward to Gemini
    const finalSessionId = sessionId || 'default-session';
    const reply = await geminiService.getChatResponse(finalSessionId, message);

    // Cache the response (5 min TTL)
    setCache(cacheKey, reply);

    res.json({ reply });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Chat controller error: ${errorMessage}`);

    res.status(500).json({
      reply: "I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
};
