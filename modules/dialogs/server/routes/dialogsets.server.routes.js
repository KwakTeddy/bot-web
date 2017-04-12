'use strict';

/**
 * Module dependencies
 */
var dialogsetsPolicy = require('../policies/dialogsets.server.policy'),
  dialogsets = require('../controllers/dialogsets.server.controller'),
  dialogsetDialogs = require('../controllers/dialogsetDialogs.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/dialogsets')//.all(dialogsetsPolicy.isAllowed)
    .get(dialogsets.list)
    .post(dialogsets.create);

  app.route('/api/dialogsets/:dialogsetId')//.all(dialogsetsPolicy.isAllowed)
    .get(dialogsets.read)
    .put(dialogsets.update)
    .delete(dialogsets.delete);

  app.route('/api/dialogsets/uploadfile').post(dialogsets.uploadFile);
  app.route('/api/dialogsets/convert').post(dialogsets.convertFile);

  app.route('/api/dialogsets/:dialogsetId/dialogs')//.all(dialogsetsPolicy.isAllowed)
    .get(dialogsetDialogs.list)
    .post(dialogsetDialogs.create);

  app.route('/api/dialogsets/:dialogsetId/dialogs/:dialogsetDialogId')//.all(dialogsetsPolicy.isAllowed)
    .get(dialogsetDialogs.read)
    .put(dialogsetDialogs.update)
    .delete(dialogsetDialogs.delete);

  app.route('/api/conceptlist')
    .get(dialogsetDialogs.concepts);

  app.route('/api/lgfaq')
    .get(dialogsetDialogs.lgfaq);

  // Finish by binding the Custom action middleware
  app.param('dialogsetId', dialogsets.dialogsetByID);
  app.param('dialogsetDialogId', dialogsetDialogs.dialogsetDialogByID);
};
