var mongoose = require('mongoose');
var BotIntentFail = mongoose.model('BotIntentFail');

exports.dialogFailureMaintenanceList = function (req, res) {
    BotIntentFail.aggregate(
        [{$match: {botId: req.bot.id, clear: {$ne: true}}},
            {$group: {_id: '$intent'}}
            // {$group: {_id: '$intent', userDialog: {$push: '$userDialog'}}}
        ]
    ).exec(function (err, data) {
        if (err){
            console.log(err)
        }else {
            // console.log(util.inspect(data));
            //
            // UserDialog.populate(data, {path: 'userDialog'}, function (err, result) {
            //   console.log(util.inspect(err))
            //   console.log(util.inspect(result));
            //   if (err){
            //     console.log(err)
            //   }else {
            //     for(var i = 0; i < result.length; i++){
            //       result[i].userDialog
            //     }
            //   }
            //
            // })
            Intent.populate(data, {path: '_id'},function (err, result) {
                if (err){
                    console.log(err)
                }else {
                    res.json(result)
                }
            });
        }
    })
};

exports.sessionSuccessList = function (req, res) {
    var cond = {botId: req.body.botId, inOut: true};
    var startYear =  parseInt(req.body.date.start.split('/')[0]);
    var startMonth = parseInt(req.body.date.start.split('/')[1]);
    var startDay =   parseInt(req.body.date.start.split('/')[2]);
    var endYear =  parseInt(req.body.date.end.split('/')[0]);
    var endMonth = parseInt(req.body.date.end.split('/')[1]);
    var endDay =   parseInt(req.body.date.end.split('/')[2]);
    cond['created'] = {$gte: moment.utc([startYear, startMonth - 1, startDay]).subtract(9*60*60, "seconds").toDate(), $lte: moment.utc([endYear, endMonth - 1, endDay,  23, 59, 59, 999]).subtract(9*60*60, "seconds").toDate()};
    cond.channel = {$ne: "socket"};

    UserDialog.aggregate(
        [
            {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', fail:'$fail', botId:"$botId"}},
            {$match: cond},
            {$group: {_id: '$dialog', count: {$sum: 1}}},
            {$sort: {count: -1}}
        ]
    ).exec(function (err, userCounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(userCounts);
        }
    });
};
