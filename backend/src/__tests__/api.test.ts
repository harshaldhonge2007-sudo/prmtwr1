import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';
import chatRoutes from '../routes/chatRoutes';

// Mock geminiService so tests never hit the real Gemini API
jest.mock('../services/geminiService', () => ({
  __esModule: true,
  default: {
    getChatResponse: jest.fn().mockResolvedValue(
      'Voting in India requires a Voter ID card. You can register at voters.eci.gov.in.'
    ),
  },
}));

/** Test Express app mirroring production route mounting */
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/chat', chatRoutes);

describe('Election Assistant API', () => {

  // ---- Health Check ----
  describe('GET /api/health', () => {
    it('should return 200 with status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'ok', service: 'elecguide-api' });
    });
  });

  // ---- FAQ ----
  describe('GET /api/faq', () => {
    it('should return an array of FAQ entries', async () => {
      const res = await request(app).get('/api/faq');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('each FAQ should have question, answer, and category', async () => {
      const res = await request(app).get('/api/faq');
      (res.body as Record<string, unknown>[]).forEach((faq) => {
        expect(faq).toHaveProperty('question');
        expect(faq).toHaveProperty('answer');
        expect(faq).toHaveProperty('category');
        expect(typeof faq.question).toBe('string');
        expect(typeof faq.answer).toBe('string');
      });
    });
  });

  // ---- Timeline ----
  describe('GET /api/timeline', () => {
    it('should return an array of timeline phases', async () => {
      const res = await request(app).get('/api/timeline');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    it('each phase should have stage, date, status, and description', async () => {
      const res = await request(app).get('/api/timeline');
      (res.body as Record<string, unknown>[]).forEach((phase) => {
        expect(phase).toHaveProperty('stage');
        expect(phase).toHaveProperty('date');
        expect(phase).toHaveProperty('status');
        expect(phase).toHaveProperty('description');
      });
    });

    it('status values should be valid enum values', async () => {
      const res = await request(app).get('/api/timeline');
      const validStatuses = ['completed', 'in-progress', 'upcoming'];
      (res.body as Record<string, unknown>[]).forEach((phase) => {
        expect(validStatuses).toContain(phase.status);
      });
    });
  });

  // ---- Location Info ----
  describe('POST /api/location-info', () => {
    it('should return booth details with all required fields', async () => {
      const res = await request(app)
        .post('/api/location-info')
        .send({ pincode: '400001' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('booth');
      expect(res.body).toHaveProperty('address');
      expect(res.body).toHaveProperty('timings');
      expect(res.body).toHaveProperty('facilities');
    });

    it('facilities should be an array', async () => {
      const res = await request(app)
        .post('/api/location-info')
        .send({ pincode: '400001' });
      expect(Array.isArray(res.body.facilities)).toBe(true);
      expect(res.body.facilities.length).toBeGreaterThan(0);
    });
  });

  // ---- Voting Guide ----
  describe('GET /api/voting-guide', () => {
    it('should return guide with steps array', async () => {
      const res = await request(app).get('/api/voting-guide');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('steps');
      expect(Array.isArray(res.body.steps)).toBe(true);
    });

    it('each step should have id, title, content, and icon', async () => {
      const res = await request(app).get('/api/voting-guide');
      (res.body.steps as Record<string, unknown>[]).forEach((step) => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('content');
        expect(step).toHaveProperty('icon');
      });
    });

    it('steps should be in sequential order starting from 1', async () => {
      const res = await request(app).get('/api/voting-guide');
      const ids = (res.body.steps as { id: number }[]).map((s) => s.id);
      expect(ids[0]).toBe(1);
    });
  });

  // ---- Chat Input Validation ----
  describe('POST /api/chat', () => {
    it('should reject empty string with 400', async () => {
      const res = await request(app).post('/api/chat').send({ message: '' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject missing message field with 400', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.status).toBe(400);
    });

    it('should reject whitespace-only messages with 400', async () => {
      const res = await request(app).post('/api/chat').send({ message: '   ' });
      expect(res.status).toBe(400);
    });

    it('should accept valid message and return a string reply', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'How do I register to vote?' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reply');
      expect(typeof res.body.reply).toBe('string');
      expect(res.body.reply.length).toBeGreaterThan(0);
    });

    it('should return cached reply on repeated same question', async () => {
      const msg = 'What is a VVPAT machine?';
      const res1 = await request(app).post('/api/chat').send({ message: msg });
      const res2 = await request(app).post('/api/chat').send({ message: msg });
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      // Second call should come from cache
      expect(res2.body.cached).toBe(true);
    });

    it('should reject messages over 2000 characters with 400', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'a'.repeat(2001) });
      expect(res.status).toBe(400);
    });
  });
});
