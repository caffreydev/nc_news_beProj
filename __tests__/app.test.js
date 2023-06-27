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

describe('invalid endpoints should throw an error and send an invalid path message', () => {
  it('get /api/nonexistentpath should throw error and respond with invalid path', () => {
    return request(app)
      .get('/api/nonexistentpath')
      .expect(404)
      .catch((e) => {
        expect(e).toEqual({ message: 'invalid path' });
      });
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
        expect(body).toEqual(firstArticle);
      });
  });

  it('should handle non existent id with appropriate error', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .catch((e) => {
        console.log(e);
        expect(e.message).toEqual('resource not found');
      });
  });

  it('should handle incorrect id formatted as not number with appropriate error', () => {
    return request(app)
      .get('/api/articles/chocolatecake')
      .expect(400)
      .catch((e) => {
        console.log(e);
        expect(e).toEqual({
          message: 'bad request: article id must be an integer',
        });
      });
  });

  it('should handle incorrect id formatted as non-integer number with appropriate error', () => {
    return request(app)
      .get('/api/articles/3.2')
      .expect(400)
      .catch((e) => {
        expect(e).toEqual({
          message: 'bad request: article id must be an integer',
        });
      });
  });
});

describe('get api/articles', () => {
  it('should respond with a 200 status code', () => {
    return request(app).get('/api/articles').expect(200);
  });

  it('should return with an array on the response body', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('each element of the array should be an object with correct keys and no body key', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body.hasOwnProperty('body')).toBe(false);
        body.forEach((element) => {
          expect(element).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            comment_count: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  it('array should be sorted in descending order on article id', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        body.forEach((obj, index, arr) => {
          if (index !== arr.length - 1) {
            expect(body[index] <= body[index + 1]).toBe(true);
          }
        });
      });
  });

  it('comment counts should be calculated correctly', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articleOne = body.sort((a, b) => a.article_id - b.article_id)[0];
        const articleFive = body.sort((a, b) => a.article_id - b.article_id)[4];
        expect(articleOne.comment_count).toBe(11);
        expect(articleFive.comment_count).toBe(2);
      });
  });
});
