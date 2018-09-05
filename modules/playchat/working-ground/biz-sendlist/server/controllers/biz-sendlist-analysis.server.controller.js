var path = require('path');
var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');
var bot_js = require(path.resolve('./engine2/bot.js'));
var mysql = require('mysql');


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


module.exports.botRegister = function (req, res) {

    mySqlPool.getConnection(function (err, connection) {
        if(err) {
            console.log(err);
            callback(task, context);
        } else {

            var query = 'select * from BOT_REGISTER where botId = ? and startTime >= ? and endTime <= ?;';

            var param = [
                req.params.botId,
                new Date(req.query.startDate),
                new Date(req.query.endDate)
                ];

            console.log('parameters are', param);

            connection.query(query, param, function (err, rows) {
                // console.log('rows: ' + JSON.stringify(rows));

                res.jsonp(rows);
            });

            console.log(query);
        };
    });
};


            module.exports.sendMsg = function (req, res) {

                mySqlPool.getConnection(function (err, connection) {
                    if(err) {
                        console.log(err);
                        callback(task, context);
                    } else {

            var query = 'select * from SND_MSG where SND_PHONE_NUM= ? and SND_REQ_DTTM >= ? and SND_REQ_DTTM <= ?;';

            var param = [
                req.params.phoneNumber,
                new Date(req.query.startDate),
                new Date(req.query.endDate)
            ];

            console.log('parameters are', param);

            connection.query(query, param, function (err, rows) {
                // console.log('rows: ' + JSON.stringify(rows));

                res.jsonp(rows);
            });

            console.log(query);
        };
    });
};



//
// module.exports.sendMsg = function (req, res) {
//
//     mySqlPool.getConnection(function (err, connection) {
//         if(err) {
//             console.log(err);
//             callback(task, context);
//         } else {
//             var query = 'SELECT * from SND_MSG where FAIL_CD is not null';
//             connection.query(query, function (err, rows) {
//                 res.json(rows);
//             });
//
//             console.log(query);
//         }
//     });
// };






// module.exports.failedSend = function (req, res) {
//
//     mySqlPool.getConnection(function (err, connection) {
//         if (err) {
//             console.log(err);
//             callback(task, context);
//         } else {
//             var query = 'SELECT * from SND_MSG;';
//             connection.query(query, function (err, rows) {
//                 res.json(rows);
//             })
//             console.log(query);
//         }
//     });
// };


// module.exports.totalDialogCount = function(req, res)  {
//     UserDialog.count({ botId: req.params.botId , inOut: true}).exec(function (err, count) {
//         if (err) {
//             return res.status(400).send({ message: err.stack || err });
//         } else {
//             res.jsonp({ count: count });
//         }
//     });
// };
//
// module.exports.periodDialogCount = function(req, res) {
//     UserDialog.count({ botId: req.params.botId, inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } }).exec(function (err, count) {
//         if (err) {
//             return res.status(400).send({ message: err.stack || err });
//         } else {
//             res.jsonp({ count: count });
//         }
//     });
// };
//
// module.exports.totalUserCount = function (req, res) {
//     var query = [
//         { $match: { botId: req.params.botId, inOut: true } },
//         // { $project:
//         //     {
//         //         _id: 0,
//         //         userId: 1,
//         //         fail: {$cond:[{$eq: ["$isFail", true]}, 1,0]},
//         //         kakao: {$cond:[{$eq: ["$channel.name", "kakao"]}, 1,0]},
//         //         facebook: {$cond:[{$eq: ["$channel.name", "facebook"]}, 1,0]},
//         //         navertalk: {$cond:[{$eq: ["$channel.name", "navertalk"]}, 1,0]},
//         //         socket: {$cond:[{$eq: ["$channel.name", "socket"]}, 1,0]}
//         //     }
//         // },
//         { $group:
//                 {
//                     _id: { userId: '$userId'},
//                     channel: {$first: '$channel'}
//                 }
//         }
//         // { $group:
//         //         {
//         //             _id: { userId: '$userId', channel: '$channel.name' },
//         //             total: {$sum: 1},
//         //             fail: {$sum: "$fail"},
//         //             kakao: {$sum: "$kakao"},
//         //             facebook: {$sum: "$facebook"},
//         //             navertalk: {$sum: "$navertalk"},
//         //             socket: {$sum: '$socket'}
//         //         }
//         // }
//     ];
//
//     UserDialog.aggregate(query).exec(function(err, list)
//     {
//         if(err)
//         {
//             return res.status(400).send({ message: err.stack || err });
//         }
//         else
//         {
//             res.jsonp({ list: list });
//         }
//     });
// };
//

//
// module.exports.periodUserCount = function(req, res) {
//     var query = [
//         { $match:
//                 {
//                     botId: req.params.botId,
//                     inOut: true,
//                     created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
//                 }
//         },
//         { $group: { _id: '$userId', count: { $sum: 1 }} }
//     ];
//
//     UserDialog.aggregate(query).exec(function(err, list)
//     {
//         if(err)
//         {
//             return res.status(400).send({ message: err.stack || err });
//         }
//         else
//         {
//             res.jsonp({ count: list.length });
//         }
//     });
// };
//
// module.exports.dailyDialogUsage = function (req, res)
// {
//     var query = [
//         { $match: { botId: req.params.botId, inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } } },
//         { $project:
//                 {
//                     _id: 0,
//                     created: {$add:["$created", 9*60*60*1000]},
//                     fail: {$cond:[{$eq: ["$isFail", true]}, 1,0]},
//                     kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
//                     facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
//                     navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]},
//                     socket: {$cond:[{$eq: ["$channel", "socket"]}, 1,0]}
//                 }
//         },
//         { $group:
//                 {
//                     _id: {year: { $year: "$created" }, month: { $month: "$created" }, day: { $dayOfMonth: "$created" }},
//                     total: {$sum: 1},
//                     fail: {$sum: "$fail"},
//                     kakao: {$sum: "$kakao"},
//                     facebook: {$sum: "$facebook"},
//                     navertalk: {$sum: "$navertalk"},
//                     socket: {$sum: '$socket'}
//                 }
//         },
//         { $sort: {_id:-1,  day: -1} }
//     ];
//
//     UserDialog.aggregate(query).exec(function (err, dailyDialog)
//     {
//         if (err)
//         {
//             return res.status(400).send({ message: err.stack || err });
//         }
//         else
//         {
//             res.jsonp(dailyDialog);
//         }
//     });
// };
//
// exports.userInputStatistics = function (req, res)
// {
//     var query = [
//         { $match:
//                 {
//                     inOut: true,
//                     dialog: { $nin: [null, ':reset user', ':build'] },
//                     botId: req.params.botId,
//                     created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
//                 }
//         },
//         { $group: { _id: { dialog:'$dialog'}, count: { $sum: 1 } } },
//         { $sort: { count: -1 } }
//     ];
//
//     if(req.query.limit)
//         query.push({ $limit: parseInt(req.query.limit) });
//
//     UserDialog.aggregate(query).exec(function (err, list)
//     {
//         if (err)
//         {
//             return res.status(400).send({ message: err.stack || err });
//         }
//         else
//         {
//             res.jsonp(list);
//         }
//     });
// };
//
// exports.failDailogs = function (req, res)
// {
//     var query = [
//         { $match:
//                 {
//                     botId: req.params.botId,
//                     dialog: { $nin: [null,":reset user", ":build " + req.params.botId + " reset", ':build'] },
//                     inOut: true,
//                     isFail: true,
//                     created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) },
//                     "channel" : { $ne: 'channel' }
//
//                 }
//         },
//         { $group: { _id: { dialog: "$dialog" }, count: { $sum: 1 } } },
//         { $sort: {count: -1} }
//     ];
//
//     if(req.query.limit)
//     {
//         query.push({ $limit: parseInt(req.query.limit) });
//     }
//
//     UserDialog.aggregate(query).exec(function (err, list)
//     {
//         if (err)
//         {
//             return res.status(400).send({ message: err.stack || err });
//         }
//         else
//         {
//             res.jsonp(list);
//         }
//     });
// };
//
// exports.scenarioUsage = function (req, res)
// {
//     var query = [
//         { $match:
//                 {
//                     botId: req.params.botId,
//                     inOut: true,
//                     dialogType: 'dialog',
//                     dialogName: { $nin: [null, "답변없음"] },
//                     created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
//                 }
//         },
//         {$project:
//                 {
//                     _id: 0,
//                     channel: 1,
//                     dialogName:1,
//                     kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
//                     facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
//                     navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]},
//                     socket: {$cond:[{$eq: ["$channel", "socket"]}, 1,0]}
//                 }
//         },
//         {$group:
//                 {
//                     _id: {dialogName: '$dialogName'},
//                     total: {$sum: 1},
//                     kakao: {$sum: "$kakao"},
//                     facebook: {$sum: "$facebook"},
//                     navertalk: {$sum: "$navertalk"},
//                     socket: {$sum: '$socket'}
//                 }
//         },
//         {$sort: {total: -1}}
//     ];
//
//     if(req.query.limit)
//     {
//         query.push({ $limit: parseInt(req.query.limit) });
//     }
//
//     UserDialog.aggregate(query).exec(function (err, scenarioUsage)
//     {
//         if (err)
//         {
//             return res.status(400).send({ message: err.stack || err });
//         }
//         else
//         {
//             var result = {};
//             bot_js.load(req.params.botId, function () {
//                 result["scenarioUsage"] = scenarioUsage;
//                 result["botScenario"] = bot_js.bots[req.params.botId].dialogs;
//                 res.jsonp(result);
//             });
//         }
//     });
// };
