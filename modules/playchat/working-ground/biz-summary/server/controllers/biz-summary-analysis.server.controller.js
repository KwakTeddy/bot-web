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


module.exports.getSendMsgsNumAndLastSendDateByBotId = function (req, res) {
    var botsStr = '';
    botsStr = "'" + req.params.botId + "'";

    var param = [];
    param[0] = "'" + req.params.startDate + "'";
    param[1] = "'" + req.params.endDate + "'";

    mySqlPool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
        } else {

            var query = 'SELECT COUNT(*) as total, max(reqDate) as lastDate FROM BOT_REGISTER b, MSG_RESULT s WHERE b.botId = ' + botsStr +
                ' AND b.number = s.sender AND unix_timestamp(s.reqDate) between unix_timestamp((select min(startTime) from BOT_REGISTER b WHERE b.botId = ' + botsStr +
                ' AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +
                '))) and unix_timestamp((select max(endTime) from BOT_REGISTER b WHERE b.botId = ' + botsStr +
                ' AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +')))';

            connection.query(query, function (err, rows) {
                res.send({status:true, data:rows});
            });
        }
    })
};

module.exports.getLastSendDateByBotId = function (req, res) {
    var botsStr = '';
    botsStr = "'" + req.params.botId + "'";

    var param = [];
    param[0] = "'" + req.params.startDate + "'";
    param[1] = "'" + req.params.endDate + "'";

    mySqlPool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
        } else {

            var query = 'SELECT max(reqDate) as lastDate FROM BOT_REGISTER b, MSG_RESULT s WHERE b.botId = ' + botsStr +
                ' AND b.number = s.sender AND unix_timestamp(s.reqDate) between unix_timestamp((select min(startTime) from BOT_REGISTER b WHERE b.botId = ' + botsStr +
                ' AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +
                '))) and unix_timestamp((select max(endTime) from BOT_REGISTER b WHERE b.botId = ' + botsStr +
                ' AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +')))';

            connection.query(query, function (err, rows) {
                res.send({status:true, data:rows});
            });
        }
    })
};


