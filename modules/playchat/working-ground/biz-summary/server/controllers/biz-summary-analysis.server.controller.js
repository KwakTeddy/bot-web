var mongoose = require('mongoose');

var mysql = require('mysql');
var UserDialogLog = mongoose.model('UserDialogLog');
var Scheduler = mongoose.model('Scheduler');

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
                ' AND b.number = s.sender AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +
                ') AND unix_timestamp(s.reqDate) between unix_timestamp(b.startTime) and unix_timestamp(b.endTime)';

            connection.query(query, function (err, rows) {
                connection.release();
                res.send({status:true, data:rows});
            });
        }
    })
};

module.exports.getresHumNumByBotId = function (req, res) {

    var startDate = new Date(req.params.startDate);
    var endDate = new Date(req.params.endDate);

    var query = [
        { $match: { botId: req.params.botId, channel: 'message', created: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$userId', count: { $sum: 1 }} }
    ];

    UserDialogLog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ result: list.length});
        }
    });
};

module.exports.getTotalHumNumByBotId = function (req, res) {

    var startDate = new Date(req.params.startDate);
    var endDate = new Date(req.params.endDate);

    var query = [
        { $match: { botId: req.params.botId, created: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, count: { $sum: '$totalReceiver'}} }
    ];

    Scheduler.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ result: list});
        }
    });
};

// module.exports.getLastSendDateByBotId = function (req, res) {
//     var botsStr = '';
//     botsStr = "'" + req.params.botId + "'";
//
//     var param = [];
//     param[0] = "'" + req.params.startDate + "'";
//     param[1] = "'" + req.params.endDate + "'";
//
//     mySqlPool.getConnection(function (err, connection) {
//         if (err) {
//             console.log(err);
//         } else {
//
//             var query = 'SELECT max(reqDate) as lastDate FROM BOT_REGISTER b, MSG_RESULT s WHERE b.botId = ' + botsStr +
//                 ' AND b.number = s.sender AND unix_timestamp(s.reqDate) between unix_timestamp((select min(startTime) from BOT_REGISTER b WHERE b.botId = ' + botsStr +
//                 ' AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +
//                 '))) and unix_timestamp((select max(endTime) from BOT_REGISTER b WHERE b.botId = ' + botsStr +
//                 ' AND unix_timestamp(b.startTime) between unix_timestamp(' + param[0] + ') and unix_timestamp(' + param[1] +')))';
//
//             connection.query(query, function (err, rows) {
//                 res.send({status:true, data:rows});
//             });
//         }
//     })
// };


