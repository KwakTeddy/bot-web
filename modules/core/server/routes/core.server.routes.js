'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/api/core/files/:filename').post(core.uploadFile);
  app.route('/api/core/convert').post(core.convertFile);

  // Define application route
  app.route('/*').get(core.renderIndex);

};
