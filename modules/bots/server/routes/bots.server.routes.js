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

  app.route('/api/bots/list')
    .post(bots.list)
    .get(bots.list);


  app.route('/api/bots/follow')
    .post(bots.followList)
    .put(bots.followBot)
    .delete(bots.unfollowBot);

  app.route('/api/bots/:botId')
    .get(bots.read)
    .put(bots.update)
    .delete(bots.delete);

  app.route('/api/graph/:botId')
    .put(bots.graph);

  app.route('/api/bots/files/:botId')
    .get(bots.listFile)
    .post(bots.createFile);

  app.route('/api/bots/files/:botId/:fileId')
    .get(bots.readFile)
    .post(bots.editFile)
    .delete(bots.removeFile)
    .put(bots.renameFile);


  app.route('/api/bots/byNameId/:botNameId')
    .get(bots.read);

  app.route('/api/follow')
    .post(bots.followList)
    .put(bots.followBot)
    .delete(bots.unfollowBot);

  app.route('/api/bots/image-files').post(bots.uploadImageFile);
  app.route('/api/bots/convert').post(bots.convertFile);

  app.route('/api/bots-comment/:botId')
    .get(bots.listComment)
    .post(bots.createComment);

  app.route('/api/bots-comment/:botId/:botCommentId')
    .get(bots.readComment)
    .put(bots.updateComment)
    .delete(bots.deleteComment);

  app.route('/api/bots-dialog/:dBotId')
    .get(bots.listDialog)
    .post(bots.createDialog);

  app.route('/api/bots-dialog/:dBotId/:botDialogId')
    .get(bots.readDialog)
    .put(bots.updateDialog)
    .delete(bots.deleteDialog);

  app.route('/api/bots-analytics/context')
    .get(bots.contextAnalytics);

  app.route('/api/bots-analytics/learning')
    .post(bots.contextLearning);

  app.route('/api/bots-analytics/nlp')
    .get(bots.nlp);

  app.route('/api/bots-analytics/auto-correction')
    .get(bots.autoCorrection);

  app.route('/api/speech/:msg')
    .get(bots.speech);

  app.route('/api/bot-exist')
    .get(bots.botExist);

  app.route('/api/nluprocess/:input')
    .get(bots.nluProcess);

  app.route("/api/bot-shared")
    .get(bots.sharedBotList);

  // Finish by binding the bot middleware
  app.param('botId', bots.botByID);
  app.param('botNameId', bots.botByNameID);
  app.param('fileId', bots.fileByID);
  app.param('botCommentId', bots.botCommentByID);
  app.param('botDialogId', bots.botDialogByID);

};
