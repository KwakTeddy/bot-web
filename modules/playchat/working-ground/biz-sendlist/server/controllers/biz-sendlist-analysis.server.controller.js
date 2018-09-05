var path = require('path');
var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');
var bot_js = require(path.resolve('./engine2/bot.js'));
var mysql = require('mysql');
var Bot = mongoose.model('Bot');

var mySqlPool = mysql.createPool({
    // host: 'localhost',
    host: '172.31.20.219',
    port: '3306',
    user: 'root',
    password: 'Make01mb!',
    charset : 'utf8mb4',
    database: 'bizchat',
    connectionLimit: 20,
    waitForConnections: false
});

module.exports.UserSend = function (req, res) {

  var bots = [];
  var botsStr = '';
  Bot.find({ user: req.user._id }).exec(function(err, _bots) {
    for(var i = 0 ; i < _bots.length; i ++ ) {
      bots.push('"' + _bots[i].id + '"')
    }
    botsStr = bots.join(', ');

    mySqlPool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        callback(task, context);
      } else {

        // var bots = ['"survey_user10_1536025545075"', '"consult_user10_1536021940065"'];
        // var botsStr = bots.join(', ');
        var query = 'SELECT count(*) as total, count(FAIL_CD) as fail, s.SND_REQ_DTTM as regDate ' +
          'FROM BOT_REGISTER b, SND_MSG s WHERE b.botId IN (' + botsStr + ') ' +
          'AND s.SND_REQ_DTTM >= ? AND s.SND_REQ_DTTM <= ? ' +
          'AND b.number=s.SND_PHONE_NUM AND s.SND_REQ_DTTM >= b.startTime and s.SND_REQ_DTTM <= b.endTime ' +
          'ORDER BY s.SND_REQ_DTTM DESC;';

        console.log(query);

        var param = [
          "1900-01-01 00:00:00",
          "9999-12-31 12:00:00"
        ];

        console.log('parameters are', param);

            connection.query(query, param, function (err, rows) {
                console.log('rows: ' + JSON.stringify(rows[0].botId));

          for(var j = 0; j < rows.length; j++) {
            rows[j].username = req.user.username;
          }

          res.jsonp({list: rows});
        });

      }
    })
  });
};

<<<<<<< HEAD
module.exports.sendMsg = function (req, res) {

    mySqlPool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            callback(task, context);
        } else {
=======
module.exports.BotSend = function (req, res) {

  var bots = [];
  var botsStr = '';
  Bot.find({ user: req.user._id }).exec(function(err, _bots) {
    for(var i = 0 ; i < _bots.length; i ++ ) {
      bots.push('"' + _bots[i].id + '"')
    }
    botsStr = bots.join(', ');

    mySqlPool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        callback(task, context);
      } else {

        // var bots = ['"survey_user10_1536025545075"', '"consult_user10_1536021940065"'];
        // var botsStr = bots.join(', ');
        var query = 'SELECT botId, number, count(*) as total, count(FAIL_CD) as fail, startTime, endTime, s.SND_REQ_DTTM as regDate ' +
          'FROM BOT_REGISTER b, SND_MSG s WHERE b.botId IN (' + botsStr + ') ' +
          'AND s.SND_REQ_DTTM >= ? AND s.SND_REQ_DTTM <= ? ' +
          'AND b.number=s.SND_PHONE_NUM AND s.SND_REQ_DTTM >= b.startTime and s.SND_REQ_DTTM <= b.endTime ' +
          'GROUP BY botId ORDER BY s.SND_REQ_DTTM DESC;';
>>>>>>> bc0c2cfbe8c31e02edd9d9645f2e18db58bc6f38

        console.log(query);

        var param = [
          "1900-01-01 00:00:00",
          "9999-12-31 12:00:00"
        ];

<<<<<<< HEAD
            console.log('parameters are', param);
            connection.query(query, param, function (err, rows) {
                // console.log('rows: ' + JSON.stringify(rows));
                res.jsonp(rows);
            });
            console.log(query);
        };
    });
=======
        console.log('parameters are', param);

        connection.query(query, param, function (err, rows) {
          // console.log('rows: ' + JSON.stringify(rows));

          res.jsonp({list: rows});
        });

      }
    })
  });
>>>>>>> bc0c2cfbe8c31e02edd9d9645f2e18db58bc6f38
};


module.exports.BotOneSend = function (req, res) {
  mySqlPool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      callback(task, context);
    } else {

      // var bots = ['"survey_user10_1536025545075"', '"consult_user10_1536021940065"'];
      // var botsStr = bots.join(', ');

      var query = 'SELECT seq, number, count(*) as total, count(FAIL_CD) as fail, startTime, endTime, s.SND_REQ_DTTM as regDate ' +
        'FROM BOT_REGISTER b, SND_MSG s WHERE b.botId = ? ' +
        'AND s.SND_REQ_DTTM >= ? AND s.SND_REQ_DTTM <= ? ' +
        'AND b.number=s.SND_PHONE_NUM AND s.SND_REQ_DTTM >= b.startTime and s.SND_REQ_DTTM <= b.endTime ' +
        'GROUP BY b.seq ORDER BY s.SND_REQ_DTTM DESC;';

      console.log(query);

      var param = [
        req.query.botId,
        "1900-01-01 00:00:00",
        "9999-12-31 12:00:00"
      ];

      console.log('parameters are', param);

      connection.query(query, param, function (err, rows) {
        // console.log('rows: ' + JSON.stringify(rows));

        res.jsonp({list: rows});
      });

    }
  })


};

