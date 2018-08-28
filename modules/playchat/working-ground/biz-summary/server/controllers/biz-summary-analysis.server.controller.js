var path = require('path');
var mongoose = require('mongoose');

var UserDialog = mongoose.model('UserDialog');
var bot_js = require(path.resolve('./engine2/bot.js'));
var request = require('request');
// var mysql = require('mysql');
//
// var pool = mysql.createPool({
//     // connectionLimit : 15,
//     host: "52.79.198.53",
//     port: '3306',
//     user: "root",
//     password: "Make01mb!",
//     database: "bizchat"
// });
//
// var trigger = function(insertId, imageName, imagePath, CRT_USER_ID, PARTI_MONTH){
//     var now = new Date();
//     if(imageName && imagePath){
//         pool.getConnection(function(err, conn){
//             var mmsQuery = "INSERT INTO SND_ATTFILE (MSG_SEQ, ATTFILE_SEQ, ATT_FILE_NM, FILE_PATH, CRT_USER_ID, PARTI_MONTH) VALUES ('" + insertId + "', '1', '" + imageName + "', '" + imagePath + imageName + "', '" + CRT_USER_ID + "', '" + PARTI_MONTH + "')";
//             if(!err){
//                 conn.query(mmsQuery, function(err, result, fields)
//                 {
//                     if(err) console.error('MMS data input error : ', err);
//
//                     con.release();
//                     console.log('MMS data input in ', (new Date().getTime() - now.getTime()) + 'ms');
//                 });
//             }
//         });
//     }
// };



// var db = new Promise(function(resolve, reject){
//     ssh.on('ready', function() {
//         ssh.forwardOut(
//             // source address, this can usually be any valid address
//             '127.0.0.1',
//             // source port, this can be any valid port number
//             12345,
//             // destination address (localhost here refers to the SSH server)
//             '127.0.0.1',
//             // destination port
//             3306,
//             function (err, stream) {
//                 if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
//                 // use `sql` connection as usual
//                 var connection = mysql.createConnection({
//                     host     : 'localhost',
//                     user     : 'root',
//                     password : 'Make01mb!',
//                     database : 'bizchat',
//                     // stream: stream
//                 });
//
//                 // send connection back in variable depending on success or not
//                 connection.connect(function(err){
//                     if (err) {
//                         resolve(connection);
//                     } else {
//                         reject(err);
//                     }
//                 });
//             });
//     }).connect({
//         host: '52.79.198.53',
//         // port: 22,
//         username: 'root',
//         password: 'Make01mb!'
//     },function(req,res){
//         if(!err){
//             console.log('Succ: Mysql!');
//             // conn.query(query, function (err, results) {
//             //     res.jsonp(results);
//             //
//             // })
//         }
//         else{
//             console.log('Error: Mysql!');
//         }
//     });
// });


module.exports.getSendMsgsByBotId = function (req, res) {
    request.post(
        'https://bitchats.moneybrain.ai/BizPlaychat/sendMsg',
        {json: {req: "02-858-5683", message: 'req.body.message'}},
        function (error, response, body) {
            console.log('res.status： ' + res.statusCode );
        }
    );
    res.end();
    // var mysql = require('mysql');
    //
    //
    // var db = orm.connect({
    // host: 'seo',
    //     protocol: 'mysql',
    //     port: '3306',
    //     pool: true,
    //     user: "root",
    //     password: "Make01mb!",
    //     database: "bizchat"})

    // var pool = mysql.createPool({
    //     connectionLimit: 15,
    //     host: "52.79.198.53",
    //     user: "root",
    //     password: "Make01mb!",
    //     database: "bizchat"
    // });
    //
    // pool.getConnection(function(err, conn){
    //     // var mmsQuery = "INSERT INTO SND_ATTFILE (MSG_SEQ, ATTFILE_SEQ, ATT_FILE_NM, FILE_PATH, CRT_USER_ID, PARTI_MONTH) VALUES ('" + insertId + "', '1', '" + imageName + "', '" + imagePath + imageName + "', '" + CRT_USER_ID + "', '" + PARTI_MONTH + "')";
    //     console.log('err: ' + JSON.stringify(err));
    //     console.log('conn: ' + conn);
    //
    //     if(!err){
    //         console.log('Success');
    //         // conn.query(mmsQuery, function(err, result, fields)
    //         // {
    //         //     if(err) console.error('MMS data input error : ', err);
    //         //
    //         //     con.release();
    //         //     console.log('MMS data input in ', (new Date().getTime() - now.getTime()) + 'ms');
    //         // });
    //     }
    //     else{
    //         console.log('Error');
    //     }
    // });

};

module.exports.totalDialogCount = function(req, res)
{
    UserDialog.count({ botId: req.params.botId , inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }}).exec(function (err, count)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ count: count });
        }
    });
};

module.exports.lastSendMsgDate = function(req, res)
{
    UserDialog.find({ botId: req.params.botId , inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }}).sort({created: -1}).exec(function (err, date)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            if(date[0]){
                res.jsonp({lastDate: date[0].created});
            }
            else{
                res.jsonp({lastDate: ""});
            }
        }
    });
};

module.exports.TotalDialogByPeriod = function(req, res)
{
    UserDialog.find({ botId: req.params.botId , inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }}).sort({created: -1}).exec(function (err, result)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
                res.jsonp(result);
        }
    });
};

module.exports.totalSuccDialogCount = function(req, res)
{
    UserDialog.count({ botId: req.params.botId , inOut: true, isFail: false, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }}).exec(function (err, count)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ count: count });
        }
    });
};


module.exports.periodDialogCount = function(req, res)
{
    UserDialog.find({ botId: req.params.botId, inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } }).exec(function (err, count)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ count: count });
        }
    });
};

module.exports.totalUserCount = function (req, res)
{
    var query = [
        { $match: { botId: req.params.botId, inOut: true } },
        // { $project:
        //     {
        //         _id: 0,
        //         userId: 1,
        //         fail: {$cond:[{$eq: ["$isFail", true]}, 1,0]},
        //         kakao: {$cond:[{$eq: ["$channel.name", "kakao"]}, 1,0]},
        //         facebook: {$cond:[{$eq: ["$channel.name", "facebook"]}, 1,0]},
        //         navertalk: {$cond:[{$eq: ["$channel.name", "navertalk"]}, 1,0]},
        //         socket: {$cond:[{$eq: ["$channel.name", "socket"]}, 1,0]}
        //     }
        // },
        { $group:
            {
                _id: { userId: '$userId'},
                channel: {$first: '$channel'}
            }
        }
        // { $group:
        //         {
        //             _id: { userId: '$userId', channel: '$channel.name' },
        //             total: {$sum: 1},
        //             fail: {$sum: "$fail"},
        //             kakao: {$sum: "$kakao"},
        //             facebook: {$sum: "$facebook"},
        //             navertalk: {$sum: "$navertalk"},
        //             socket: {$sum: '$socket'}
        //         }
        // }
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ list: list });
        }
    });
};

module.exports.liveUserCount = function(req, res)
{
    var startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    var endDate = new Date();

    var query = [
        { $match: { botId: req.params.botId, inOut: true, created: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$userId', count: { $sum: 1 }} }
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ count: list.length });
        }
    });
};

module.exports.periodUserCount = function(req, res)
{
    var query = [
        { $match:
                {
                    botId: req.params.botId,
                    inOut: true,
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
                }
        },
        { $group: { _id: '$userId', count: { $sum: 1 }} }
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ count: list.length });
        }
    });
};

module.exports.dailyDialogUsage = function (req, res)
{
    var query = [
        { $match: { botId: req.params.botId, inOut: true, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } } },
        { $project:
            {
                _id: 0,
                created: {$add:["$created", 9*60*60*1000]},
                fail: {$cond:[{$eq: ["$isFail", true]}, 1,0]},
                kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
                facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
                navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]},
                socket: {$cond:[{$eq: ["$channel", "socket"]}, 1,0]}
            }
        },
        { $group:
            {
                _id: {year: { $year: "$created" }, month: { $month: "$created" }, day: { $dayOfMonth: "$created" }},
                total: {$sum: 1},
                fail: {$sum: "$fail"},
                kakao: {$sum: "$kakao"},
                facebook: {$sum: "$facebook"},
                navertalk: {$sum: "$navertalk"},
                socket: {$sum: '$socket'}
            }
        },
        { $sort: {_id:-1,  day: -1} }
    ];

    UserDialog.aggregate(query).exec(function (err, dailyDialog)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(dailyDialog);
        }
    });
};

exports.userInputStatistics = function (req, res)
{
    var query = [
        { $match:
                {
                    inOut: true,
                    dialog: { $nin: [null, ':reset user', ':build'] },
                    botId: req.params.botId,
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
                }
        },
        { $group: { _id: { dialog:'$dialog'}, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ];

    if(req.query.limit)
        query.push({ $limit: parseInt(req.query.limit) });

    UserDialog.aggregate(query).exec(function (err, list)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(list);
        }
    });
};

exports.failDailogs = function (req, res)
{
    var query = [
        { $match:
                {
                    botId: req.params.botId,
                    dialog: { $nin: [null,":reset user", ":build " + req.params.botId + " reset", ':build'] },
                    inOut: true,
                    isFail: true,
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) },
                    "channel" : { $ne: 'channel' }

                }
        },
        { $group: { _id: { dialog: "$dialog" }, count: { $sum: 1 } } },
        { $sort: {count: -1} }
    ];

    if(req.query.limit)
    {
        query.push({ $limit: parseInt(req.query.limit) });
    }

    UserDialog.aggregate(query).exec(function (err, list)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(list);
        }
    });
};

exports.scenarioUsage = function (req, res)
{
    var query = [
        { $match:
                {
                    botId: req.params.botId,
                    inOut: true,
                    dialogType: 'dialog',
                    dialogName: { $nin: [null, "답변없음"] },
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
                }
        },
        {$project:
            {
                _id: 0,
                channel: 1,
                dialogName:1,
                kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
                facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
                navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]},
                socket: {$cond:[{$eq: ["$channel", "socket"]}, 1,0]}
            }
        },
        {$group:
            {
                _id: {dialogName: '$dialogName'},
                total: {$sum: 1},
                kakao: {$sum: "$kakao"},
                facebook: {$sum: "$facebook"},
                navertalk: {$sum: "$navertalk"},
                socket: {$sum: '$socket'}
            }
        },
        {$sort: {total: -1}}
    ];

    if(req.query.limit)
    {
        query.push({ $limit: parseInt(req.query.limit) });
    }

    UserDialog.aggregate(query).exec(function (err, scenarioUsage)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var result = {};
            bot_js.load(req.params.botId, function () {
                result["scenarioUsage"] = scenarioUsage;
                result["botScenario"] = bot_js.bots[req.params.botId].dialogs;
                res.jsonp(result);
            });
        }
    });
};
