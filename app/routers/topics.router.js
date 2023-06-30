const {
  getTopicsController,
  postTopicController,
  badPathController,
} = require('../controllers');

const topicsRouter = require('express').Router();

topicsRouter.get('/', getTopicsController);
topicsRouter.post('/', postTopicController);
topicsRouter.all('*', badPathController);

module.exports = topicsRouter;
