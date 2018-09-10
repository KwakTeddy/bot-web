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

                console.log('req.body.param: ' + JSON.stringify(req.query));
                param[0] = req.query.startDateTime;
                param[1] = req.query.endDateTime;


                console.log('parameters are', param);

                connection.query(query, param, function (err, rows) {
                    // console.log('rows: ' + JSON.stringify(rows));

                    for(var j = 0; j < rows.length; j++) {
                        rows[j].username = req.user.username;
                    }
                    connection.release();

                    res.jsonp({list: rows});
                });

            }
        })
    });
};

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
                // callback(task, context);
            } else {

                // var bots = ['"survey_user10_1536025545075"', '"consult_user10_1536021940065"'];
                // var botsStr = bots.join(', ');
                var query = 'SELECT botId, number, count(*) as total, count(FAIL_CD) as fail, startTime, endTime, s.SND_REQ_DTTM as regDate ' +
                    'FROM BOT_REGISTER b, SND_MSG s WHERE b.botId IN (' + botsStr + ') ' +
                    'AND s.SND_REQ_DTTM >= ? AND s.SND_REQ_DTTM <= ? ' +
                    'AND b.number=s.SND_PHONE_NUM AND s.SND_REQ_DTTM >= b.startTime and s.SND_REQ_DTTM <= b.endTime ' +
                    'GROUP BY botId ORDER BY s.SND_REQ_DTTM DESC;';

                console.log(query);

                var param = [
                    "1900-01-01 00:00:00",
                    "9999-12-31 12:00:00"
                ];

                console.log('req.body.param: ' + JSON.stringify(req.query));
                param[0] = req.query.startDateTime;
                param[1] = req.query.endDateTime;

                connection.query(query, param, function (err, rows) {
                    // console.log('rows: ' + JSON.stringify(rows));
                    connection.release();
                    res.jsonp({list: rows});
                });

            }
        })
    });
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

            connection.query(query, param, function (err, rows) {
                // console.log('rows: ' + JSON.stringify(rows));
                connection.release();
                res.jsonp({list: rows});
            });

        }
    })


};

