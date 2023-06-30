const {
  deleteCommentController,
  badPathController,
  patchCommentController,
} = require('../controllers');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteCommentController);
commentsRouter.patch('/:comment_id', patchCommentController);
commentsRouter.all('*', badPathController);

module.exports = commentsRouter;
