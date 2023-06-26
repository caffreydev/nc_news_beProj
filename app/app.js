const express = require('express');
const app = express();

const { getTopicsController } = require('./controllers');

app.get('/api/topics', getTopicsController);

module.exports = app;
