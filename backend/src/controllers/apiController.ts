import { Request, Response } from 'express';
import geminiService from '../services/geminiService';

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.length > 500) {
      return res.status(400).json({ error: 'Invalid message. Max 500 characters allowed.' });
    }

    let reply = await geminiService.getChatResponse(message);

    if (!reply) {
      const lower = message.toLowerCase();
      if (lower.includes('vote')) reply = "To vote in India: Ensure you're registered, find your booth at voters.eci.gov.in, and visit with your ID.";
      else reply = "I am here to help with your election questions.";
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTimeline = (req: Request, res: Response) => {
  res.json([
    { stage: 'Announcement', date: 'Oct 10, 2026', status: 'completed' },
    { stage: 'Voting Day', date: 'Nov 12, 2026', status: 'upcoming' },
    { stage: 'Results', date: 'Nov 15, 2026', status: 'upcoming' }
  ]);
};

export const getFaq = (req: Request, res: Response) => {
  res.json([
    { question: 'Age limit?', answer: '18+ years.' },
    { question: 'Registration?', answer: 'Online at voters.eci.gov.in' }
  ]);
};

export const getLocationInfo = (req: Request, res: Response) => {
  res.json({
    upcomingElection: "State Assembly Elections 2026",
    date: "November 12, 2026",
    booth: "Local High School, Main Hall"
  });
};

export const getVotingGuide = (req: Request, res: Response) => {
  res.json({
    steps: [
      { id: 1, title: "Voter Registration", content: "Register via Form 6." },
      { id: 2, title: "Casting Your Vote", content: "Visit booth with ID, press EVM button." }
    ]
  });
};
