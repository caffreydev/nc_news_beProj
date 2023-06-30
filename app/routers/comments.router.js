const {
  deleteCommentController,
  badPathController,
} = require('../controllers');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteCommentController);
commentsRouter.all('*', badPathController);

module.exports = commentsRouter;
