const request = require('supertest');
require('jest-sorted');
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
      .then(({ body }) => {
        expect(body.message).toBe('invalid path');
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
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });

  it('each element of response array should be an object', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((obj) => {
          expect(typeof obj).toBe('object');
        });
      });
  });

  it('response array should have each of data values, in line with test data', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual(data.topicData);
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
      .then(({ body }) => {
        expect(typeof body.contents).toBe('string');
      });
  });

  it('should agree with the JSON object saved in endpointsList.json', () => {
    let appResponse;
    let fileResponse;
    const appCall = request(app)
      .get('/api')
      .then(({ body }) => {
        appResponse = body.contents;
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
        expect(body.article).toEqual(firstArticle);
      });
  });

  it('should handle non existent id with appropriate error', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('resource not found');
      });
  });

  it('should handle incorrect id formatted as not number with appropriate error', () => {
    return request(app)
      .get('/api/articles/chocolatecake')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request: article id must be an integer');
      });
  });

  it('should handle incorrect id formatted as non-integer number with appropriate error', () => {
    return request(app)
      .get('/api/articles/3.2')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request: article id must be an integer');
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
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });

  it('each element of the array should be an object with correct keys and no body key', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles.hasOwnProperty('body')).toBe(false);
        body.articles.forEach((element) => {
          expect(element.comment_count).not.toBeNaN();
          expect(element).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            comment_count: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  it('array should be sorted in descending order on creation date', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
      });
  });

  it('comment counts should be calculated correctly', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articleOne = body.articles.sort(
          (a, b) => a.article_id - b.article_id
        )[0];
        const articleFive = body.articles.sort(
          (a, b) => a.article_id - b.article_id
        )[4];
        expect(articleOne.comment_count).toBe('11');
        expect(articleFive.comment_count).toBe('2');
      });
  });
});

describe('get /api/articles/:article_id/comments', () => {
  it('should return 200 for a valid request', () => {
    return request(app).get('/api/articles/1/comments').expect(200);
  });

  it('should return with an array on comments key of response object for a valid request', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
      });
  });

  it('should return with an array of correct comment objects for a valid request', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);

        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
          });
        });
      });
  });

  it('should serve an empty array on articles without comments', () => {
    return request(app)
      .get('/api/articles/7/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  it('comments should be ordered with most recent first', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        expect(body.comments).toBeSortedBy('created_at', { descending: true });
      });
  });

  it('correct comments should be pulled through', () => {
    const expectedComments = [];
    return request(app)
      .get('/api/articles/6/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(1);
        expect(body.comments[0]).toMatchObject({
          comment_id: expect.any(Number),
          votes: 1,
          author: 'butter_bridge',
          article_id: 6,
          created_at: '2020-10-11T15:23:00.000Z',
        });
      });
  });

  it('invalid id formats should be rejected with a 400 and appropriate message', () => {
    return request(app)
      .get('/api/articles/financialtimes/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('Valid formatted but non-existent id should be rejected with a 404 and appropriate message', () => {
    return request(app)
      .get('/api/articles/9999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('no article with an id of 9999');
      });
  });
});

describe('post /api/articles:article_id/comments', () => {
  it('valid request should respond with a 201 status', () => {
    const commentObject = {
      username: 'lurker',
      body: 'this is a truly wonderful piece of journalism',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(commentObject)
      .expect(201);
  });

  it('valid request should respond with the posted comment, with an attached id', () => {
    const commentObject = {
      username: 'lurker',
      body: 'this is a truly wonderful piece of journalism',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(commentObject)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toMatchObject({
          comment_id: expect.any(Number),
          body: 'this is a truly wonderful piece of journalism',
          article_id: 1,
          author: 'lurker',
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  it('unecessary extra keys should be ignored', () => {
    const commentObject = {
      username: 'lurker',
      body: 'this is a truly wonderful piece of journalism',
      spare: 'this key is pointless',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(commentObject)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment.hasOwnProperty('spare')).toBe(false);
        expect(body.postedComment).toMatchObject({
          comment_id: expect.any(Number),
          body: 'this is a truly wonderful piece of journalism',
          article_id: 1,
          author: 'lurker',
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  it('requests that are made without a request object should receive a 400 status and useful comment', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          'post request must be accompanied by a comment object with valid username and body keys'
        );
      });
  });

  it('request for an article id that does not exist should trigger a 400 response and message bad request', () => {
    const commentObject = {
      username: 'lurker',
      body: 'this is a truly wonderful piece of journalism',
    };
    return request(app)
      .post('/api/articles/9999/comments')
      .expect(400)
      .send(commentObject)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('request with a user that does not exist should trigger a 400 response and message bad request', () => {
    const commentObject = {
      username: 'joeblogs',
      body: 'this is a truly wonderful piece of journalism',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .expect(400)
      .send(commentObject)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('request with an incomplete comment object should trigger a 400 response and useful error message', () => {
    const commentObject = {
      body: 'this is a truly wonderful piece of journalism',
    };
    return request(app)
      .post('/api/articles/2/comments')
      .expect(400)
      .send(commentObject)
      .then(({ body }) => {
        expect(body.message).toBe(
          'post request must be accompanied by a comment object with valid username and body keys'
        );
      });
  });
});
