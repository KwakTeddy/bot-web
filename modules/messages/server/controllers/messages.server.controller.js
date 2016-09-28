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
  fs = require('fs'),
  dateformat = require('dateformat');

var mySqlPool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'Make01mb!',
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

var sendKakaoSeq = 0;
exports.sendKakao = function (req, res) {
  console.log('sendKakao');
  var phoneNum = req.body.phoneNum;
  var message = req.body.message;
  sendKakaoSeq++;

  fs.readFile('/home/bot/nh2.txt', function (err, data) {
    if(err) {
      console.log(err.toString());
    } else {
      console.log('data: ' + data);
      message = data;

  mySqlPool.getConnection(function (err, connection) {
    console.log(err);
    var query = connection.query('INSERT INTO MZSENDTRAN (SN, SENDER_KEY, CHANNEL, PHONE_NUM, TMPL_CD, SND_MSG, REQ_DTM, TRAN_STS)' +
      'VALUES (' +
      '\'' + dateformat(new Date(), 'yyyymmddHHMMss') + '\',' +//'\'' + sendKakaoSeq + '\',' +
      '\'484a760f0ab588a483034d6d583f0ae8c2882829\',' +
      '\'A\',' +
      '\'' + phoneNum + '\',' +
      '\'code1\',' +
      '\'' + message + '\',' +
      '\'' + dateformat(new Date()+9*60*60, 'yyyymmddHHMMss') + '\',' +
      '\'1\');'
      , function (err, rows) {
        if (err) {
          connection.release();
          throw err;
        }

        connection.release();
      });
//    console.log(query);
  })

    }
  })

  res.end();
};


function sendSMS(task, context, callback) {
  console.log('sendSMS');
  var callbackPhone = task.callbackPhone;
  var phone = task.phone;
  var message = task.message;

  mySqlPool.getConnection(function (err, connection) {
    console.log(err);
    var query = 'INSERT INTO SDK_SMS_SEND ' +
      '( USER_ID, SUBJECT, SMS_MSG, CALLBACK_URL, NOW_DATE, SEND_DATE, CALLBACK,DEST_INFO,CDR_ID) VALUES ' +
      '("moneybrain1", "", "' + message + '", "" , "' + dateformat(new Date() + 9 * 60 * 60, 'yyyymmddHHMMss') + '", "' +
      dateformat(new Date() + 9 * 60 * 60, 'yyyymmddHHMMss') + '","' + callbackPhone + '","test^' + phone + '","");';

    connection.query(query
      , function (err, rows) {
        if (err) {
          connection.release();
          throw err;
        }

        connection.release();
        callback(task, context);
      });

    console.log(query);
  })

}

exports.sendSMS = sendSMS;

function sendVMS(task, context, callback) {
  console.log('sendVMS');
  var callbackPhone = task.callbackPhone;
  var phone = task.phone;
  var message = task.message;

  mySqlPool.getConnection(function (err, connection) {
    console.log(err);
        var query = 'INSERT INTO SDK_VMS_SEND ' +
      '(USER_ID, MSG_SUBTYPE, SCHEDULE_TYPE, DEST_TYPE, MENT_TYPE, VOICE_TYPE, ' +
      'SUBJECT, NOW_DATE,SEND_DATE,CALLBACK,REPLY_TYPE,REPLY_COUNT,COUNSELOR_DTMF, ' +
      'COUNSELOR_NUMBER, RELISTEN_COUNT,CDR_ID, TTS_MSG, DEST_COUNT, DEST_INFO) VALUES ' +
      '("moneybrain1", 30, 0, 0, 0, 0, 1, "' + dateformat(new Date() + 9 * 60 * 60, 'yyyymmddHHMMss') + '", ' +
      '"' + dateformat(new Date() + 9 * 60 * 60, 'yyyymmddHHMMss') + '", ' +
      '"' + callbackPhone + '", 0, 0, 9, "' + callbackPhone + '", 1, "", "' + message + '", 1, "test^"' + phone + ')';

    connection.query(query
      , function (err, rows) {
        if (err) {
          connection.release();
          throw err;
        }

        connection.release();
        callback(task, context);
      });

    console.log(query);
  })

}

exports.sendVMS = sendVMS;
