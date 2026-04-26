"use strict";
const request = require('supertest');
const express = require('express');
const app = express();
const apiRoutes = require('../routes/api').default;
app.use(express.json());
app.use('/api', apiRoutes);
describe('Election API Tests', () => {
    test('POST /api/chat - Valid input should return response', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'How do I vote?' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reply');
    });
    test('POST /api/chat - Empty input should return 400', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: '' });
        expect(res.statusCode).toEqual(400);
    });
    test('GET /api/faq - Should return list of faqs', async () => {
        const res = await request(app).get('/api/faq');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
