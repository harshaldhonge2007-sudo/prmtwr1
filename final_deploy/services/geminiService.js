"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
// Simple in-memory session store (Last 5 messages per session)
const sessions = new Map();
class GeminiService {
    genAI = null;
    model;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: 'You are ElecGuide, a helpful expert on the Indian election process. Provide concise, factual information about voter registration, IDs, EVMs, and polling steps. Maintain a professional tone. If asked about politics or candidates, politely decline and stick to the process.'
            });
        }
    }
    async getChatResponse(sessionId, message) {
        if (!this.model)
            throw new Error('Gemini API not initialized');
        // Get or initialize session history
        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, []);
        }
        const history = sessions.get(sessionId);
        try {
            // Create chat session with history
            const chat = this.model.startChat({ history });
            const result = await chat.sendMessage(message);
            const reply = result.response.text();
            // Update history and keep only last 5 messages (10 items: 5 user, 5 AI)
            history.push({ role: 'user', parts: [{ text: message }] });
            history.push({ role: 'model', parts: [{ text: reply }] });
            if (history.length > 10) {
                sessions.set(sessionId, history.slice(-10));
            }
            return reply;
        }
        catch (error) {
            console.error('Gemini Service Error:', error.message);
            throw error;
        }
    }
}
exports.default = new GeminiService();
