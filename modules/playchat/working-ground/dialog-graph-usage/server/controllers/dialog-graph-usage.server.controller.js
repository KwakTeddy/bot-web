var path = require('path');
var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');
var bot_js = require(path.resolve('./engine2/bot.js'));

exports.dialogGraphUsage = function (req, res)
{
    var query = [
        { $match:
                {
                    botId: req.params.botId,
                    created: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) },
                    inOut: true,
                    nlpDialog: {$ne: ':reset user'},
                    dialogName: {$nin: ["답변없음", '시작', 'no_dialog']},
                    dialogId: {$ne: null},
                    dialogType: 'dialog'
                }
        },
        { $project:
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
                socket: {$sum: "socket"}
            }
        },
        { $sort: {total: -1} }
    ];

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
