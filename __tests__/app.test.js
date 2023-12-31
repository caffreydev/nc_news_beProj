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
  it('get /nonexistentpath should throw error and respond with invalid path', () => {
    return request(app)
      .get('/nonexistentpath')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('invalid path');
      });
  });

  it('articles router should handle invalid paths after the router route', () => {
    return request(app)
      .get('/api/articles/guardian/on/sunday')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('invalid path');
      });
  });

  it('comments router should handle invalid paths after the router route', () => {
    return request(app)
      .get('/api/comments/opinions/on/this/article')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('invalid path');
      });
  });

  it('users router should handle invalid paths after the router route', () => {
    return request(app)
      .get('/api/users/joe/the/opinionated/one')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('invalid path');
      });
  });

  it('topics router should handle invalid paths after the router route', () => {
    return request(app)
      .get('/api/articles/topics/from/experts')
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
        expect(typeof body).toBe('object');
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
    const firstArticle = { ...data.articleData[0], comment_count: '11' };
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
        expect(body.articles.length).toBe(10);
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
        expect(body.articles.length).toBe(10);
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
        expect(body.comments.length).toBe(10);

        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
            avatar_url: expect.any(String),
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
        expect(body.comments.length).toBe(10);
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
          avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
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

describe('feature pagination on get /api/articles/:article_id/comments', () => {
  it('should restrict responses to the limit queried', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=8')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(8);
      });
  });

  it('limit and page should work appropriately in combination', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=8&p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
      });
  });

  it('comment count should calculate appropriately', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=8&p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        expect(body.total_comments).toBe(11);
      });
  });

  it('comment count should calculate appropriately and an empty array be served on large page number', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=8&p=34')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
        expect(body.total_comments).toBe(11);
      });
  });

  it('non integer limit should throw a 400', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=8.2&p=2')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('non number limit should throw a 400', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=giveall&p=2')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('non integer p should throw a 400', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=5&p=2.2')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('non number p should throw a 400', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=3&p=1.2')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
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

describe('patch /api/articles:article_id', () => {
  it('should respond with a 200 on a valid request', () => {
    const newVote = { inc_votes: 10000 };
    return request(app).patch('/api/articles/4').send(newVote).expect(200);
  });

  it('should respond with updated article object and appropriately incremented votes', () => {
    const newVote = { inc_votes: 10000 };
    return request(app)
      .patch('/api/articles/4')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toMatchObject({
          author: 'rogersop',
          title: 'Student SUES Mitch!',
          article_id: 4,
          topic: 'mitch',
          created_at: expect.any(String),
          votes: 10000,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  it('should respond with a 400 and useful message if missing patch object', () => {
    return request(app)
      .patch('/api/articles/4')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          'patch request must be accompanied with an object with inc_votes key'
        );
      });
  });

  it('should respond with a 400 and useful message if incorrect patch object', () => {
    const newVote = { new_votes: 10000 };
    return request(app)
      .patch('/api/articles/4')
      .expect(400)
      .send(newVote)
      .then(({ body }) => {
        expect(body.message).toBe(
          'patch request must be accompanied with an object with inc_votes key'
        );
      });
  });

  it('should respond with a 400 and useful bad request message if article id is non existent', () => {
    const newVote = { inc_votes: 10000 };
    return request(app)
      .patch('/api/articles/9999')
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('no article with an id of 9999');
      });
  });

  it('should respond with a 400 and bad request message if article id is incorrectly formatted', () => {
    const newVote = { inc_votes: 10000 };
    return request(app)
      .patch('/api/articles/dailytelegraph')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('should respond with a 400 and bad request message if inc votes has invalid formatted value', () => {
    const newVote = { inc_votes: 'apples' };
    return request(app)
      .patch('/api/articles/dailytelegraph')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });
});

describe('delete /api/comments/:comment_id', () => {
  it('should respond with a 204 and no response for a valid id', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  it('specified comment should be removed from database as required', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(() => {
        return db.query('SELECT * FROM comments WHERE comment_id=2');
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  it('should serve a 404 and error message for a non existent but validly formatted id', () => {
    return request(app)
      .delete('/api/comments/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual('no comment with an id of 99999');
      });
  });

  it('should serve a 400 and bad request message for a badly formatted id', () => {
    return request(app)
      .delete('/api/comments/myopinion')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual('bad request');
      });
  });
});

describe('get /api/users', () => {
  it('should give a 200 for a request', () => {
    return request(app).get('/api/users').expect(200);
  });

  it('response body should have an array on a key of users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
      });
  });

  it('response array should be composed of objects of the right format', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
          expect(Object.keys(user).length).toBe(3);
        });
      });
  });

  it('response array should contain the test users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(data.userData);
      });
  });
});

describe('feature: queries on get /api/articles', () => {
  it('should return a 200 status code and mitch topic only articles if called correctly with topic query', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
      });
  });

  it('should return a 200 status code and butter_bridge authored only articles if called correctly with topic query', () => {
    return request(app)
      .get('/api/articles?author=butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(4);
        body.articles.forEach((article) => {
          expect(article.author).toBe('butter_bridge');
        });
      });
  });

  it('should respond appropriately when queried on author and topic', () => {
    return request(app)
      .get('/api/articles?author=butter_bridge&topic=mitch')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(4);
        body.articles.forEach((article) => {
          expect(article.author).toBe('butter_bridge');
        });
      });
  });

  it('should respond appropriately to 3 queries and succesfully sort by specified collumn', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sort_by=title&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        expect(body.articles).toBeSortedBy('title');
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
      });
  });

  it('should respond appropriately when sorted on comment count', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sort_by=comment_count&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        expect(body.articles).toBeSortedBy('comment_count');
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
      });
  });

  it('should respond appropriately with a 200 and empty array if queried with valid topic but no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });

  it('should respond appropriately with a 404 and message if queried with nonexistent collumn', () => {
    return request(app)
      .get('/api/articles?topic=chocolatecake')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('topic chocolatecake not found');
      });
  });

  it('should respond appropriately with a 400 and bad request if queried with invalid sort by', () => {
    return request(app)
      .get('/api/articles?sort_by=impressions')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('should respond appropriately with a 400 and bad request if queried with invalid sort order', () => {
    return request(app)
      .get('/api/articles?order=alphabetical')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });
});

describe('feature: pagination of /api/articles', () => {
  //note behaviour with defaults is tested in core feature test
  it('should limit responses to limit specified', () => {
    return request(app)
      .get('/api/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
      });
  });

  it('offset should function correctly', () => {
    return request(app)
      .get('/api/articles?limit=5&p=2&sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
        expect(body.articles[0].article_id).toBe(6);
      });
  });

  it('total_count should be calculated correctly', () => {
    return request(app)
      .get('/api/articles?limit=5&p=2&sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
        expect(body.articles[0].article_id).toBe(6);
        expect(body.total_count).toBe(13);
      });
  });

  it('total_count should be calculated correctly and an empty array served when a large page number is queried', () => {
    return request(app)
      .get('/api/articles?limit=5&p=15&sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
        expect(body.total_count).toBe(13);
      });
  });

  it('should throw a 400 if limit is specified as non integer', () => {
    return request(app)
      .get('/api/articles?limit=11.2&p=2&sort_by=article_id&order=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('should throw a 400 if limit is specified as non number', () => {
    return request(app)
      .get('/api/articles?limit=thesky&p=2&sort_by=article_id&order=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('should throw a 400 if page is specified as non integer', () => {
    return request(app)
      .get('/api/articles?limit=10&p=3.2&sort_by=article_id&order=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('should throw a 400 if page is specified as non number', () => {
    return request(app)
      .get('/api/articles?limit=10&p=pagetwo&sort_by=article_id&order=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });
});

describe('/api/users/:username', () => {
  it('should serve a 200 when given a valid username', () => {
    return request(app).get('/api/users/lurker').expect(200);
  });

  it('should serve a 200 and the users data with a valid username', () => {
    return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: 'butter_bridge',
          name: 'jonny',
          avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        });
      });
  });

  it('should serve a 404 and appropriate message when sending invalid username format', () => {
    return request(app)
      .get('/api/users/bobmarley')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('no user with username of bobmarley found');
      });
  });
});

describe('patch /api/comments/:comment_id', () => {
  it('should return a 200 for valid comment id and req body', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 100 })
      .expect(200);
  });

  it('should correctly increment the votes and return updated comment', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toEqual({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 116,
          author: 'butter_bridge',
          article_id: 9,
          created_at: '2020-04-06T12:17:00.000Z',
          comment_id: 1,
        });
      });
  });

  it('a request for a comment id with a correct format but that does not exist should return a 404', () => {
    return request(app)
      .patch('/api/comments/9999')
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('no comment with an id of 9999');
      });
  });

  it('a request for a comment id with an incorrect format should return a 400', () => {
    return request(app)
      .patch('/api/comments/abadcommentid')
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('a request sent with no request object should return a 400', () => {
    return request(app)
      .patch('/api/comments/1')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('a request sent with request object with wrong key should return a 400', () => {
    return request(app)
      .patch('/api/comments/1')
      .expect(400)
      .send({ new_votes: 100 })
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('a request sent with request object with correct key but wrong value type should return a 400', () => {
    return request(app)
      .patch('/api/comments/1')
      .expect(400)
      .send({ inc_votes: 'one hundred' })
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });
});

describe('post /api/articles', () => {
  it('expect 201 and the posted object when a valid request body sent', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'lurker',
        title: 'the merits of express routers',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
        topic: 'paper',
        article_img_url:
          'https://i1.sndcdn.com/artworks-000249842344-7waeeo-t500x500.jpg',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.newArticle).toMatchObject({
          author: 'lurker',
          title: 'the merits of express routers',
          body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
          topic: 'paper',
          article_img_url:
            'https://i1.sndcdn.com/artworks-000249842344-7waeeo-t500x500.jpg',
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
          article_id: expect.any(Number),
        });
      });
  });

  it('expect default url to be used when a valid request body sent without specifying article_img_url', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'lurker',
        title: 'the merits of express routers',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
        topic: 'paper',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.newArticle).toMatchObject({
          author: 'lurker',
          title: 'the merits of express routers',
          body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
          topic: 'paper',
          article_img_url:
            'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
          article_id: expect.any(Number),
        });
      });
  });

  it('request send without a request body should throw 400 and bad request', () => {
    return request(app)
      .post('/api/articles')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('object missing the required author key should throw a 400', () => {
    return request(app)
      .post('/api/articles')
      .send({
        title: 'the merits of express routers',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
        topic: 'paper',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('object missing the required title key should throw a 400', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'lurker',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
        topic: 'paper',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('object missing the required body key should throw a 400', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'lurker',
        title: 'the merits of express routers',
        topic: 'paper',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('object missing a required topic key should throw a 400', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'lurker',
        title: 'the merits of express routers',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('object with an invalid topic key should throw a 400', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'lurker',
        title: 'the merits of express routers',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
        topic: 'node express',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });

  it('object with an invalid author key should throw a 400', () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: 'joe',
        title: 'the merits of express routers',
        body: 'app code getting too cluttered? Put it all in routers and clean your code base up.',
        topic: 'paper',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });
});

describe('post /api/topics', () => {
  it('should respond with 201 and posted topic when a valid request body', () => {
    return request(app)
      .post('/api/topics')
      .send({
        slug: 'musings',
        description: 'irreverent musings of an artistic mind',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.newTopic).toEqual({
          slug: 'musings',
          description: 'irreverent musings of an artistic mind',
        });
      });
  });

  it('should return a 400 if sent without a request body', () => {
    return request(app)
      .post('/api/topics')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual('bad request');
      });
  });

  it('should respond with 400 if sent a response body without a slug key', () => {
    return request(app)
      .post('/api/topics')
      .send({
        description: 'irreverent musings of an artistic mind',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual('bad request');
      });
  });

  it('should respond with 400 if sent a response body without a description key', () => {
    return request(app)
      .post('/api/topics')
      .send({
        slug: 'musings',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual('bad request');
      });
  });

  it('should respond with 400 if slug duplicates an existing topic', () => {
    return request(app)
      .post('/api/topics')
      .send({
        slug: 'paper',
        description: 'very useful to write on',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual('bad request');
      });
  });
});

describe('delete /api/articles/:article_id', () => {
  it('should delete article and return a 204 if a valid article id', () => {
    return request(app)
      .delete('/api/articles/1')
      .expect(204)
      .then(() => {
        return db.query('SELECT * FROM articles WHERE article_id=1');
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  it('delete should cascade through to comments', () => {
    return request(app)
      .delete('/api/articles/1')
      .expect(204)
      .then(() => {
        return db.query('SELECT * FROM comments WHERE article_id=1');
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });

  it('a 404 should be thrown for an article id that is valid format but does not exist', () => {
    return request(app)
      .delete('/api/articles/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('no article with an id of 9999');
      });
  });

  it('a 400 should be thrown for an article id with an invalid format', () => {
    return request(app)
      .delete('/api/articles/ubuntufordummies')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('bad request');
      });
  });
});
