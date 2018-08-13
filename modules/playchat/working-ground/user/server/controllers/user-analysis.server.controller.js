var mongoose = require('mongoose');
var moment = require('moment');
var UserDialog = mongoose.model('UserDialog');


exports.userCount = function (req, res)
{
    var cond = { botId: req.params.bId, inOut: true };
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
    switch (req.body.userType){
        case  "new": console.log(1); break;
        case  "revisit": console.log(1); break;
    }
    UserDialog.aggregate(
        [
            {$match: cond},
            {$project:
                {
                    _id: 0,
                    botId:1,
                    inOut: 1,
                    channel: 1,
                    userId: 1,
                    created: {$add:["$created", 9*60*60*1000]}
                }
            },
            {$group:
                {
                    _id: {
                        year: { $year: "$created" },
                        month: { $month: "$created" },
                        day: { $dayOfMonth: "$created" },
                        userId: '$userId',
                        channel: "$channel"
                    }
                }
            },
            {$project:
                {
                    _id: 1,
                    kakao: {$cond:[{$eq: ["$_id.channel", "kakao"]}, 1,0]},
                    facebook: {$cond:[{$eq: ["$_id.channel", "facebook"]}, 1,0]},
                    navertalk: {$cond:[{$eq: ["$_id.channel", "navertalk"]}, 1,0]},
                    socket: {$cond:[{$eq: ["$_id.channel", "socket"]}, 1,0]}
                }
            },
            {$group:
                {
                    _id: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: '$_id.day'
                    },
                    total: {$sum: 1},
                    kakao: {$sum: "$kakao"},
                    facebook: {$sum: "$facebook"},
                    navertalk: {$sum: "$navertalk"},
                    socket: {$sum: '$socket'}
                }
            },
            {$sort: {_id:-1,  date: -1}}
        ]
    ).exec(function (err, userCounts)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.json(userCounts);
        }
    });
};
