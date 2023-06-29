const { getTopicsController } = require('./topics.controllers.js');
const { contentsController } = require('./api.controllers.js');
const {
  getArticleController,
  getAllArticlesController,
  postCommentController,
  getArticleCommentsController,
  patchArticleVotesController,
} = require('./articles.controllers.js');
const {
  badPathController,
  psqlErrorController,
  customErrorController,
  serverErrorController,
} = require('./errorhandlers.js');
const { deleteCommentController } = require('./comments.controllers.js');
const { getAllUsersController } = require('./users.controllers.js');
const { landingPageController } = require('./landingPage.controller.js');

module.exports = {
  landingPageController,
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
  patchArticleVotesController,
  getAllUsersController,
};
