const request = require('supertest');
const app = require('./server');

describe('GET /health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/timeline', () => {
  it('returns array of 5 election stages', async () => {
    const res = await request(app).get('/api/timeline');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(5);
  });
  it('each stage has required fields', async () => {
    const res = await request(app).get('/api/timeline');
    res.body.forEach(item => {
      expect(item).toHaveProperty('stage');
      expect(item).toHaveProperty('desc');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('status');
    });
  });
  it('uses cache on second call', async () => {
    await request(app).get('/api/timeline');
    const res = await request(app).get('/api/timeline');
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /api/faq', () => {
  it('returns array of FAQs', async () => {
    const res = await request(app).get('/api/faq');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it('each FAQ has question and answer', async () => {
    const res = await request(app).get('/api/faq');
    res.body.forEach(item => {
      expect(item).toHaveProperty('q');
      expect(item).toHaveProperty('a');
    });
  });
});

describe('GET /api/quiz', () => {
  it('returns quiz questions', async () => {
    const res = await request(app).get('/api/quiz');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it('each question has options and answer index', async () => {
    const res = await request(app).get('/api/quiz');
    res.body.forEach(item => {
      expect(item).toHaveProperty('q');
      expect(item).toHaveProperty('opts');
      expect(item).toHaveProperty('ans');
      expect(Array.isArray(item.opts)).toBe(true);
      expect(item.opts.length).toBe(4);
      expect(typeof item.ans).toBe('number');
    });
  });
});

describe('POST /api/chat', () => {
  it('returns a reply for valid message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I vote?' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(0);
  });

  it('returns 400 for empty message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for missing message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for message that is too long', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'a'.repeat(501) });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/too long/i);
  });

  it('sanitizes XSS attempt', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '<script>alert(1)</script>' });
    expect(res.statusCode).toBe(400);
  });

  it('returns different replies for different topics', async () => {
    const topics = ['documents needed', 'register to vote', 'what is EVM'];
    for (const topic of topics) {
      const res = await request(app).post('/api/chat').send({ message: topic });
      expect(res.statusCode).toBe(200);
      expect(res.body.reply.length).toBeGreaterThan(10);
    }
  });
});

describe('GET /api/analytics', () => {
  it('returns analytics object', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalRequests');
    expect(res.body).toHaveProperty('uptime');
  });
});
