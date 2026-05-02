import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { logger } from '../utils/logger';

/** Shape of a single history entry for the Gemini chat session */
interface HistoryEntry {
  role: string;
  parts: { text: string }[];
}

/** Maximum number of history items to retain per session (5 pairs = 10 items) */
const MAX_HISTORY_LENGTH = 10;

/** In-memory session store: maps sessionId → conversation history */
const sessions = new Map<string, HistoryEntry[]>();

/**
 * GeminiService encapsulates all interactions with the Google Gemini API.
 * It maintains per-session conversation history for contextual responses.
 */
class GeminiService {
  private model: GenerativeModel | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction:
          'You are CivicSync, an expert on the Indian election process. ' +
          'Provide concise, factual information about voter registration, ' +
          'Voter IDs, EVMs, VVPAT, and polling procedures. ' +
          'Maintain a professional and neutral tone. ' +
          'If asked about political parties or candidates, politely decline ' +
          'and redirect to election process topics.',
      });
      logger.info('Gemini API initialized successfully');
    } else {
      logger.warn('GEMINI_API_KEY not set — AI chat will be unavailable');
    }
  }

  /**
   * Send a message to the Gemini model within a session context.
   * @param sessionId - Unique identifier for the conversation session
   * @param message - The user's message text
   * @returns The AI-generated response text
   * @throws Error if the Gemini API is not initialized
   */
  async getChatResponse(sessionId: string, message: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not initialized — check GEMINI_API_KEY');
    }

    // Initialize session history if new
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }
    const history = sessions.get(sessionId)!;

    try {
      const chat = this.model.startChat({ history });
      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      // Append to history
      history.push({ role: 'user', parts: [{ text: message }] });
      history.push({ role: 'model', parts: [{ text: reply }] });

      // Trim history to prevent memory bloat
      if (history.length > MAX_HISTORY_LENGTH) {
        sessions.set(sessionId, history.slice(-MAX_HISTORY_LENGTH));
      }

      return reply;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Gemini API error [session=${sessionId}]: ${errorMessage}`);
      throw error;
    }
  }
}

export default new GeminiService();
