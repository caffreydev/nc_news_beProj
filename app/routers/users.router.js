const { getAllUsersController, badPathController } = require('../controllers');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsersController);
usersRouter.all('*', badPathController);

module.exports = usersRouter;
