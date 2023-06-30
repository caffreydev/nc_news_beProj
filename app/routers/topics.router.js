const { getTopicsController, badPathController } = require('../controllers');

const topicsRouter = require('express').Router();

topicsRouter.get('/', getTopicsController);
topicsRouter.all('*', badPathController);

module.exports = topicsRouter;
