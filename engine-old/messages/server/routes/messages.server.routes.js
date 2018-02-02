'use strict';

/**
 * Module dependencies
 */
var messages = require('../controllers/messages.server.controller');

module.exports = function(app) {
    // Custom actions Routes
    app.route('/api/messages')//all(messagesPolicy.isAllowed)
       .get(messages.list)
       .post(messages.create);

    app.route('/api/messages/:messageId')//all(messagesPolicy.isAllowed)
       .get(messages.read)
       .put(messages.update)
       .delete(messages.delete);

    app.route('/api/messages/talk/kakao')
       .post(messages.sendKakao);

    app.route('/api/messages/vms/send')
       .post(messages.sendVMSReq);

    app.route('/api/messages/sms/send')
       .post(messages.sendSMSReq);

    // Finish by binding the Custom action middleware
    app.param('messageId', messages.messageByID);
};
