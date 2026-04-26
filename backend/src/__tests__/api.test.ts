import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api';

const app = express();
app.use(express.json());

// Health check (added for test app)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount routes
app.use('/api', apiRoutes);

describe('Election Assistant API Suite', () => {
  // Test 1: Health Check
  test('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Test 2: FAQ API
  test('GET /api/faq should return list of FAQs', async () => {
    const res = await request(app).get('/api/faq');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test 3: Timeline API
  test('GET /api/timeline should return election phases', async () => {
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test 4: Location Info API
  test('POST /api/location-info should return booth details', async () => {
    const res = await request(app).post('/api/location-info').send({ lat: 19.0, lng: 72.0 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('booth');
  });

  // Test 5: Chat Validation - Empty Message
  test('POST /api/chat with empty message should return 400', async () => {
    const res = await request(app).post('/api/chat').send({ message: '' });
    expect(res.status).toBe(400);
  });

  // Test 6: Chat Validation - Long Message (Edge Case)
  test('POST /api/chat with very long message should still return 200', async () => {
    const longMessage = 'a'.repeat(2000);
    const res = await request(app).post('/api/chat').send({ message: longMessage });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reply');
  });

  // Test 7: Guide API
  test('GET /api/voting-guide should return voting steps', async () => {
    const res = await request(app).get('/api/voting-guide');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('steps');
  });
});
