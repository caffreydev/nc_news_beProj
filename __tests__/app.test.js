const request = require('supertest');
const db = require('../db/connection.js');
const app = require('../app/app.js');
const data = require('../db/data/test-data');
const seed = require('../db/seeds/seed.js');
const fs = require('fs').promises;

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('invalid endpoints should throw an error', () => {
  it('get /api/pippascool should throw error without responding', () => {
    return request(app).get('/api/pippascool').expect(404);
  });
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
        expect(body.length).toBe(3);
        body.forEach((obj) => {
          expect(typeof obj).toBe('object');
        });
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

describe('GET /api', () => {
  it('should respond with a 200 status code', () => {
    return request(app).get('/api').expect(200);
  });

  it('should respond with a valid JSON object', () => {
    return request(app)
      .get('/api')
      .then((data) => {
        expect(typeof data).toBe('object');
      });
  });

  it('should agree with the JSON object saved in endpointsList.json', () => {
    let appResponse;
    let fileResponse;
    const appCall = request(app)
      .get('/api')
      .then(({ text }) => {
        appResponse = text;
      });
    const fileData = fs
      .readFile(`${__dirname}/../app/endpointsList.json`, 'utf8')
      .then((data) => {
        fileResponse = data;
      });

    return Promise.all([appCall, fileData]).then(() => {
      expect(appResponse).toEqual(fileResponse);
    });
  });
});

describe('GET api/articles/:article_id', () => {
  it('should return a 200 status code if called correctly', () => {
    return request(app).get('/api/articles/1').expect(200);
  });

  it('should return an object if called correctly', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe('object');
      });
  });

  it('should return correct object for id of 1', () => {
    const firstArticle = { ...data.articleData[0] };
    let creationDate = new Date(firstArticle.created_at - 3600000); //adjustment for bst
    firstArticle.created_at = creationDate.toISOString();
    firstArticle.article_id = 1;

    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(body);
      });
  });

  it('should handle incorrect / non existent id with appropriate error', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .catch((e) => {
        expect(e).toEqual({ message: 'resource not found' });
      });
  });

  it('should handle incorrect / non existent id with appropriate error', () => {
    return request(app)
      .get('/api/articles/chocolatecake')
      .expect(404)
      .catch((e) => {
        expect(e).toEqual({ message: 'resource not found' });
      });
  });
});
