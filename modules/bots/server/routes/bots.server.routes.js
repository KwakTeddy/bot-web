'use strict';

/**
 * Module dependencies.
 */
var botsPolicy = require('../policies/bots.server.policy'),
  bots = require('../controllers/bots.server.controller');

module.exports = function (app) {
  // Bots collection routes
  app.route('/api/bots')
    .get(bots.list)
    .post(bots.create);

  // Single bot routes
  // app.route('/api/bots/:botId').all(botsPolicy.isAllowed)
  app.route('/api/bots/:botId')
    .get(bots.read)
    .put(bots.update)
    .delete(bots.delete);

  app.route('/api/bots/files/:botId')
    .get(bots.listFile)
    .post(bots.createFile);

  app.route('/api/bots/files/:botId/:fileId')
    .get(bots.readFile)
    .post(bots.editFile)
    .delete(bots.removeFile)
    .put(bots.renameFile);


  // Finish by binding the bot middleware
  app.param('botId', bots.botByID);
  app.param('fileId', bots.fileByID);
};
