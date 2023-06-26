const { getTopicsController } = require('./topics.controllers.js');
const { contentsController } = require('./api.controllers.js');
const { getArticleController } = require('./articles.controllers.js');

module.exports = {
  getTopicsController,
  contentsController,
  getArticleController,
};
