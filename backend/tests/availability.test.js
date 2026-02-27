const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const availabilityRoutes = require('../routes/availabilityRoutes');
const jwt = require('jsonwebtoken');

// Minimal express app for integration tests
function createApp() {
  const app = express();
  app.use(bodyParser.json());
  // attach routes under /api/availability like real app
  app.use('/api/availability', availabilityRoutes);
  return app;
}

// Helper to create auth header
function tokenFor(user) {
  const secret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign(user, secret, { expiresIn: '1h' });
}

describe('Availability integration (smoke)', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('GET /api/availability should return array (public)', async () => {
    const res = await request(app).get('/api/availability');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/availability without auth should be 401', async () => {
    const res = await request(app).post('/api/availability').send({ day: 'Monday', startTime: '09:00', endTime: '10:00' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/availability as non-professional should be 403', async () => {
    const token = tokenFor({ id: 'u1', role: 'patient' });
    const res = await request(app).post('/api/availability').set('Authorization', `Bearer ${token}`).send({ day: 'Monday', startTime: '09:00', endTime: '10:00' });
    expect(res.statusCode).toBe(403);
  });
});
