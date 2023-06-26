const express = require('express');
const app = express();

const { getTopicsController, contentsController } = require('./controllers');

app.get('/api/topics', getTopicsController);
app.get('/api', contentsController);

module.exports = app;
