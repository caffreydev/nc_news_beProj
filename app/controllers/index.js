const { getTopicsController } = require('./topics.controllers.js');
const { contentsController } = require('./api.controllers.js');
const {
  getArticleController,
  getAllArticlesController,
  postCommentController,
  getArticleCommentsController,
} = require('./articles.controllers.js');
const {
  badPathController,
  psqlErrorController,
  customErrorController,
  serverErrorController,
} = require('./errorhandlers.js');

const { deleteCommentController } = require('./comments.controllers.js');

module.exports = {
  getTopicsController,
  contentsController,
  getArticleController,
  badPathController,
  psqlErrorController,
  customErrorController,
  serverErrorController,
  getAllArticlesController,
  postCommentController,
  getArticleCommentsController,
  deleteCommentController,
};
