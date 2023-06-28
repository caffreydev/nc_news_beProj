const { getTopicsController } = require('./topics.controllers.js');
const { contentsController } = require('./api.controllers.js');
const {
  getArticleController,
  getAllArticlesController,
  postCommentController,
} = require('./articles.controllers.js');
const {
  badPathController,
  psqlErrorController,
  customErrorController,
  serverErrorController,
} = require('./errorhandlers.js');

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
};
