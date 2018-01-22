'use strict';

/**
 * Module dependencies
 */
var templatesPolicy = require('../policies/templates.server.policy'),
  templateDatas = require('../controllers/template-datas.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/template-datas/:templateId/:listName/:upTemplateId')//all(templatesPolicy.isAllowed)
    .get(templateDatas.list)
    .post(templateDatas.create);

  app.route('/api/template-datas/:templateId/:listName/:upTemplateId/:templateDataId')//all(templatesPolicy.isAllowed)
    .get(templateDatas.read)
    .put(templateDatas.update)
    .delete(templateDatas.delete);

  // Finish by binding the Custom action middleware
  app.param('templateDataId', templateDatas.templateDataByID);
};
