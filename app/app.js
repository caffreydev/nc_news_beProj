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
} = require('./controllers');

app.get('/api/topics', getTopicsController);
app.get('/api', contentsController);
app.get('/api/articles/:article_id', getArticleController);
app.all('*', badPathController);

app.use(customErrorController);
app.use(psqlErrorController);
app.use(serverErrorController);

module.exports = app;
