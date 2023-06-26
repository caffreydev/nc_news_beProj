const express = require('express');
const app = express();

const {
  getTopicsController,
  contentsController,
  getArticleController,
} = require('./controllers');

app.get('/api/topics', getTopicsController);
app.get('/api', contentsController);
app.get('/api/articles/:article_id', getArticleController);

module.exports = app;
