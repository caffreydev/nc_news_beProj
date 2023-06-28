const { getTopicsModel } = require('./topics.models');
const { contentsModel } = require('./api.models');
const {
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  postCommentModel,
} = require('./articles.models');

module.exports = {
  getTopicsModel,
  contentsModel,
  getArticleModel,
  getAllArticlesModel,
  getArticleCommentsModel,
  postCommentModel,
};
