var path = require('path');
var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');
var bot_js = require(path.resolve('./engine2/bot.js'));
var mysql = require('mysql');
var Bot = mongoose.model('Bot');

var mySqlPool = mysql.createPool({
    // host: 'localhost',
    host: '52.79.225.156',
    port: '3306',
    user: 'root',
    password: 'Make01mb!',
    charset : 'utf8mb4',
    database: 'bizchat',
    connectionLimit: 20,
    waitForConnections: false
});


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
        // req.query.botId,

        'survey_user14_1535961027830',
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

