'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Gemini AI Setup ──────────────────────────────────────────
let genModel = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    genModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'You are ElecGuide, a friendly expert on Indian elections and civic participation. Keep answers concise, factual, and helpful. Focus on Indian election processes, voter rights, and democratic participation.'
    });
    console.log('✅ Gemini AI connected');
  } else {
    console.log('⚠️  GEMINI_API_KEY not set — using fallback responses');
  }
} catch (e) {
  console.error('Gemini init error:', e.message);
}

// ── In-Memory Cache ──────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Get value from cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached value or null
 */
function getCache(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
}

/**
 * Set value in cache with timestamp
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ── Analytics (In-Memory) ────────────────────────────────────
const analytics = { totalRequests: 0, queries: [], errors: 0 };

// ── Input Validation ─────────────────────────────────────────
/**
 * Validate chat message input
 * @param {any} msg - Input message
 * @returns {{ valid: boolean, error?: string }}
 */
function validateMessage(msg) {
  if (!msg || typeof msg !== 'string') return { valid: false, error: 'Message must be a non-empty string.' };
  const trimmed = msg.trim();
  if (trimmed.length === 0) return { valid: false, error: 'Message cannot be empty.' };
  if (trimmed.length > 500) return { valid: false, error: 'Message too long. Maximum 500 characters.' };
  if (/<script|javascript:|on\w+=/i.test(trimmed)) return { valid: false, error: 'Invalid content detected.' };
  return { valid: true, sanitized: trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;') };
}

// ── Middleware ───────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', methods: ['GET', 'POST'] }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Request logger
app.use((req, res, next) => {
  analytics.totalRequests++;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Rate Limiting ────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a minute.' }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat requests. Please wait a minute.' }
});

app.use('/api/', globalLimiter);

// ── Session Store (In-Memory Chat History) ───────────────────
const sessions = new Map();
const MAX_HISTORY = 10; // messages per session

// ── ROUTES ───────────────────────────────────────────────────

/**
 * POST /api/chat
 * Send message to Gemini AI or get a fallback response
 */
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, sessionId = 'anon' } = req.body;
    const validation = validateMessage(message);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    const msg = validation.sanitized;
    analytics.queries.push({ q: msg.substring(0, 60), t: new Date().toISOString() });
    if (analytics.queries.length > 200) analytics.queries.shift();

    let reply, isAI = false;

    if (genModel) {
      // Real Gemini response with session memory
      if (!sessions.has(sessionId)) sessions.set(sessionId, []);
      const history = sessions.get(sessionId);

      const chat = genModel.startChat({ history });
      const result = await chat.sendMessage(msg);
      reply = result.response.text();
      isAI = true;

      // Update history (keep last N turns)
      history.push({ role: 'user', parts: [{ text: msg }] });
      history.push({ role: 'model', parts: [{ text: reply }] });
      if (history.length > MAX_HISTORY * 2) history.splice(0, 2);
    } else {
      // Smart fallback responses
      const m = msg.toLowerCase();
      if (m.includes('register') || m.includes('enroll'))
        reply = '📝 To register:\n1. Visit voters.eci.gov.in\n2. Fill Form 6 online\n3. Or visit your local ERO office\n\nYou must be 18+ and an Indian citizen.';
      else if (m.includes('document') || m.includes('id') || m.includes('proof'))
        reply = '📄 Required documents:\n• Primary: Voter ID (EPIC)\n• Alternatives: Aadhaar, PAN, Driving License, Passport\n\nYour name must be on the electoral roll.';
      else if (m.includes('evm') || m.includes('machine'))
        reply = '🗳️ EVM = Electronic Voting Machine\n• Tamper-proof & secure\n• Approved by Supreme Court\n• Used in all Indian elections since 2004\n• Paired with VVPAT for verification';
      else if (m.includes('vvpat'))
        reply = '🔍 VVPAT = Voter Verifiable Paper Audit Trail\n• Shows a paper slip of your vote for 7 seconds\n• Lets you verify your choice was recorded correctly\n• Slip falls into a sealed box for auditing';
      else if (m.includes('nri') || m.includes('abroad'))
        reply = '🌍 NRI Voting:\n• NRIs can vote but must be physically present at their polling booth\n• Postal/proxy voting is NOT available for NRIs\n• Register at voters.eci.gov.in with passport details';
      else if (m.includes('vote') || m.includes('how') || m.includes('step'))
        reply = '🗳️ How to vote in India:\n1️⃣ Register at voters.eci.gov.in\n2️⃣ Get your Voter ID (EPIC card)\n3️⃣ Check your polling booth on voter slip\n4️⃣ Go on voting day with valid ID\n5️⃣ Press your candidate\'s button on EVM\n6️⃣ Verify VVPAT slip (7 seconds)';
      else
        reply = '👋 I\'m ElecGuide! I can help with:\n• How to vote in India\n• Voter registration process\n• Documents required\n• EVM and VVPAT explained\n• NRI voting rules\n• Election timeline & FAQ\n\nWhat would you like to know?';
    }

    res.json({ reply, isAI, sessionId });
  } catch (err) {
    analytics.errors++;
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Unable to process your request. Please try again.' });
  }
});

/**
 * GET /api/timeline
 * Returns structured election timeline (cached)
 */
app.get('/api/timeline', (req, res) => {
  const cached = getCache('timeline');
  if (cached) return res.json(cached);

  const data = [
    { stage: 'Announcement', desc: 'The Election Commission announces poll dates and schedule. The Model Code of Conduct (MCC) comes into immediate effect, restricting political activities.', date: 'Oct 10, 2026', status: 'completed', icon: '📢' },
    { stage: 'Nomination', desc: 'Candidates file nomination papers with the Returning Officer. A scrutiny period follows, after which candidates may withdraw within a set deadline.', date: 'Oct 15–22, 2026', status: 'completed', icon: '📝' },
    { stage: 'Campaigning', desc: 'Political parties and candidates campaign across constituencies. All campaign activities must cease 48 hours before polling begins (silence period).', date: 'Oct 25 – Nov 10', status: 'current', icon: '🗣️' },
    { stage: 'Voting Day', desc: 'Registered voters visit their designated polling booths to cast ballots using EVMs. Indelible ink is applied to the left index finger after voting.', date: 'Nov 12, 2026', status: 'upcoming', icon: '🗳️' },
    { stage: 'Counting & Results', desc: 'Votes are counted at counting centers under ECI supervision. Winners are declared and the process of government formation begins.', date: 'Nov 15, 2026', status: 'upcoming', icon: '📊' }
  ];

  setCache('timeline', data);
  res.json(data);
});

/**
 * GET /api/faq
 * Returns frequently asked questions (cached)
 */
app.get('/api/faq', (req, res) => {
  const cached = getCache('faq');
  if (cached) return res.json(cached);

  const data = [
    { q: 'Who is eligible to vote in India?', a: 'Any Indian citizen aged 18 or above who is enrolled in the electoral roll (voter list) of their constituency is eligible to vote.' },
    { q: 'How do I register to vote?', a: 'You can register online at voters.eci.gov.in by filling Form 6. Alternatively, visit your local Electoral Registration Officer (ERO) with proof of age, identity, and address.' },
    { q: 'What documents do I need at the polling booth?', a: 'Your Voter ID card (EPIC) is the primary document. Acceptable alternatives include Aadhaar Card, PAN Card, Driving Licence, Passport, or MNREGA Job Card — as long as your name appears on the voter list.' },
    { q: 'What is an EVM and is it secure?', a: 'An EVM (Electronic Voting Machine) is a secure, standalone device that records votes electronically. It is not connected to any network, making it impossible to hack remotely. The Supreme Court of India has upheld its integrity.' },
    { q: 'What is VVPAT and how does it work?', a: 'VVPAT (Voter Verifiable Paper Audit Trail) is connected to the EVM. After you press a button, a paper slip showing the candidate\'s name and symbol is visible through a glass window for 7 seconds, then drops into a sealed box for potential auditing.' },
    { q: 'Can NRIs vote in Indian elections?', a: 'Yes, NRIs (Non-Resident Indians) can vote in Indian elections but must be physically present at their designated polling booth on voting day. Postal voting and proxy voting are not available for NRIs.' },
    { q: 'What if my name is not on the voter list?', a: 'You cannot vote without being enrolled in the electoral roll. Always verify your name at voters.eci.gov.in well before election day. If missing, file Form 6 to get enrolled.' },
    { q: 'What is the Model Code of Conduct?', a: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI that comes into effect from the announcement of election dates. It governs the conduct of political parties, candidates, and the government during the election period.' }
  ];

  setCache('faq', data);
  res.json(data);
});

/**
 * GET /api/quiz
 * Returns quiz questions about Indian elections (cached)
 */
app.get('/api/quiz', (req, res) => {
  const cached = getCache('quiz');
  if (cached) return res.json(cached);

  const data = [
    { q: 'What is the minimum voting age in India?', opts: ['16 years', '18 years', '21 years', '25 years'], ans: 1, fact: 'The 61st Constitutional Amendment (1988) lowered the voting age from 21 to 18 years.' },
    { q: 'What does EVM stand for?', opts: ['Electronic Voting Machine', 'Election Verification Method', 'Electronic Vote Monitor', 'Electoral Voting Mechanism'], ans: 0, fact: 'EVMs were first used experimentally in 1982 in Kerala and adopted nationwide by 2004.' },
    { q: 'What does VVPAT stand for?', opts: ['Voter Verified Paper Audit Trail', 'Vote Verified Paper Audit Trail', 'Voter Verifiable Paper Audit Trail', 'Voter Verification Paper Audit Trail'], ans: 2, fact: 'The VVPAT was first used in the 2014 General Elections in select constituencies.' },
    { q: 'Which body conducts general elections in India?', opts: ['Supreme Court of India', 'Parliament of India', 'Election Commission of India', 'President of India'], ans: 2, fact: 'The ECI is an autonomous constitutional authority established on January 25, 1950.' },
    { q: 'How many Lok Sabha constituencies are there in India?', opts: ['445', '543', '552', '525'], ans: 1, fact: '543 elected members of the Lok Sabha represent constituencies across India.' },
    { q: 'What is Form 6 used for in elections?', opts: ['Casting vote', 'Voter registration', 'Filing nomination', 'Requesting recount'], ans: 1, fact: 'Form 6 is the application form to enroll as a new voter in the electoral roll.' },
    { q: 'For how long is the VVPAT slip visible to the voter?', opts: ['3 seconds', '5 seconds', '7 seconds', '10 seconds'], ans: 2, fact: 'The Supreme Court mandated in 2019 that the VVPAT slip be visible for at least 7 seconds.' }
  ];

  setCache('quiz', data);
  res.json(data);
});

/**
 * GET /api/analytics
 * Returns usage analytics
 */
app.get('/api/analytics', (req, res) => {
  res.json({
    totalRequests: analytics.totalRequests,
    recentQueries: analytics.queries.slice(-10),
    errors: analytics.errors,
    cacheKeys: Array.from(cache.keys()),
    uptime: `${Math.floor(process.uptime())}s`,
    geminiEnabled: !!genModel
  });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', gemini: !!genModel, uptime: Math.floor(process.uptime()) });
});

// ── Static Frontend ──────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  analytics.errors++;
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ ElecGuide v2.0 running on port ${PORT}`);
  console.log(`   Gemini AI: ${genModel ? 'ENABLED' : 'DISABLED (fallback mode)'}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // Export for testing
