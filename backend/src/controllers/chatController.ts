import { type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
import geminiService from '../services/geminiService';
import { getCache, setCache } from '../utils/cache';
import { logger } from '../utils/logger';

/** Maximum allowed message length (characters) */
const MAX_MESSAGE_LENGTH = 1000;

/**
 * Handle incoming chat messages.
 * Validates input, checks cache, and forwards to Gemini API.
 */
export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return;
    }

    const { message, sessionId } = req.body as { message: string; sessionId?: string };

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
