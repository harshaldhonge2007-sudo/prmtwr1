"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const geminiService_1 = __importDefault(require("../services/geminiService"));
const handleChat = async (req, res) => {
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
        const reply = await geminiService_1.default.getChatResponse(finalSessionId, message);
        // 3. Success Response
        res.json({ reply });
    }
    catch (error) {
        console.error('[CHAT CONTROLLER ERROR]', error.message);
        // 4. Safe Error Handling
        res.status(500).json({
            reply: "I'm having trouble connecting to the election database right now. Please try again in a moment!"
        });
    }
};
exports.handleChat = handleChat;
