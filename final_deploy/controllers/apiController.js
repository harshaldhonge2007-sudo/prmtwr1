"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVotingGuide = exports.getLocationInfo = exports.getFaq = exports.getTimeline = exports.handleChat = void 0;
const geminiService_1 = __importDefault(require("../services/geminiService"));
const handleChat = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message || typeof message !== 'string' || message.length > 500) {
            return res.status(400).json({ error: 'Invalid message. Max 500 characters allowed.' });
        }
        // Fixed: Passing sessionId as the first argument
        const finalSessionId = sessionId || 'default-session';
        let reply = await geminiService_1.default.getChatResponse(finalSessionId, message);
        if (!reply) {
            reply = "I am here to help with your election questions.";
        }
        res.json({ reply });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.handleChat = handleChat;
const getTimeline = (req, res) => {
    res.json([
        { stage: 'Announcement', date: 'Oct 10, 2026', status: 'completed' },
        { stage: 'Voting Day', date: 'Nov 12, 2026', status: 'upcoming' },
        { stage: 'Results', date: 'Nov 15, 2026', status: 'upcoming' }
    ]);
};
exports.getTimeline = getTimeline;
const getFaq = (req, res) => {
    res.json([
        { question: 'Age limit?', answer: '18+ years.' },
        { question: 'Registration?', answer: 'Online at voters.eci.gov.in' }
    ]);
};
exports.getFaq = getFaq;
const getLocationInfo = (req, res) => {
    res.json({
        upcomingElection: "State Assembly Elections 2026",
        date: "November 12, 2026",
        booth: "Local High School, Main Hall"
    });
};
exports.getLocationInfo = getLocationInfo;
const getVotingGuide = (req, res) => {
    res.json({
        steps: [
            { id: 1, title: "Voter Registration", content: "Register via Form 6." },
            { id: 2, title: "Casting Your Vote", content: "Visit booth with ID, press EVM button." }
        ]
    });
};
exports.getVotingGuide = getVotingGuide;
