var mongoose = require('mongoose');
var moment = require('moment');
var UserDialog = mongoose.model('UserDialog');

module.exports.dailyDialogUsage = function (req, res)
{
    var cond = {botId: req.body.botId, inOut: true};
    var startYear =  parseInt(req.body.date.start.split('/')[0]);
    var startMonth = parseInt(req.body.date.start.split('/')[1]);
    var startDay =   parseInt(req.body.date.start.split('/')[2]);
    var endYear =  parseInt(req.body.date.end.split('/')[0]);
    var endMonth = parseInt(req.body.date.end.split('/')[1]);
    var endDay =   parseInt(req.body.date.end.split('/')[2]);
    cond['created'] = {$gte: moment.utc([startYear, startMonth - 1, startDay]).subtract(9*60*60, "seconds").toDate(), $lte: moment.utc([endYear, endMonth - 1, endDay,  23, 59, 59, 999]).subtract(9*60*60, "seconds").toDate()};
    switch (req.body.channel){
        case "facebook": cond.channel = "facebook"; break;
        case "kakao": cond.channel = "kakao"; break;
        case "navertalk": cond.channel = "navertalk"; break;
        // default : cond.channel = {$ne: "socket"}; break;
    }

    UserDialog.aggregate(
        [
            {$match: cond},
            {$project:
                {
                    _id: 0,
                    created: {$add:["$created", 9*60*60*1000]},
                    fail: {$cond:[{$eq: ["$fail", true]}, 1,0]},
                    kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
                    facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
                    navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]}
                }
            },
            {$group:
                {
                    _id: {year: { $year: "$created" }, month: { $month: "$created" }, day: { $dayOfMonth: "$created" }},
                    total: {$sum: 1},
                    fail: {$sum: "$fail"},
                    kakao: {$sum: "$kakao"},
                    facebook: {$sum: "$facebook"},
                    navertalk: {$sum: "$navertalk"}
                }
            },
            {$sort: {_id:-1,  day: -1}}
        ]
    ).exec(function (err, dailyDialog) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // replace ";reset user" to 시작
            // dailyDialog.forEach(function(item) {
            //   if (item._id == ":reset user")
            //     item._id = "시작";
            // });
            res.jsonp(dailyDialog);
        }
    });
};
