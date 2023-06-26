const request = require('supertest');
const db = require('../db/connection.js');
const app = require('../app/app.js');
const data = require('../db/data/test-data');
const seed = require('../db/seeds/seed.js');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('get /api/topics', () => {
  it('endpoint should respond with a 200 status code', () => {
    return request(app).get('/api/topics').expect(200);
  });

  it('endpoint should respond with an array in the body of response object', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('each element of response array should be an object', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        body.forEach((obj) => {
          expect(typeof obj).toBe('object');
        });
      });
  });

  it('each element of response array should have the appropriate keys and value types', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        body.forEach((obj) => {
          expect(obj).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  it('response array should have the correct number of values, in line with test data', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('response array should have each of data values, in line with test data', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(data.topicData);
      });
  });
});
