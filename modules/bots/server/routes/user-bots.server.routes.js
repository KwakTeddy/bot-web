'use strict';

/**
 * Module dependencies.
 */
var userBotsPolicy = require('../policies/user-bots.server.policy'),
  userBots = require('../controllers/user-bots.server.controller');

module.exports = function (app) {
  // UserBots collection routes
  app.route('/api/user-bots')
    .get(userBots.list)
    .post(userBots.create);

  app.route('/api/user-bots/list')
    .post(userBots.list);

  app.route('/api/user-bots/follow')
    .post(userBots.followList)
    .put(userBots.followBot)
    .delete(userBots.unfollowBot);

  // Single userBot routes
  // app.route('/api/user-bots/:userBotId').all(userBotsPolicy.isAllowed)
  app.route('/api/user-bots/:userBotId')
    .get(userBots.read)
    .put(userBots.update)
    .delete(userBots.delete);

  app.route('/api/user-bots/byNameId/:botNameId')
    .get(userBots.read);

  app.route('/api/user-bots/files/:userBotId')
    .get(userBots.listFile)
    .post(userBots.createFile);

  app.route('/api/user-bots/files/:userBotId/:userBotFileId')
    .get(userBots.readFile)
    .post(userBots.editFile)
    .delete(userBots.removeFile)
    .put(userBots.renameFile);

  app.route('/api/user-bots/dataset-files').post(userBots.uploadFile);
  app.route('/api/user-bots/image-files').post(userBots.uploadImageFile);
  app.route('/api/user-bots/convert').post(userBots.convertFile);


  app.route('/api/user-bots-comment/:userBotId')
    .get(userBots.listComment)
    .post(userBots.createComment);

  app.route('/api/user-bots-comment/:userBotId/:userBotCommentId')
    .get(userBots.readComment)
    .put(userBots.updateComment)
    .delete(userBots.deleteComment);

  app.route('/api/user-bots-dialog/:dBotId')
    .get(userBots.listDialog)
    .post(userBots.createDialog);

  app.route('/api/user-bots-dialog/:dBotId/:userBotDialogId')
    .get(userBots.readDialog)
    .put(userBots.updateDialog)
    .delete(userBots.deleteDialog);

  app.route('/api/user-bots-analytics/context')
    .get(userBots.contextAnalytics);

  app.route('/api/user-bots-analytics/learning')
    .post(userBots.contextLearning);

  app.route('/api/user-bots-analytics/nlp')
    .get(userBots.nlp);

  app.route('/api/user-bots-analytics/auto-correction')
    .get(userBots.autoCorrection);

  // Finish by binding the userBot middleware
  app.param('userBotId', userBots.userBotByID);
  app.param('botNameId', userBots.userBotByNameID);
  app.param('userBotFileId', userBots.fileByID);
  app.param('userBotCommentId', userBots.userBotCommentByID);
  app.param('userBotDialogId', userBots.userBotDialogByID);

};
