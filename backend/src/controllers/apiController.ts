import { type Request, type Response } from 'express';

/** Election timeline phase */
interface TimelinePhase {
  stage: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
}

/** FAQ entry */
interface FAQEntry {
  question: string;
  answer: string;
  category: string;
}

/** Voting guide step */
interface VotingStep {
  id: number;
  title: string;
  content: string;
  icon: string;
}

/** Location/booth information */
interface BoothInfo {
  upcomingElection: string;
  date: string;
  booth: string;
  address: string;
  timings: string;
  facilities: string[];
}

/**
 * GET /api/timeline
 * Returns the election timeline with phases and statuses.
 */
export const getTimeline = (_req: Request, res: Response): void => {
  const timeline: TimelinePhase[] = [
    {
      stage: 'Election Announcement',
      date: 'Oct 10, 2026',
      status: 'completed',
      description: 'Election Commission announces the election schedule and model code of conduct comes into effect.',
    },
    {
      stage: 'Nomination Filing',
      date: 'Oct 15–22, 2026',
      status: 'completed',
      description: 'Candidates file their nomination papers with the returning officer.',
    },
    {
      stage: 'Campaign Period',
      date: 'Oct 23 – Nov 10, 2026',
      status: 'in-progress',
      description: 'Political parties and candidates campaign to seek votes.',
    },
    {
      stage: 'Voting Day',
      date: 'Nov 12, 2026',
      status: 'upcoming',
      description: 'Citizens cast their votes at designated polling booths using EVMs.',
    },
    {
      stage: 'Vote Counting',
      date: 'Nov 15, 2026',
      status: 'upcoming',
      description: 'Votes are counted and results are declared by the Election Commission.',
    },
  ];

  res.json(timeline);
};

/**
 * GET /api/faq
 * Returns frequently asked questions about the election process.
 */
export const getFaq = (_req: Request, res: Response): void => {
  const faqs: FAQEntry[] = [
    {
      question: 'Who is eligible to vote in India?',
      answer: 'Any Indian citizen who is 18 years or older on the qualifying date and is enrolled in the electoral roll.',
      category: 'Eligibility',
    },
    {
      question: 'How do I register to vote?',
      answer: 'Register online at voters.eci.gov.in by filling Form 6, or submit Form 6 offline to your Electoral Registration Officer.',
      category: 'Registration',
    },
    {
      question: 'What documents do I need at the polling booth?',
      answer: 'Your Voter ID (EPIC). Alternatives include Aadhaar Card, PAN Card, Driving License, or Indian Passport.',
      category: 'Voting Day',
    },
    {
      question: 'What is an EVM and VVPAT?',
      answer: 'EVM (Electronic Voting Machine) records your vote electronically. VVPAT (Voter Verifiable Paper Audit Trail) prints a slip to verify your vote was cast correctly.',
      category: 'Technology',
    },
    {
      question: 'Can NRIs vote in Indian elections?',
      answer: 'Yes, NRIs can vote but must be physically present at their registered polling booth on election day.',
      category: 'Eligibility',
    },
  ];

  res.json(faqs);
};

/**
 * POST /api/location-info
 * Returns polling booth information based on location input.
 */
export const getLocationInfo = (_req: Request, res: Response): void => {
  const boothInfo: BoothInfo = {
    upcomingElection: 'State Assembly Elections 2026',
    date: 'November 12, 2026',
    booth: 'Government High School, Main Hall',
    address: '123 Democracy Avenue, Ward 15, Mumbai 400001',
    timings: '7:00 AM – 6:00 PM',
    facilities: ['Wheelchair ramp', 'Drinking water', 'Shade area', 'Help desk'],
  };

  res.json(boothInfo);
};

/**
 * GET /api/voting-guide
 * Returns a step-by-step guide to casting your vote.
 */
export const getVotingGuide = (_req: Request, res: Response): void => {
  const guide: { steps: VotingStep[] } = {
    steps: [
      {
        id: 1,
        title: 'Check Your Registration',
        content: 'Verify your name on the electoral roll at voters.eci.gov.in before election day.',
        icon: '🔍',
      },
      {
        id: 2,
        title: 'Locate Your Polling Booth',
        content: 'Find your assigned polling booth using the Voter Helpline App or the ECI website.',
        icon: '📍',
      },
      {
        id: 3,
        title: 'Carry Valid ID',
        content: 'Bring your Voter ID (EPIC) or any approved photo identification document.',
        icon: '🪪',
      },
      {
        id: 4,
        title: 'Cast Your Vote',
        content: 'Enter the booth, verify your details, press the button next to your candidate on the EVM, and check the VVPAT slip.',
        icon: '🗳️',
      },
      {
        id: 5,
        title: 'Get Inked',
        content: 'After voting, your finger will be marked with indelible ink to prevent duplicate voting.',
        icon: '✅',
      },
    ],
  };

  res.json(guide);
};
