var path = require('path');
var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');
var botLib = require(path.resolve('./engine/bot.js'));

exports.dialogGraphUsage = function (req, res)
{
    var query = [
        { $match: { botId: req.params.botId, created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }, inOut: true,  dialog: {$ne: ':reset user'}, dialogName: {$nin: ["답변없음", '시작', 'no_dialog']}, dialogId: {$ne: null} } },
        { $project:
            {
                _id: 0,
                channel: 1,
                dialogName:1,
                kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
                facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
                navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]}
            }
        },
        {$group:
            {
                _id: {dialogName: '$dialogName'},
                total: {$sum: 1},
                kakao: {$sum: "$kakao"},
                facebook: {$sum: "$facebook"},
                navertalk: {$sum: "$navertalk"}
            }
        },
        { $sort: {total: -1} }
    ];

    UserDialog.aggregate(query).exec(function (err, senarioUsage)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var result = {};
            if(global._bot && global._bot[req.params.botId])
            {
                result["senarioUsage"] = senarioUsage;
                result["botSenario"] = global._bot[req.params.botId];
                res.jsonp(result);
            }
            else
            {
                botLib.loadBot(req.params.botId, function (realbot)
                {
                    result["senarioUsage"] = senarioUsage;
                    result["botSenario"] = realbot.dialogs;
                    res.jsonp(result);
                })
            }
        }
    });
};
