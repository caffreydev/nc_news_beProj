const {
  getAllUsersController,
  badPathController,
  getUserController,
} = require('../controllers');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsersController);
usersRouter.get('/:username', getUserController);
usersRouter.all('*', badPathController);

module.exports = usersRouter;
