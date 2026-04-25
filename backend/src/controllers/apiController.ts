import { Request, Response } from 'express';

let genModel: any = null;
const initGemini = async () => {
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      genModel = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: 'You are ElecGuide, a professional expert on Indian elections. Provide concise, accurate, and helpful information about voter registration, documentation, EVMs, and the election process. Avoid political bias.'
      });
      console.log('✓ Gemini AI Initialized');
    } catch (e: any) {
      console.error('✗ Gemini Init Failed:', e.message);
    }
  }
};

initGemini();

// Simulated AI Chat with Gemini fallback
export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let reply = "";

    if (genModel) {
      try {
        const result = await genModel.generateContent(message);
        reply = result.response.text();
      } catch (aiError: any) {
        console.error('Gemini Execution Error:', aiError.message);
      }
    }

    // Fallback logic if Gemini fails or is not configured
    if (!reply) {
      const lowerMessage = message.toLowerCase();
      reply = "I can help you understand the election process, voting steps, and polling info. What would you like to know?";

      if (lowerMessage.includes('how') && lowerMessage.includes('vote')) {
        reply = "To vote: 1. Ensure registration. 2. Get Voter ID (EPIC). 3. Find polling booth. 4. Go to booth and cast vote on EVM.";
      } else if (lowerMessage.includes('document') || lowerMessage.includes('id')) {
        reply = "Primary: Voter ID (EPIC). Alternatives: Aadhaar, PAN, Driving License, or Passport (if name is on voter list).";
      } else if (lowerMessage.includes('india') || lowerMessage.includes('work')) {
        reply = "Elections are managed by ECI. They involve scheduling, nominations, campaigning, voting on EVMs, and results counting.";
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Timeline Data
export const getTimeline = (req: Request, res: Response) => {
  const events = [
    { stage: 'Announcement', description: 'Election Commission announces poll dates and MCC begins.', date: 'Oct 10, 2026', status: 'completed' },
    { stage: 'Nomination', description: 'Candidates file their nomination papers and scrutiny begins.', date: 'Oct 15 - Oct 22, 2026', status: 'completed' },
    { stage: 'Campaigning', description: 'Parties campaign for votes. Ends 48 hours before polls.', date: 'Oct 25 - Nov 10, 2026', status: 'current' },
    { stage: 'Voting Day', description: 'Registered voters cast their ballots at designated booths.', date: 'Nov 12, 2026', status: 'upcoming' },
    { stage: 'Counting & Results', description: 'Votes are counted and results declared by the ECI.', date: 'Nov 15, 2026', status: 'upcoming' }
  ];
  res.json(events);
};

// Location Info
export const getLocationInfo = (req: Request, res: Response) => {
  const { location } = req.body;
  res.json({
    upcomingElection: "State Assembly Elections 2026",
    date: "November 12, 2026",
    booth: "Local High School, Main Hall",
    address: location || "Your Designated Polling Station",
    candidates: 5,
  });
};

export const getVotingGuide = (req: Request, res: Response) => {
  res.json({
    steps: [
      { id: 1, title: "Voter Registration", content: "Register via Form 6 at voters.eci.gov.in." },
      { id: 2, title: "Get your Voter ID (EPIC)", content: "Wait for delivery or download e-EPIC." },
      { id: 3, title: "Find Your Polling Booth", content: "Use the ECI Voter Portal or SMS service." },
      { id: 4, title: "Casting Your Vote", content: "Visit booth with ID, get ink, press EVM button." }
    ]
  });
};

export const getFaq = (req: Request, res: Response) => {
  res.json([
    { question: "Who is eligible to vote in India?", answer: "Any Indian citizen aged 18 or older enrolled in the electoral list." },
    { question: "How can I register to vote?", answer: "Online via the Voter Portal (voters.eci.gov.in) or by visiting your local ERO." },
    { question: "Can I vote without a Voter ID card?", answer: "Yes, if your name is in the list, you can use other approved IDs like Aadhaar or PAN." }
  ]);
};
