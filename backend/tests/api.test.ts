import request from 'supertest';
import app from '../src/app';

describe('API Endpoints & Integration Scenarios', () => {
  let attemptId: string;

  test('GET /api/problems returns list of LLD problems', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/problems/:id returns specific problem detail', async () => {
    const res = await request(app).get('/api/problems/parking-lot');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('parking-lot');
    expect(res.body.data.rubric).toBeDefined();
  });

  test('POST /api/attempts starts a new practice attempt', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({ problemId: 'parking-lot' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.status).toBe('IN_PROGRESS');

    attemptId = res.body.data.id;
  });

  test('Edge Case: POST /api/attempts with invalid payload returns 400', async () => {
    const res = await request(app)
      .post('/api/attempts')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Missing required body field');
  });

  test('POST /api/attempts/:id/submit processes submission and updates status', async () => {
    const res = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .send({
        format: 'CODE_TS',
        content: `
          export enum VehicleType { MOTORCYCLE, COMPACT, LARGE }
          export class Vehicle {}
          export class ParkingSpot {}
          export interface IPricingStrategy { calculateFee(): number; }
          export class ParkingLot { parkVehicle() {} unparkVehicle() {} }
        `,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.submissions.length).toBe(1);

    // Wait 500ms for background evaluation to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const pollRes = await request(app).get(`/api/attempts/${attemptId}`);
    expect(pollRes.status).toBe(200);
    expect(pollRes.body.data.status).toBe('COMPLETED');
    expect(pollRes.body.data.feedbackReport).toBeDefined();
    expect(pollRes.body.data.feedbackReport.score).toBeGreaterThan(0);
  });

  test('Edge Case: POST /api/attempts/:id/submit with empty content returns 400', async () => {
    const res = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .send({
        format: 'CODE_TS',
        content: '   ',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Submission content cannot be empty');
  });

  test('POST /api/attempts/:id/retry-evaluation triggers re-evaluation', async () => {
    const res = await request(app)
      .post(`/api/attempts/${attemptId}/retry-evaluation`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('EVALUATING');
  });
});
