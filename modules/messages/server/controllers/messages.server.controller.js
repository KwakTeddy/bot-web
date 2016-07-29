'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  mysql = require('mysql'),
  dateformat = require('dateformat');

var mySqlPool = mysql.createPool({
  host: 'wefund.co.kr',//'localhost',
  port: '3306',
  user: 'root',
  password: 'Wefund4ever!',
  database: 'kakao_agent',
  connectionLimit: 20,
  waitForConnections: false
});

/**
 * Create a Custom action
 */
exports.create = function (req, res) {
  var message = new Message(req.body);
  message.user = req.user;

  message.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var message = req.message ? req.message.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  message.isCurrentUserOwner = req.user && message.user && message.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(message);
};

/**
 * Update a Custom action
 */
exports.update = function (req, res) {
  var message = req.message;

  message = _.extend(message, req.body);

  message.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function (req, res) {
  var message = req.message;

  message.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function (req, res) {
  Message.find().sort('-created').populate('user', 'displayName').exec(function (err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messages);
    }
  });
};

/**
 * Custom action middleware
 */
exports.messageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Message.findById(id).populate('user', 'displayName').exec(function (err, message) {
    if (err) {
      return next(err);
    } else if (!message) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.message = message;
    next();
  });
};

exports.sendKakao = function (req, res) {
  var phoneNum = req.body.phoneNum;
  var message = req.body.message;
  var now = now();

  mySqlPool.getConnection(function (err, connection) {
    var query = connection.query('INSERT INTO MZSENDTRAN (SN, SENDER_KEY, CHANNEL, PHONE_NUM, TMPL_CD, SND_MSG, REQ_DTM, TRAN_STS)' +
      'VALUES (' +
      '\'발송일련번호\',' +
      '\'발신프로필키\',' +
      '\'A\' ,' +
      '\'' + phoneNum + '\',' +
      '\'A001_01\',' +
      '\'' + message + '\',' +
      '\'' + dateformat(new Date(), 'YYYYmmmmddddhhMMss') + '\'' +
      '\'1\');'
      , function (err, rows) {
        if (err) {
          connection.release();
          throw err;
        }

        connection.release();
      });
    console.log(query);
  })
};
