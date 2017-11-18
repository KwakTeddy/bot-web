var mongoose = require('mongoose');
var moment = require('moment');
var UserDialog = mongoose.model('UserDialog');

exports.dialogTrainingInputStatistics = function (req, res)
{
    var cond = {inOut: true, dialog: {$ne: null}, botId: req.params.botId};
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
        default : cond.channel = {$ne: "socket"}; break;
    }

    var query = [
        {$match: cond},
        {$group: {_id: {dialog:'$dialog', dialogName: '$dialogName', dialogId:"$dialogId"}, count: {$sum: 1}}},

        {$sort: {count: -1}}
    ];

    if(req.body.limit) query.push({$limit: req.body.limit});

    UserDialog.aggregate(query).exec(function (err, userInputCounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(userInputCounts);
        }
    });
};
