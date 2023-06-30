const express = require('express');
const app = express();

const {
  landingPageController,
  contentsController,
  badPathController,
  psqlErrorController,
  customErrorController,
  serverErrorController,
} = require('./controllers');

const {
  articleRouter,
  commentsRouter,
  usersRouter,
  topicsRouter,
} = require('./routers');

app.use(express.json());

app.use('/api/articles', articleRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/topics', topicsRouter);

app.get('/', landingPageController);
app.get('/api', contentsController);
app.all('*', badPathController);

app.use(customErrorController);
app.use(psqlErrorController);
app.use(serverErrorController);

module.exports = app;
