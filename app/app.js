const express = require('express');
const app = express();

const {
  badPathController,
  psqlErrorController,
  customErrorController,
  serverErrorController,
  getTopicsController,
  contentsController,
  getArticleController,
  getAllArticlesController,
  getArticleCommentsController,
  patchArticleVotesController,
  postCommentController,
  deleteCommentController,
  getAllUsersController,
} = require('./controllers');

app.use(express.json());

app.get('/api/topics', getTopicsController);
app.get('/api', contentsController);
app.get('/api/articles/:article_id', getArticleController);
app.get('/api/articles', getAllArticlesController);
app.get('/api/articles/:article_id/comments', getArticleCommentsController);
app.patch('/api/articles/:article_id', patchArticleVotesController);
app.post('/api/articles/:article_id/comments', postCommentController);
app.delete('/api/comments/:comment_id', deleteCommentController);
app.get('/api/users', getAllUsersController);
app.all('*', badPathController);

app.use(customErrorController);
app.use(psqlErrorController);
app.use(serverErrorController);

module.exports = app;
